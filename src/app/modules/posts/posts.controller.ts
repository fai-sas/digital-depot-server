import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'
import { PostServices } from './posts.service'
import AppError from '../../errors/AppError'

const createPost = catchAsync(async (req, res) => {
  const result = await PostServices.createPostIntoDb(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Post created successfully',
    data: result,
  })
})

const getAllPosts = catchAsync(async (req, res) => {
  const result = await PostServices.getAllPostsFromDB(req.query)
  // console.log(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post retrieved successfully',
    meta: result.meta,
    data: result.result,
  })
})

const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PostServices.getSinglePostFromDb(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post retrieved successfully',
    data: result,
  })
})

const upVote = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PostServices.upVoteIntoDb(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post up voted successfully',
    data: result,
  })
})

const downVote = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PostServices.downVoteIntoDb(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post down voted successfully',
    data: result,
  })
})

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await PostServices.deletePostFromDb(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post Deleted successfully',
    data: result,
  })
})

export const PostControllers = {
  createPost,
  getAllPosts,
  getSinglePost,
  upVote,
  downVote,
  deletePost,
}
