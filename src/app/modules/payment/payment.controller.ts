import { Request, Response } from 'express'
import { paymentServices } from './payment.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import httpStatus from 'http-status'

const createPayment = catchAsync(async (req, res) => {
  const payment = req.body
  const result = await paymentServices.createPaymentIntoDB(payment)

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Payment made successfully',
    data: result,
  })
})

const confirmationController = async (req: Request, res: Response) => {
  const { transactionId, status } = req.query

  const result = await paymentServices.confirmationService(
    transactionId as string,
    status as string
  )
  res.send(result)
}

export const paymentController = {
  createPayment,
  confirmationController,
}
