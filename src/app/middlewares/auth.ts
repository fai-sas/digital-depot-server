import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import config from '../config'
import { User } from '../modules/user/user.model'
import { USER_ROLE } from '../modules/user/user.constant'

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization

    // check if the authorization header is missing
    if (!authorizationHeader) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    // check if the authorization header starts with "Bearer"
    // if (!authorizationHeader.startsWith('Bearer ')) {
    //   throw new AppError(
    //     httpStatus.UNAUTHORIZED,
    //     'Token must start with "Bearer"'
    //   )
    // }

    // extract the token

    // const token = authorizationHeader.split(' ')[1]
    const token = authorizationHeader

    // check if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload

    const { userId, email, role, iat } = decoded

    console.log('Decoded userId:', userId) // Ensure this is correct

    // Check if userId is undefined or invalid
    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User ID missing in token!')
    }

    // check if the user is exist
    const user = await User.findOne({ email })

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found !')
    }

    //  if (
    //    user.passwordChangedAt &&
    //    User.isJWTIssuedBeforePasswordChanged(
    //      user.passwordChangedAt,
    //      iat as number
    //    )
    //  ) {
    //    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !')
    //  }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, `You are not authorized !`)
    }

    req.user = decoded as JwtPayload

    next()
  })
}

export default auth
