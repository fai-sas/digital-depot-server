/* eslint-disable no-unused-vars */
import { Model } from 'mongoose'
import { USER_ROLE, USER_STATUS } from './user.constant'

export interface TUser {
  _id: string
  name: string
  role: keyof typeof USER_ROLE
  email: string
  password?: string
  isSocialLogin: boolean
  status: keyof typeof USER_STATUS
  passwordChangedAt?: Date
  mobileNumber?: string
  profilePhoto?: string
  isDeleted: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExists(id: string): Promise<TUser>

  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean
}

export type TUserProfileUpdate = {
  name: string
  mobileNumber: string
  profilePhoto?: string | null
}
