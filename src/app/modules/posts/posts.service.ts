import httpStatus from 'http-status'
import { QueryBuilder } from '../../builder/QueryBuilder'
import { PostSearchableFields } from './posts.constants'
import TPosts from './posts.interface'
import { Post } from './posts.model'
import AppError from '../../errors/AppError'
import { Types } from 'mongoose'

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
    // .paginate()
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

const getUserPostFromDb = async (email: string) => {
  const result = await Post.find().populate({
    path: 'postedBy',
    match: { email: email },
  })

  const filteredResult = result.filter((post) => post.postedBy !== null)

  return filteredResult
}

const upVoteIntoDb = async (postId: string, userId: string) => {
  const post = await Post.findById(postId)

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Requested Post Not Found')
  }

  post.upvote = post.upvote || 0
  post.downvote = post.downvote || 0

  // Find if user has already voted on this post
  const existingVote = post.votes.find(
    (vote) => vote.user.toString() === userId
  )

  if (existingVote) {
    if (existingVote.voteType === 'upvote') {
      // If already up voted, prevent up voting again
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You have already up voted this post'
      )
    } else {
      // Toggle from downvote to upvote
      post.downvote -= 1
      post.upvote += 1
      existingVote.voteType = 'upvote'
    }
  } else {
    // If no existing vote, add new upvote
    post.upvote += 1
    post.votes.push({ user: userId, voteType: 'upvote' })
  }

  post.totalVotes = post.upvote - post.downvote
  await post.save()
  return post
}

const downVoteIntoDb = async (postId: string, userId: string) => {
  const post = await Post.findById(postId)

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Requested Post Not Found')
  }

  post.upvote = post.upvote || 0
  post.downvote = post.downvote || 0

  // Find if user has already voted on this post
  const existingVote = post.votes.find(
    (vote) => vote.user.toString() === userId
  )

  if (existingVote) {
    if (existingVote.voteType === 'downvote') {
      // If already down voted, prevent down voting again
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You have already down voted this post'
      )
    } else {
      // Toggle from upvote to downvote
      post.upvote -= 1
      post.downvote += 1
      existingVote.voteType = 'downvote'
    }
  } else {
    // If no existing vote, add new downvote
    post.downvote += 1
    post.votes.push({ user: userId, voteType: 'downvote' })
  }

  post.totalVotes = post.upvote - post.downvote
  await post.save()
  return post
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
  getUserPostFromDb,
  upVoteIntoDb,
  downVoteIntoDb,
  updatePostIntoDb,
  deletePostFromDb,
}
