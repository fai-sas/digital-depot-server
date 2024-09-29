import express from 'express'
import validateRequest, {
  validateRequestCookies,
} from '../../middlewares/validateRequest'
import { UserControllers } from './user.controller'
import { USER_ROLE } from './user.constant'
import auth from '../../middlewares/auth'
import { parseBody } from '../../middlewares/bodyParser'
import { upload } from '../../utils/sendImageToCloudinary'

const router = express.Router()

// router.get('/', auth(USER_ROLE.ADMIN), UserControllers.getAllUsers)
router.get('/', UserControllers.getAllUsers)

router.get(
  '/profile',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.getCurrentUserProfile
)

router.put(
  '/profile/update',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.updateCurrentUserProfile
)

router.post(
  '/follow/:followUserId',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.followUser
)

router.post(
  '/unfollow/:unFollowUserId',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.unFollowUser
)

router.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.getSingleUser
)

router.put(
  '/make-admin/:id',
  auth(USER_ROLE.ADMIN),
  UserControllers.makeUserAnAdmin
)

router.put('/block-user/:id', auth(USER_ROLE.ADMIN), UserControllers.blockUser)

router.delete(
  '/delete-user/:id',
  auth(USER_ROLE.ADMIN),
  UserControllers.deleteUser
)

// router.patch(
//   '/profile',
//   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
//   multerUpload.single('profilePhoto'),
//   parseBody,
//   UserControllers.updateCurrentUserProfile
// )

// router.patch(
//   '/profile',
//   auth(USER_ROLE.ADMIN, USER_ROLE.USER),
//   upload.single('profilePhoto'),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = JSON.parse(req.body.data)
//     next()
//   },
//   UserControllers.updateCurrentUserProfile
// )

export const UserRoutes = router
