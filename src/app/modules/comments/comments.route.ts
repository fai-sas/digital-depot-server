import express from 'express'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'
import { CommentControllers } from './comments.controller'

const router = express.Router()

router.post(
  '/create-comment',
  auth(USER_ROLE.USER),
  CommentControllers.createComment
)

router.get(
  '/',
  // auth(USER_ROLE.USER),
  CommentControllers.getAllComments
)

router.get(
  '/:id',
  // auth(USER_ROLE.USER),
  CommentControllers.getSingleComment
)

router.put(
  '/update/:id',
  auth(USER_ROLE.USER),
  CommentControllers.updateComment
)

router.delete('/:id', auth(USER_ROLE.USER), CommentControllers.deleteComment)

export const CommentRoutes = router
