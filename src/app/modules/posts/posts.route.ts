import express from 'express'

import { USER_ROLE } from '../user/user.constant'

import { PostControllers } from './posts.controller'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/create-post',
  // auth(USER_ROLE.USER),
  // validateRequest(PostValidation.createPostValidationSchema),
  PostControllers.createPost
)

router.get('/', PostControllers.getAllPosts)

router.get('/:id', PostControllers.getSinglePost)

router.put('/upvote/:id', PostControllers.upVote)

router.put('/downvote/:id', PostControllers.downVote)

export const PostRoutes = router
