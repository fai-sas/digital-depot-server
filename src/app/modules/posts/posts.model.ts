import { Schema, model } from 'mongoose'
import TPosts from './posts.interface'

const postSchema = new Schema<TPosts>(
  {
    title: {
      type: String,
      required: [true, 'Post Title is Required'],
    },
    description: {
      type: String,
      required: [true, 'Post Description is Required'],
    },
    images: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Post Category is Required'],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    upvote: {
      type: Number,
    },
    downvote: {
      type: Number,
    },
    // comments: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Comments',
    // },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Posted by User Id is Required'],
    },
    ratings: {
      type: Number,
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

export const Post = model<TPosts>('Posts', postSchema)
