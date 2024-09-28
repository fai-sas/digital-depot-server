import { z } from 'zod'
import { USER_ROLE, USER_STATUS } from '../user/user.constant'

const signUpUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    role: z.nativeEnum(USER_ROLE).default('USER'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({
        message: 'Invalid email',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.ACTIVE),
    mobileNumber: z.string().optional(),
  }),
})

const signInUserValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }),
  }),
})

export const socialRegisterUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    profilePhoto: z.string().optional(),
  }),
})

const socialLoginValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    email: z.string({ required_error: 'Email Id is required.' }),
  }),
})

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
})

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
})

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User Email Id is required',
    }),
  }),
})

export const AuthValidation = {
  signUpUserValidationSchema,
  socialRegisterUserValidationSchema,
  signInUserValidationSchema,
  socialLoginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
}
