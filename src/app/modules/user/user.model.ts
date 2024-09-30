import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import { TUser, UserModel } from './user.interface'
import config from '../../config'
import { USER_ROLE, USER_STATUS, USER_TYPE } from './user.constant'

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      default: 'USER',
    },
    userType: {
      type: String,
      enum: Object.keys(USER_TYPE),
      default: 'BASIC',
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    transactionId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    email: {
      type: String,
      required: true,
      //validate email
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: function () {
        // Only require password if it's NOT a social login
        return !this.isSocialLogin
      },
      select: false, // Don't return the password in queries by default
    },
    status: {
      type: String,
      enum: Object.keys(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    mobileNumber: {
      type: String,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    isSocialLogin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Password hash middleware for traditional sign ups
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  if (!this.isSocialLogin && this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    )
  }
  next()
})

// userSchema.pre('save', async function (next) {
//   const user = this
//   user?.password = await bcrypt.hash(
//     user?.password,
//     Number(config.bcrypt_salt_rounds)
//   )
//   next()
// })

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

// filter out deleted documents
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

userSchema.statics.isUserExists = async function (email: string) {
  return await User.findOne({ email }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: number,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000
  return passwordChangedTime > jwtIssuedTimestamp
}

export const User = model<TUser, UserModel>('User', userSchema)
