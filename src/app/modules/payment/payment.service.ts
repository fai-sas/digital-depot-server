import { join } from 'path'
import { initiatePayment, verifyPayment } from './payment.utils'
import { readFileSync } from 'fs'
import { Payment } from './payment.model'
import { Post } from '../posts/posts.model'

const createPaymentIntoDB = async (payment: any) => {
  const { user, totalPrice } = payment

  const transactionId = `TXN-${Date.now()}`

  const order = new Payment({
    user,
    totalPrice,
    status: 'Pending',
    paymentStatus: 'Pending',
    transactionId,
  })

  await order.save()

  const paymentData = {
    transactionId,
    totalPrice,
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: user.phone,
  }

  //payment
  const paymentSession = await initiatePayment(paymentData)

  console.log(paymentSession)

  return paymentSession
}

const confirmationService = async (transactionId: string, status: string) => {
  const verifyResponse = await verifyPayment(transactionId)
  console.log(verifyResponse)

  let result
  let message = ''

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    result = await Post.findOneAndUpdate(
      { transactionId },
      {
        paymentStatus: 'Paid',
      }
    )
    message = 'Successfully Paid!'
  } else {
    message = 'Payment Failed!'
  }

  const filePath = join(__dirname, '../../../../public/confirmation.html')
  let template = readFileSync(filePath, 'utf-8')

  template = template.replace('{{message}}', message)

  return template
}

export const paymentServices = {
  createPaymentIntoDB,
  confirmationService,
}
