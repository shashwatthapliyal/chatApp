const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://Shashwat:Shashwat%402004@cluster0.3j9yhex.mongodb.net/devTinder?appName=Cluster0");
}

// connectDB()
// .then(()=>console.log("connected successfully......"))
// .catch(()=>console.log("Can't connect....."))

module.exports = connectDB;