import { Router } from 'express'
import { paymentController } from './payment.controller'

const router = Router()

router.post('/create-payment', paymentController.createPayment)
router.post('/confirmation', paymentController.confirmationController)

export const PaymentRoutes = router
