import { Schema } from 'mongoose'

interface TPosts {
  title: string
  description: string
  images: string[]
  category: 'Web' | 'Software Engineering' | 'AI' | 'Data Science'
  isPremium: boolean
  upvote?: number
  downvote?: number
  // comments?: Schema.Types.ObjectId
  postedBy: Schema.Types.ObjectId
  ratings?: number
  price?: number
}

export default TPosts
