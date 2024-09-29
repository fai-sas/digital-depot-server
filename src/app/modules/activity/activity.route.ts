import express from 'express'
import { ActivityControllers } from './activity.controller'

const router = express.Router()

// router.post('/create-activity', ActivityControllers.createActivity)

router.get('/', ActivityControllers.getAllActivities)

export const ActivityRoutes = router
