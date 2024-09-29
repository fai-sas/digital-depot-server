import httpStatus from 'http-status'
import { QueryBuilder } from '../../builder/QueryBuilder'
import { PostSearchableFields } from './posts.constants'
import TPosts from './posts.interface'
import { Post } from './posts.model'
import AppError from '../../errors/AppError'

const createPostIntoDb = async (payload: TPosts) => {
  const existingPost = await Post.findOne({ name: payload.title })

  if (existingPost) {
    throw new Error('Post already exists')
  }

  const result = await Post.create(payload)

  return result
}

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Post.find().populate('postedBy'), query)
    .search(PostSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const meta = await productQuery.countTotal()
  const result = await productQuery.modelQuery

  return {
    meta,
    result,
  }
}

const getSinglePostFromDb = async (id: string) => {
  const result = await Post.findById(id)

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Requested Post Not Found')
  }

  return result.populate('postedBy')
}

const upVoteIntoDb = async (id: string) => {
  const post = await Post.findById(id)

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Requested Post Not Found')
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { upvote: (post.upvote ?? 0) + 1, totalVotes: post.totalVotes + 1 },

    // Increment upvote, use 0 if it's undefined
    {
      new: true,
      runValidators: true,
    }
  )

  return updatedPost
}

const downVoteIntoDb = async (id: string) => {
  const post = await Post.findById(id)

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Requested Post Not Found')
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { downvote: (post.downvote ?? 0) + 1, totalVotes: post.totalVotes - 1 }, // Decrement upvote, use 0 if it's undefined
    {
      new: true,
      runValidators: true,
    }
  )

  return updatedPost
}

const updatePostIntoDb = async (id: string, payload: Partial<TPosts>) => {
  const isPostExists = await Post.findById(id)

  if (!isPostExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Requested Post Not Found')
  }

  const { images, ...remainingData } = payload

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingData,
  }

  if (images && Object.keys(images).length) {
    for (const [key, value] of Object.entries(images)) {
      modifiedUpdatedData[`images.${key}`] = value
    }
  }

  const result = await Post.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  })

  return result?.populate('postedBy')
}

const deletePostFromDb = async (id: string) => {
  const isPostExists = await Post.findById(id)

  if (!isPostExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Requested Post Not Found')
  }

  const result = await Post.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    }
  )

  return result
}

export const PostServices = {
  createPostIntoDb,
  getAllPostsFromDB,
  getSinglePostFromDb,
  upVoteIntoDb,
  downVoteIntoDb,
  updatePostIntoDb,
  deletePostFromDb,
}
