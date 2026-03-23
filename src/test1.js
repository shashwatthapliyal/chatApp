const express = require('express');

const app = express();
app.listen(3000, () => console.log("Listening...."));

const err = new Error("user not found.....");
console.log(err.message)







