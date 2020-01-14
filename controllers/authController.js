const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const keys = require('../config/keys');

const signToken = id => {
  const payload = { id };

  return jwt.sign(payload, keys.jwtSecret, {
    expiresIn: 36000
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt
  } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt
  });

  // const payload = { id: newUser._id };

  // const token = jwt.sign(payload, keys.jwtSecret, {
  //   expiresIn: 36000
  // });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  /*
  1) Check if email and password exist
  2) check if user exists && password is correct
  3) If everything is ok, send token to client
  */
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  /*
  1) Getting token and check if it's there
  2) Verification token
  3) Check if user still exists
  4) Check if user changed password after the token was issued
  */
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // jwt.verify(token, keys.jwtSecret, (err, decoded) => {
  //   if (err) throw err;
  //   console.log(decoded);
  // });

  const decoded = await promisify(jwt.verify)(token, keys.jwtSecret);
  console.log(decoded);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401)
    );
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again!', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE;
  req.user = freshUser;
  next();
});
