import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { ActivityServices } from './activity.service'

const createActivity = catchAsync(async (req, res) => {
  const userId = req.user.userId // Ensure you pass the user._id here
  const { action, details } = req.body

  const result = await ActivityServices.createActivityIntoDb(
    userId,
    action,
    details
  )

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Activity created successfully',
    data: result,
  })
})

const getAllActivities = catchAsync(async (req, res) => {
  const result = await ActivityServices.getActivityFromDb(req.query)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activities retrieved successfully',
    meta: result.meta,
    data: result.result,
  })
})

export const ActivityControllers = {
  // createActivity,
  getAllActivities,
}
