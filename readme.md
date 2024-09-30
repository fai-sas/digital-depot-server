# TypeScript Express Project

This is a simple Express server written in TypeScript.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm (Node Package Manager).
- You have a MongoDB instance running (local or cloud-based).

## Getting Started

Follow these instructions to set up and run the project locally.

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/fai-sas/digital-depot-server
   cd digital-depot-server
   ```

2. **Install dependencies:**

   ```typescript
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory of the project and add your configuration:

   ```env
   NODE_ENV="development"
   PORT=5000
   DATABASE_URL="your-mongodb-connection-string"
   JWT_ACCESS_SECRET="your jwt access secret"
   JWT_REFRESH_SECRET="your jwt refresh secret"
   JWT_ACCESS_EXPIRES_IN="your jwt expiry in"
   JWT_REFRESH_EXPIRES_IN="your jwt expiry in"
   BCRYPT_SALT_ROUNDS=""
   RESET_PASSWORD_UI_LINK=""
   SENDER_EMAIL=""
   SENDER_APP_PASS=""
   STORE_ID=""
   SIGNATURE_KEY=""
   PAYMENT_URL=""
   PAYMENT_VERIFY_URL=""
   CLOUDINARY_CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""

   ```

### Running the Project

There are two ways to run the project: in development mode and in production mode.

#### Development Mode

In development mode, the server will restart automatically whenever you make changes to the source files.

1. **Start the server in development mode:**

   ```sh
   npm run dev
   ```

   This uses `ts-node-dev` for live reloading.

#### Production Mode

In production mode, the server will run the compiled JavaScript files.

1. **Build the project:**

   ```sh
   npm run build
   ```

   This compiles the TypeScript files into the `dist` directory.

2. **Start the server in production mode:**

   ```sh
   npm run start:prod
   ```

### Additional Scripts

- **Build the project:**

  ```sh
  npm run build
  ```

  This compiles the TypeScript files into the `dist` directory.

- **Run the server in production mode:**

  ```sh
  npm start
  ```

  This is an alias for `npm run start:prod`.

### Testing

Currently, there are no tests defined for this project. You can add your tests and run them using:

```sh
npm test
```

### Project Structure

```typescript
typescript-express/
│
├── dist/                   # Compiled JavaScript files (generated)
├── node_modules/           # Node.js modules
├── src/                    # Source files
│   ├── app/                # Application setup
│   │   ├── config/         # Configuration files
│   │   ├── modules/        # Feature modules
│   │   │   ├── auth/    # Auth module
│   │   │   │   ├── auth.controller.ts   # auth controller
│   │   │   │   ├── auth.interface.ts    # auth interface
│   │   │   │   ├── auth.model.ts        # auth model
│   │   │   │   ├── auth.route.ts        # auth routes
│   │   │   │   ├── auth.service.ts      # auth service
│   │   │   │   ├── auth.validation.ts   # auth validation
│   │   │   │   ├── auth.utils.ts        # auth utils
│   │   │   ├── user/    # User module
│   │   │   │   ├── user.controller.ts   # user controller
│   │   │   │   ├── user.interface.ts    # user interface
│   │   │   │   ├── user.model.ts        # user model
│   │   │   │   ├── user.route.ts        # user routes
│   │   │   │   ├── user.service.ts      # user service
│   │   │   │   ├── user.validation.ts   # user validation
│   │   │   ├── posts/    # Posts module
│   │   │   │   ├── posts.controller.ts   # Posts controller
│   │   │   │   ├── posts.interface.ts    # Posts interface
│   │   │   │   ├── posts.model.ts        # Posts model
│   │   │   │   ├── posts.route.ts        # Posts routes
│   │   │   │   ├── posts.service.ts      # Posts service
│   │   │   │   ├── posts.validation.ts   # Posts utils
│   │   │   │   ├── posts.utils.ts        # Posts validation
│   │   │   ├── comments/    # Comments module
│   │   │   │   ├── comments.controller.ts   # Comments controller
│   │   │   │   ├── comments.interface.ts    # Comments interface
│   │   │   │   ├── comments.model.ts        # Comments model
│   │   │   │   ├── comments.route.ts        # Comments routes
│   │   │   │   ├── comments.service.ts      # Comments service
│   │   │   │   ├── comments.validation.ts   # Comments utils
│   │   │   │   ├── comments.utils.ts        # Comments validation
│   │   │   ├── payment/    # Payment module
│   │   │   │   ├── payment.controller.ts   # Payment controller
│   │   │   │   ├── payment.interface.ts    # Payment interface
│   │   │   │   ├── payment.model.ts        # Payment model
│   │   │   │   ├── payment.route.ts        # Payment routes
│   │   │   │   ├── payment.service.ts      # Payment service
│   │   │   │   ├── payment.validation.ts   # Payment utils
│   │   │   │   ├── payment.utils.ts        # Payment validation
│   │   │   ├── activity/    # Activity module
│   │   │   │   ├── activity.controller.ts   # Activity controller
│   │   │   │   ├── activity.interface.ts    # Activity interface
│   │   │   │   ├── activity.model.ts        # Activity model
│   │   │   │   ├── activity.route.ts        # Activity routes
│   │   │   │   ├── activity.service.ts      # Activity service
│   │   │   │   ├── activity.validation.ts   # Activity utils
│   │   │   │   ├── activity.utils.ts        # Activity validation
│   │   ├── app.ts           # Express app setup
│   │   ├── server.ts        # Server setup
│
├── .env
├── .gitignore
├── .package.json
├── .tsconfig.json
├── .vercel.json


```

### Deployment

```typescript
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
}

```
