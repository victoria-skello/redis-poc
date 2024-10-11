import express, { Application } from 'express'
import { initRedisClient } from './middleware/redis'
import { SERVER_PORT } from './config/lib/dotenv'
import { UserController } from './controller/userController'

const PORT: number = parseInt(SERVER_PORT, 10)
const app: Application = express()

const initExpressServer = async () => {
    //Express initialization
    app.use(express.json())

    //Redis connection
    await initRedisClient()

    //Routes
    app.get('/api/v1/users', UserController.retrieveAllUsers)

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}

initExpressServer()
    .then()
    .catch((e) => console.error('Failed to start the server with error:', e))



