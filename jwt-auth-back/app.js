const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// eslint-disable-next-line no-unused-vars

const userRouter = require('./src/routes/userRouter');

const app = express();

dotenv.config({ path: './config.env' });

// DB Connection
const DB = 'mongodb://127.0.0.1:27017/Greeny';
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
  });

// Middlewares

app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded());

app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `'${req.originalUrl}' is not valid, Please check the url!`,
  });
});

const port = process.env.PORT || '7777';
app.listen(port, () => console.log(`Server running on port: ${port}`));
