import mongoose, { model, Schema } from 'mongoose'

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    action: { type: String, required: true },
    details: { type: String },
  },
  {
    timestamps: true,
  }
)

export const ActivityLog = model('ActivityLog', activityLogSchema)
