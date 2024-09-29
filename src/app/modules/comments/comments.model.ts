import { Schema, model } from 'mongoose'
import { TComments } from './comments.interface'

const commentSchema = new Schema<TComments>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Posts',
      required: [true, 'User ID is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
    },
  },
  {
    timestamps: true,
  }
)

export const Comments = model<TComments>('Comments', commentSchema)
