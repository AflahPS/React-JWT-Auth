const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      minLen: [2, 'User must have at least 2 letters !'],
      maxLen: [64, 'User name cannot exceed 64 letters !'],
    },
    email: {
      type: String,
      required: [true, 'User must have an email!'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a valid password'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
      },
    },
    image: {
      type: String,
    },
    address: {
      type: mongoose.Types.ObjectId,
      ref: 'Address',
    },
    cart: {
      type: mongoose.Types.ObjectId,
      ref: 'Cart',
    },
    wishlist: {
      type: mongoose.Types.ObjectId,
      ref: 'Cart',
    },
    role: {
      type: String,
      default: 'user',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

userSchema.methods.isPasswordMatch = async function (
  checkPassword,
  OriginalPassword
) {
  return await bcrypt.compare(checkPassword, OriginalPassword);
};

// userSchema.pre(/^find/, function (next) {
//   this.populate('address');
//   next();
// });

module.exports = mongoose.model('User', userSchema);
