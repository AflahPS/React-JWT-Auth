const User = require('../models/user');
const factory = require('./factoryHandler');

// exports.createUser = factory.createOne(User);

exports.getAllUsers = factory.getAll(User);

exports.getUserById = factory.getDocById(User);

exports.updateUserById = factory.updateDocById(User);

exports.deleteUserById = factory.deleteDocById(User);

exports.banUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    user.isBanned = !user.isBanned;
    await user.save();
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.searchByTag = async (req, res, next) => {
  try {
    const { tag } = req.params;
    const allUsers = await User.find();
    const matchedUsers = allUsers.filter((user) => user.email.startsWith(tag));
    res.status(200).json({
      status: 'success',
      users: matchedUsers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};
