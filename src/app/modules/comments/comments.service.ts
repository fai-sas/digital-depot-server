import httpStatus from 'http-status'
import { Post } from '../posts/posts.model'
import { TComments } from './comments.interface'
import { Comments } from './comments.model'
import AppError from '../../errors/AppError'
import { User } from '../user/user.model'
import mongoose from 'mongoose'
import { QueryBuilder } from '../../builder/QueryBuilder'

const createCommentIntoDb = async (payload: Partial<TComments>) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const post = await Post.findById(payload.post)
    const user = await User.findById(payload.user)

    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, 'Post Not Found')
    }

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User Not Found')
    }

    const result = await Comments.create([payload], { session })

    await result[0].populate('post')
    await result[0].populate('user')

    await session.commitTransaction()
    session.endSession()

    return result
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, `${error?.message}`)
  }
}

const getAllCommentsFromDB = async (query: Record<string, unknown>) => {
  const carQuery = new QueryBuilder(Comments.find().populate('user'), query)
    // .search(CommentSearchableFields)
    .filter()
    .sort()
    // .paginate()
    .fields()

  const meta = await carQuery.countTotal()
  const result = await carQuery.modelQuery

  return {
    meta,
    result,
  }
}

const getSingleCommentFromDb = async (id: string) => {
  const result = await Comments.findById(id)

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, ' Comment Not Found')
  }

  await result.populate('post')
  await result.populate('user')

  return result
}

// const updateCommentIntoDb = async (id: string, payload: Partial<TComments>) => {
//   const isCommentExists = await Comments.findById(id)

//   if (!isCommentExists) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Requested Comment Not Found')
//   }

//   const result = await Comments.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   })

//   await result?.populate('post')
//   await result?.populate('user')

//   return result
// }

const updateCommentIntoDb = async (id: string, payload: Partial<TComments>) => {
  const session = await mongoose.startSession() // Start a Mongoose session

  try {
    session.startTransaction() // Begin the transaction

    // Check if the comment exists
    const isCommentExists = await Comments.findById(id)

    if (!isCommentExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Requested Comment Not Found')
    }

    // Perform the update
    const result = await Comments.findByIdAndUpdate(id, payload, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
      session, // Use the transaction session
    })

    // Populate the post and user fields
    await result?.populate('post')

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    return result
  } catch (error: any) {
    // Rollback the transaction on error
    await session.abortTransaction()
    session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, `${error?.message}`)
  }
}

const deleteCommentFromDb = async (id: string) => {
  const isCommentExists = await Comments.findById(id)

  if (!isCommentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Requested Comment Not Found')
  }

  const result = await Comments.findByIdAndDelete(id, {
    new: true,
    runValidators: true,
  })

  return result
}

export const CommentServices = {
  createCommentIntoDb,
  getAllCommentsFromDB,
  getSingleCommentFromDb,
  updateCommentIntoDb,
  deleteCommentFromDb,
}
