const express = require('express');
const http = require('http');
const connectDB = require("./config/database.js")
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/auth.js');
const requestRouter = require('./routes/request.js');
const profileRouter = require('./routes/profile.js');
const userRouter = require('./routes/user.js');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.use("/", authRouter)
app.use("/", requestRouter)
app.use("/", profileRouter)
app.use("/", userRouter)


const server=http.createServer(app)


connectDB()
    .then(() => {
        server.listen(3000, () => console.log("listening....."));
        console.log("DB connection established")

    })
    .catch(() => console.log("Can't connect to DB"))

