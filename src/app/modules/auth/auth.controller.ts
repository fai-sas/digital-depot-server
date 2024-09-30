import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.services'
import config from '../../config'
import AppError from '../../errors/AppError'

const signUpUser = catchAsync(async (req, res) => {
  const result = await AuthServices.signUpUserIntoDb(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  })
})

const signInUser = catchAsync(async (req, res) => {
  const result = await AuthServices.signInUserIntoDb(req.body)
  const { refreshToken, accessToken } = result

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  })
})

const socialLoginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.socialLoginUserIntoDb(req.body)
  const { refreshToken, accessToken } = result

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  })
})

const socialRegisterUser = catchAsync(async (req, res) => {
  const result = await AuthServices.socialRegisterUserIntoDb(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  })
})

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body

  const result = await AuthServices.changePassword(req.user, passwordData)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully!',
    data: result,
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies
  const result = await AuthServices.refreshToken(refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved successfully!',
    data: result,
  })
})

const forgetPassword = catchAsync(async (req, res) => {
  const { email } = req.body

  const result = await AuthServices.forgetPassword(email)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated successfully!',
    data: result,
  })
})

const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword } = req.body
  const token = req?.headers?.authorization

  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Authorization token is missing!'
    )
  }

  // Log req.body to see its structure
  console.log('Request body:', req.body)

  const result = await AuthServices.resetPassword(
    email,
    newPassword,
    token as string
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successful!',
    data: result,
  })
})

const getMe = catchAsync(async (req, res) => {
  const userId = req.user.userId

  const result = await AuthServices.getMeFromDB(userId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved successfully',
    data: result,
  })
})

export const AuthControllers = {
  signUpUser,
  signInUser,
  socialLoginUser,
  socialRegisterUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  getMe,
}
