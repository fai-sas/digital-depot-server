import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { UserServices } from './user.service'
import { TImageFile } from '../../interface/image.interface'

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB(req.query)
  console.log(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserServices.getSingleUserFromDb(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  })
})

const getCurrentUserProfile = catchAsync(async (req, res) => {
  const user = req.user
  const result = await UserServices.getCurrentUserProfileFromDB(user)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My Profile Retrieved Successfully',
    data: result,
  })
})

// const updateCurrentUserProfile = catchAsync(async (req, res) => {
//   const result = await UserServices.updateCurrentUserProfileIntoDB(
//     req.user,
//     req.body,
//     req.file as TImageFile
//   )

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Profile updated successfully',
//     data: result,
//   })
// })

const updateCurrentUserProfile = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserServices.updateCurrentUserProfileIntoDB(id, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  })
})

const makeUserAnAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserServices.makeUserAnAdminIntoDb(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Role Changed to Admin successfully',
    data: result,
  })
})

const blockUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserServices.blockUserIntoDb(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Role Changed to Admin successfully',
    data: result,
  })
})

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await UserServices.deleteUserIntoDb(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Deleted successfully',
    data: result,
  })
})

const followUser = catchAsync(async (req, res) => {
  const { followUserId } = req.params
  const userId = req.user.userId
  const result = await UserServices.followUserIntoDb(userId, followUserId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Followed successfully',
    data: result,
  })
})

const unFollowUser = catchAsync(async (req, res) => {
  const { unFollowUserId } = req.params
  const userId = req.user.userId
  const result = await UserServices.unFollowUserIntoDb(userId, unFollowUserId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Un Followed successfully',
    data: result,
  })
})

export const UserControllers = {
  getAllUsers,
  getSingleUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  makeUserAnAdmin,
  blockUser,
  deleteUser,
  followUser,
  unFollowUser,
}
