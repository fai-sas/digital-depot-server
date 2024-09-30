import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import bcrypt from 'bcrypt'
import { USER_ROLE } from '../user/user.constant'
import { TUser } from '../user/user.interface'
import { createToken } from './auth.utils'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { sendEmail } from '../../utils/sendEmail'
import { ActivityLog } from '../activity/activity.model'
import { ActivityServices } from '../activity/activity.service'

const signUpUserIntoDb = async (payload: TUser) => {
  // const existingUser = await User.findOne({ email: payload.email })
  const existingUser = await User.isUserExists(payload?.email)

  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  const result = await User.create(payload)

  const userObj = result?.toObject()
  // delete userObj?.password

  return userObj
}

export const socialRegisterUserIntoDb = async (payload: TLoginUser) => {
  // Check if user already exists by email
  const existingUser = await User.findOne({ email: payload.email })

  if (existingUser) {
    return existingUser
  }

  // Create a new user without a password for social logins
  const newUser = await User.create({
    ...payload,
    role: 'USER',
    status: 'ACTIVE',
    isSocialLogin: true,
  })

  return newUser
}

const signInUserIntoDb = async (payload: Partial<TUser>) => {
  const user = await User.findOne({ email: payload.email })
    .select('+password')
    .populate('followers')
    .populate('following')

  // const user = await User.isUserExists(payload?.email as string)

  // check if user exists
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }

  // checking if the user is blocked

  const userStatus = user?.status

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  // check if password is correct
  if (
    !(await User.isPasswordMatched(
      payload?.password as string,
      user?.password as string
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match')
  }

  const jwtPayload = {
    userId: user._id,
    name: user.name,
    email: user.email,
    profilePhoto: user.profilePhoto,
    mobileNumber: user.mobileNumber,
    role: user.role,
    userType: user.userType,
    status: user.status,
    followers: user.followers,
    following: user.following,
    isVerified: user.isVerified,
    totalCost: user.totalCost,
    paymentStatus: user.paymentStatus,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  )

  // Log the activity with error handling
  try {
    console.log('Attempting to log activity...') // Add debug log
    await ActivityServices.createActivityIntoDb(
      user._id,
      'User signed in',
      `User signed in successfully with email: ${user.email}`
    )
    console.log('Activity logged successfully!') // Success log
  } catch (error) {
    console.error('Failed to log activity:', error) // Log the error
  }

  return {
    accessToken,
    refreshToken,
  }
}

const socialLoginUserIntoDb = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload.email })

  if (!user) {
    const user = await socialRegisterUserIntoDb(payload)

    const jwtPayload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      mobileNumber: user.mobileNumber,
      role: user.role,
      status: user.status,
    }

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    )

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    )

    return {
      accessToken,
      refreshToken,
    }
  } else {
    const jwtPayload = {
      email: user.email,
      role: user.role,
      _id: user._id,
    }

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    )

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    )

    return {
      accessToken,
      refreshToken,
    }
  }
}

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // checking if the user is exist
  const user = await User.isUserExists(userData.email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  // checking if the user is blocked

  const userStatus = user?.status

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  //checking if the password is correct

  if (
    !(await User.isPasswordMatched(
      payload.oldPassword,
      user?.password as string
    ))
  )
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')

  // checking if the new password is the same as the current password
  if (
    await User.isPasswordMatched(payload.newPassword, user?.password as string)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'New password cannot be the same as the current password'
    )
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  )

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  )

  return null
}

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload

  const { email, iat } = decoded

  // checking if the user is exist
  const user = await User.isUserExists(email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  // checking if the user is blocked
  const userStatus = user?.status

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !')
  }

  const jwtPayload = {
    userId: user._id,
    name: user.name,
    email: user.email,
    profilePhoto: user.profilePhoto,
    mobileNumber: user.mobileNumber,
    role: user.role,
    status: user.status,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  )

  return {
    accessToken,
  }
}

const forgetPassword = async (email: string) => {
  // check if the user is exist
  const user = await User.isUserExists(email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  // checking if the user is blocked
  const userStatus = user?.status

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  const jwtPayload = {
    userId: user._id,
    name: user.name,
    email: user.email,
    profilePhoto: user.profilePhoto,
    mobileNumber: user.mobileNumber,
    role: user.role,
    status: user.status,
  }
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_refresh_expires_in as string
  )

  const resetPasswordLink = `${config.reset_password_ui_link}?email=${user.email}&token=${resetToken} `

  sendEmail(user.email, resetPasswordLink)

  console.log({ resetPasswordLink })
}

const resetPassword = async (
  email: string,
  newPassword: string,
  token: string
) => {
  console.log('Payload:', email, newPassword)

  // checking if the user exists
  const user = await User.isUserExists(email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  // checking if the user is blocked
  const userStatus = user?.status

  if (userStatus === 'BLOCKED') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload

  if (email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!')
  }

  // Check if newPassword is available before hashing
  if (!newPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'New password is required!')
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  )

  console.log('New password:', newPassword)
  console.log('Salt rounds:', config.bcrypt_salt_rounds)
  // console.log('New hashed password:', newHashedPassword)

  await User.findOneAndUpdate(
    {
      email: decoded.email,
      role: decoded.role,
    },
    {
      // password: newHashedPassword,
      password: newPassword,
      passwordChangedAt: new Date(),
    }
  )
}

export const AuthServices = {
  signUpUserIntoDb,
  signInUserIntoDb,
  socialRegisterUserIntoDb,
  socialLoginUserIntoDb,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
}
