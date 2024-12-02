const mongoose = require("mongoose");

const MONGODB_URL =
  "mongodb+srv://ritesh7:12345@learnings.isgczqb.mongodb.net/?retryWrites=true&w=majority&appName=learnings";

const connection = () => {
  mongoose
    .connect(MONGODB_URL)
    .then(() => console.log(`Connected successfully`))
    .catch((err) => console.log(`Error connecting to the db ${err}`));
};

module.exports = connection;
