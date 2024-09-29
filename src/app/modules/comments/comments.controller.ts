import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { CommentServices } from './comments.service'

const createComment = catchAsync(async (req, res) => {
  // const user = req.user.userId
  // const result = await CommentServices.createCommentIntoDb(req.body, user)
  const result = await CommentServices.createCommentIntoDb(req.body)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment Added Successfully',
    data: result,
  })
})

const getAllComments = catchAsync(async (req, res) => {
  const result = await CommentServices.getAllCommentsFromDB(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrieved successfully',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleComment = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await CommentServices.getSingleCommentFromDb(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment retrieved successfully',
    data: result,
  })
})

const updateComment = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await CommentServices.updateCommentIntoDb(id, req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  })
})

const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await CommentServices.deleteCommentFromDb(id)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment Deleted successfully',
    data: result,
  })
})

export const CommentControllers = {
  createComment,
  getAllComments,
  getSingleComment,
  updateComment,
  deleteComment,
}
