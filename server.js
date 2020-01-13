const mongoose = require('mongoose');
const app = require('./app');

const keys = require('./config/keys');

// connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(keys.mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDB Connected ...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is currently running on port ${PORT}...`);
});
