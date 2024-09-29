import { Model, Schema } from 'mongoose'

interface TPosts {
  title: string
  description: string
  images: string[]
  category: 'Web' | 'Software Engineering' | 'AI' | 'Data Science'
  isPremium: boolean
  totalVotes: number
  upvote?: number
  downvote?: number
  // comments?: Schema.Types.ObjectId
  postedBy: Schema.Types.ObjectId
  ratings?: number
  price?: number
  isDeleted: boolean
}

export default TPosts
