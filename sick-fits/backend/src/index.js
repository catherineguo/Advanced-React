const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })
const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

// use express middleware to handle cookies (JWT)
server.express.use(cookieParser())
// use express middleware to populate current user

// decode the JWT so we can get the user ID on each request
server.express.use((req, res, next) => {
    const { token } = req.cookies
    if(token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET)
        // put the userId onto the req for future requests to access
        req.userId = userId
    }
    next()
})

server.start(
    {
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL
        },
    },
    details => {
        console.log(`Server is now running on port http://localhost:${details.port}`)
    }
)