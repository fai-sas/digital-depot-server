import { Schema } from 'mongoose'

export type TComments = {
  post: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  comment: string
}
