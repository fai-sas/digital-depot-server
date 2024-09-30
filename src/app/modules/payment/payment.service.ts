import { join } from 'path'
import { initiatePayment, verifyPayment } from './payment.utils'
import { readFileSync } from 'fs'
import { Payment } from './payment.model'
import { User } from '../user/user.model'
import { USER_TYPE } from '../user/user.constant'

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
    userId: user._id,
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
  // Verify the payment status using the transactionId
  const verifyResponse = await verifyPayment(transactionId)
  console.log(verifyResponse)

  let message = ''

  // Check if the payment was successful
  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    // Find the payment record by transactionId
    const payment = await Payment.findOne({ transactionId })

    if (payment) {
      // Update the payment status
      payment.paymentStatus = 'Paid'
      payment.status = 'Completed'
      await payment.save() // Save the updated payment

      // Find the user associated with the payment and update their userType and paymentStatus
      const user = await User.findByIdAndUpdate(
        payment?.user?.userId, // This is the user ID stored in the payment record
        {
          paymentStatus: 'Paid',
          userType: 'PREMIUM',
        },
        { new: true }
      )

      if (user) {
        message = 'Successfully Paid!'
      } else {
        message = 'User not found!'
      }
    } else {
      message = 'Payment not found!'
    }
  } else {
    message = 'Payment Failed!'
  }

  // Read the confirmation HTML template
  const filePath = join(__dirname, '../../../../public/confirmation.html')
  let template = readFileSync(filePath, 'utf-8')

  // Replace the message placeholder with the actual message
  template = template.replace('{{message}}', message)

  return template
}

export const paymentServices = {
  createPaymentIntoDB,
  confirmationService,
}
