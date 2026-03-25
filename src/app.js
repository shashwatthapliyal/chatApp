const express = require('express');
const connectDB = require("./config/database.js")
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth.js');
const requestRouter = require('./routes/request.js');
const profileRouter = require('./routes/profile.js');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter)
app.use("/", requestRouter)
app.use("/", profileRouter)




connectDB()
    .then(() => {
        app.listen(3000, () => console.log("listening....."));
        console.log("DB connection established")

    })
    .catch(() => console.log("Can't connect to DB"))

