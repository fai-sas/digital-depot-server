import httpStatus from 'http-status'
import { TUserProfileUpdate } from './user.interface'
import { User } from './user.model'
import AppError from '../../errors/AppError'
import { JwtPayload } from 'jsonwebtoken'
import { USER_STATUS, UserSearchableFields } from './user.constant'
import { TImageFile } from '../../interface/image.interface'
import { QueryBuilder } from '../../builder/QueryBuilder'

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const meta = await userQuery.countTotal()
  const result = await userQuery.modelQuery

  return {
    meta,
    result,
  }
}

const getSingleUserFromDb = async (id: string) => {
  const result = await User.findById(id)

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  return result
}

const getCurrentUserProfileFromDB = async (user: JwtPayload) => {
  const profile = await User.findOne({
    email: user.email,
    status: USER_STATUS.ACTIVE,
  })

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, 'User does not exists!')
  }

  return profile
}

const updateCurrentUserProfileIntoDB = async (
  user: JwtPayload,
  data: Partial<TUserProfileUpdate>,
  profilePhoto: TImageFile
) => {
  const filter = {
    email: user.email,
    status: USER_STATUS.ACTIVE,
  }

  const profile = await User.findOne(filter)

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, 'User profile does not exists!')
  }

  if (profilePhoto) {
    data.profilePhoto = profilePhoto.path
  } else {
    delete data.profilePhoto
  }

  return await User.findOneAndUpdate(filter, data, { new: true })
}

const makeUserAnAdminIntoDb = async (id: string) => {
  const isUserExists = await User.findById(id)

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  const result = await User.findByIdAndUpdate(
    id,
    { role: 'ADMIN' },
    {
      new: true,
      runValidators: true,
    }
  )

  return result
}

const blockUserIntoDb = async (id: string) => {
  const isUserExists = await User.findById(id)

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  const result = await User.findByIdAndUpdate(
    id,
    { status: 'BLOCKED' },
    {
      new: true,
      runValidators: true,
    }
  )

  return result
}

const deleteUserIntoDb = async (id: string) => {
  const isUserExists = await User.findById(id)

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    }
  )

  return result
}

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDb,
  getCurrentUserProfileFromDB,
  updateCurrentUserProfileIntoDB,
  makeUserAnAdminIntoDb,
  blockUserIntoDb,
  deleteUserIntoDb,
}
