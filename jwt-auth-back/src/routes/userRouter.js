const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = new express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router
  .route('/all')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers
  );

router
  .route('/:id')
  .get(authController.protect, userController.getUserById)
  .patch(authController.protect, userController.updateUserById)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUserById
  );

router
  .route('/ban/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.banUserById
  );

router
  .route('/search-users/:tag')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.searchByTag
  );

module.exports = router;
