import { Model, Schema } from 'mongoose'

interface TVote {
  user: Schema.Types.ObjectId
  voteType: 'upvote' | 'downvote'
}

interface TPosts {
  title: string
  description: string
  images: string[]
  category: 'Web' | 'Software Engineering' | 'AI' | 'Data Science'
  isPremium: boolean
  totalVotes: number
  votes?: TVote[]
  upvote?: number
  downvote?: number
  postedBy: Schema.Types.ObjectId
  views: number
  ratings?: number
  price?: number
  isDeleted: boolean
}

export default TPosts
