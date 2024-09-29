import httpStatus from 'http-status'
import { TUserProfileUpdate } from './user.interface'
import { User } from './user.model'
import AppError from '../../errors/AppError'
import { JwtPayload } from 'jsonwebtoken'
import { USER_STATUS, UserSearchableFields } from './user.constant'
import { TImageFile } from '../../interface/image.interface'
import { QueryBuilder } from '../../builder/QueryBuilder'

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find().populate('following').populate('followers'),
    query
  )
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
    // status: USER_STATUS.ACTIVE,
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
    { isBlocked: !isUserExists?.isBlocked },

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

export const followUserIntoDb = async (
  currentUserId: string,
  followUserId: string
) => {
  if (currentUserId === followUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself')
  }

  const currentUser = await User.findById(currentUserId)
  const targetUser = await User.findById(followUserId)

  if (!currentUser || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  if (currentUser.following.includes(followUserId)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are already following this user'
    )
  }

  currentUser.following.push(followUserId)
  targetUser.followers.push(currentUserId)

  await currentUser.save()
  await targetUser.save()

  return {
    message: 'User followed successfully.',
  }
}

// export const unFollowUserIntoDb = async (
//   currentUserId: string,
//   unFollowUserId: string
// ) => {
//   if (currentUserId === unFollowUserId) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'You cannot un follow yourself')
//   }

//   const currentUser = await User.findById(currentUserId)
//   const targetUser = await User.findById(unFollowUserId)

//   if (!currentUser || !targetUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
//   }

//   if (!currentUser.following.includes(unFollowUserId)) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'You are not following this user'
//     )
//   }

//   currentUser.following = currentUser.following.filter(
//     (userId: string) => userId !== unFollowUserId
//   )
//   targetUser.followers = targetUser.followers.filter(
//     (userId: string) => userId !== currentUserId
//   )

//   await currentUser.save()
//   await targetUser.save()

//   return { message: 'User un followed successfully.' }
// }

import { Types } from 'mongoose'
import { AppError } from '../utils/appError' // Assuming you have a custom AppError utility
import { User } from './user.model' // Assuming your user model is imported like this
import httpStatus from 'http-status' // Assuming you're using http-status for error codes

export const unFollowUserIntoDb = async (
  currentUserId: string,
  unFollowUserId: string
) => {
  // Ensure the user isn't trying to unfollow themselves
  if (currentUserId === unFollowUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot unfollow yourself')
  }

  // Find both users in the database
  const currentUser = await User.findById(currentUserId)
  const targetUser = await User.findById(unFollowUserId)

  // If either user doesn't exist, return an error
  if (!currentUser || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
  }

  // Check if the current user is actually following the target user
  if (!currentUser.following.includes(unFollowUserId)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You are not following this user'
    )
  }

  // Remove the target user from the current user's 'following' list
  currentUser.following = currentUser.following.filter(
    (userId: Types.ObjectId) => userId.toString() !== unFollowUserId
  )

  // Remove the current user from the target user's 'followers' list
  targetUser.followers = targetUser.followers.filter(
    (userId: Types.ObjectId) => userId.toString() !== currentUserId
  )

  // Save both users after the changes
  await currentUser.save()
  await targetUser.save()

  // Return a success message
  return { message: 'User unf ollowed successfully.' }
}

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDb,
  followUserIntoDb,
  getCurrentUserProfileFromDB,
  updateCurrentUserProfileIntoDB,
  makeUserAnAdminIntoDb,
  blockUserIntoDb,
  deleteUserIntoDb,
  unFollowUserIntoDb,
}
