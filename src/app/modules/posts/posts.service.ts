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
  const productQuery = new QueryBuilder(Post.find(), query)
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

  return result
}

export const PostServices = {
  createPostIntoDb,
  getAllPostsFromDB,
  getSinglePostFromDb,
}
