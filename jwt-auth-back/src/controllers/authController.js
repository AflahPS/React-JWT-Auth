const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '5d',
  });
  const cookieConfig = {
    httpOnly: true,
  };
  res.cookie('jwt', token, cookieConfig);
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Validation
  if (!email || !password) {
    return res.status(401).json({
      status: 'failed',
      message: 'Please enter both email and password',
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordMatch(password, user.password))) {
    return res.status(401).json({
      status: 'failed',
      message: 'Incorrect email or password',
    });
  }

  if (user.isBanned) {
    return res.status(403).json({
      status: 'failed',
      message: 'Your account has been suspended !',
    });
  }

  createSendToken(user, 200, res);
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  let token;
  console.log(req.headers);
  console.log(req.cookies);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  console.log(token);
  if (!token)
    return res.status(401).json({
      status: 'failed',
      message: 'Invalid token, Please login !',
    });
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({
        status: 'failed',
        message: 'Invalid token, Please login !',
      });
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({
        status: 'failed',
        message: 'No user exists for this token !',
      });

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'failed',
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
