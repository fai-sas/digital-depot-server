import express from 'express'

import { USER_ROLE } from '../user/user.constant'

import { PostControllers } from './posts.controller'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/create-post',
  auth(USER_ROLE.USER),
  // validateRequest(PostValidation.createPostValidationSchema),
  PostControllers.createPost
)

router.get('/', PostControllers.getAllPosts)

router.get('/my-posts', auth(USER_ROLE.USER), PostControllers.getUserPosts)

// router.get('/my-posts', PostControllers.getUserPosts)

router.get('/:id', PostControllers.getSinglePost)

router.put('/upvote/:id', auth(USER_ROLE.USER), PostControllers.upVote)

router.put('/downvote/:id', auth(USER_ROLE.USER), PostControllers.downVote)

router.put('/update/:id', PostControllers.updatePost)

router.delete('/:id', PostControllers.deletePost)

export const PostRoutes = router
