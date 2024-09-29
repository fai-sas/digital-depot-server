import { z } from 'zod'

const createPostValidationSchema = z.object({
  title: z
    .string()
    .min(1, 'Post Title is Required')
    .max(100, 'Title cannot be more than 100 characters'),
  description: z
    .string()
    .min(1, 'Post Description is Required')
    .max(2500, 'Description cannot be more than 2500 characters'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  category: z.string().min(1, 'Post Category is Required'),
  isPremium: z.boolean().optional(),
  upvote: z.number().optional(),
  downvote: z.number().optional(),
  postedBy: z.string().min(1, 'Posted by User Id is Required'),
  // comments: z.string().min(1, 'Comment Reference is Required'),
  ratings: z.number().optional(),
  price: z.number().optional(),
})

const updatePostValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Product Name is required')
      .max(50, 'Name cannot be more than 50 characters')
      .optional(),
    description: z
      .string()
      .min(1, 'A brief description of the product is required')
      .optional(),
    price: z
      .number({
        required_error: 'The price of the product is required',
      })
      .optional(),
    stock: z
      .number({
        required_error: 'The stock of the product is required',
      })
      .optional(),
    quantity: z
      .number({
        required_error: 'The quantity of the product is required',
      })
      .optional(),
    category: z
      .string()
      .min(1, 'Category Name is required')
      .max(50, 'Name cannot be more than 50 characters')
      .optional(),
    ratings: z
      .number({
        required_error: 'The ratings of the product is required',
      })
      .optional(),
    images: z.string().optional(),
  }),
})

export const ProductValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
}
