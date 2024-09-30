/* eslint-disable no-unused-vars */
import { Model, Schema } from 'mongoose'
import { USER_ROLE, USER_STATUS, USER_TYPE } from './user.constant'

export interface TUser {
  _id: string
  name: string
  role: keyof typeof USER_ROLE
  email: string
  password?: string
  followers: Schema.Types.ObjectId
  following: Schema.Types.ObjectId
  isSocialLogin: boolean
  userType: keyof typeof USER_TYPE
  status: keyof typeof USER_STATUS
  passwordChangedAt?: Date
  mobileNumber?: string
  profilePhoto?: string
  isDeleted: boolean
  isBlocked: boolean
  createdAt?: Date
  updatedAt?: Date
  isVerified: boolean
  totalCost: number
  paymentStatus?: 'Pending' | 'Paid' | 'Failed'
  transactionId: string
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
