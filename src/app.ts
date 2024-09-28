import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import router from './app/routes'
import globalErrorHandler from './app/middlewares/globalErrorhandler'
import notFound from './app/middlewares/notFound'
import httpStatus from 'http-status'
import moment from 'moment'

const app: Application = express()

//parsers
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// application routes
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap');
      body, html {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #1a1a1a; /* bg-gray-900 */
        color: #e5e7eb; /* text-gray-200 */
        font-family: 'Nunito', sans-serif;
      }
      .container {
        text-align: center;
      }
      .container h1 {
        font-weight: bold;
      }
    </style>
    <div class="container">
      <h1>Server is Running Smoothly</h1>
      <p>Time: ${moment(new Date()).format('MMMM Do YYYY, h:mm:ss a')}</p>
    </div>
  `)
})

app.use(globalErrorHandler)
app.use(notFound)

export default app
