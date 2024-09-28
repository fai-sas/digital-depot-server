import express from 'express'
import validateRequest, {
  validateRequestCookies,
} from '../../middlewares/validateRequest'
import { AuthValidation } from './auth.validation'
import { AuthControllers } from './auth.controller'
import { USER_ROLE } from '../user/user.constant'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/register',
  validateRequest(AuthValidation.signUpUserValidationSchema),
  AuthControllers.signUpUser
)

router.post(
  '/social-register',
  validateRequest(AuthValidation.socialRegisterUserValidationSchema),
  AuthControllers.socialRegisterUser
)

router.post(
  '/login',
  validateRequest(AuthValidation.signInUserValidationSchema),
  AuthControllers.signInUser
)

router.post(
  '/social-login',
  validateRequest(AuthValidation.socialLoginValidationSchema),
  AuthControllers.socialLoginUser
)

router.post(
  '/change-password',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
)

router.post(
  '/refresh-token',
  validateRequestCookies(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
)

router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword
)

router.post(
  '/reset-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.resetPassword
)

export const AuthRoutes = router
