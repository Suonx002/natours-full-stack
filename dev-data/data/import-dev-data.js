const fs = require('fs');
const mongoose = require('mongoose');

const keys = require('../../config/keys');
const Tour = require('../../models/tourModel');

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

// READ JSON FILES
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data is successfully loaded!');
  } catch (err) {
    console.error(err);
  }
};

// DELETE ALL DATA FROM COLLECTIONS
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data is successfully loaded!');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
