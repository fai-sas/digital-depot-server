import { Router } from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/auth/auth.routes'
import { PostRoutes } from '../modules/posts/posts.route'
import { CommentRoutes } from '../modules/comments/comments.route'
import { ActivityRoutes } from '../modules/activity/activity.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/auth',
    routes: AuthRoutes,
  },
  {
    path: '/user',
    routes: UserRoutes,
  },
  {
    path: '/posts',
    routes: PostRoutes,
  },
  {
    path: '/comments',
    routes: CommentRoutes,
  },
  {
    path: '/activity',
    routes: ActivityRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.routes))

export default router
