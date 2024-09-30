import { QueryBuilder } from '../../builder/QueryBuilder'
import { ActivityLog } from './activity.model'

const createActivityIntoDb = async (userId, action, details) => {
  try {
    // console.log(`Logging activity for user: ${userId}, action: ${action}`)
    const result = await ActivityLog.create({
      user: userId,
      action,
      details,
    })

    return result
  } catch (error) {
    console.error('Error creating activity log:', error)
    throw error
  }
}

const getActivityFromDb = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    ActivityLog.find().populate('user'),
    query
  )
    .filter()
    .sort()
    .fields()

  const meta = await productQuery.countTotal()
  const result = await productQuery.modelQuery

  return {
    meta,
    result,
  }
}

export const ActivityServices = {
  createActivityIntoDb,
  getActivityFromDb,
}
