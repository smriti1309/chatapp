
import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './lib/db.js'


import { app, server } from './lib/socket.js'; 

 // Assuming initSocketServer is the setup function

// 1. Configuration & Express Initialization
dotenv.config();
const app = express(); // Define app locally 
const PORT = process.env.PORT || 5000 // Use a 

// 1. CORS (Must come before routes that need to handle cross-origin requests)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true 
}))

// 2. Body Parser (Must be before any POST/PUT route)
app.use(express.json())


app.use(cookieParser()) 


app.get('/', (req, res) => {
    res.send('Server is running and home page working!');
});

// Mounted Routers
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

server.listen(PORT, () => {
    console.log("Server is running " + PORT)
    connectDB() // Assuming this function is defined elsewhere
})