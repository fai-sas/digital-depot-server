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
    votes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        voteType: {
          type: String,
          enum: ['upvote', 'downvote'],
          required: true,
        },
      },
    ],
    totalVotes: {
      type: Number,
      default: 0,
    },
    upvote: {
      type: Number,
      default: 0,
    },
    downvote: {
      type: Number,
      default: 0,
    },
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// filter out deleted documents
postSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

postSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

export const Post = model<TPosts>('Posts', postSchema)
