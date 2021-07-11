const express = require('express');
const router = express.Router();
const { upload } = require('../../helpers/uploadTemp')

const { asyncWrapper } = require('../../helpers/apiHelpers');
const { authMiddleware } = require('../../middlewares/authMiddleware');

const {
  userDataValidation, userMailValidation
} = require('../../middlewares/userValidationMiddleware');

const AuthController = require('../../controllers/authController');
const FilesController = require('../../controllers/filesController');
const verifyController = require('../../controllers/verifyController')

router.post(
  '/signup',
  userDataValidation,
  asyncWrapper(AuthController.registration)
);
router.post('/login', userDataValidation, asyncWrapper(AuthController.login));
router.post('/logout', authMiddleware, asyncWrapper(AuthController.logout));
router.get(
  '/current',
  authMiddleware,
  asyncWrapper(AuthController.receiveCurrentUser)
);

router.patch(
  '/avatars',
  upload.single('avatar'),
  authMiddleware,
  FilesController.avatarUpdater
);

router.get(
  '/verify/:verificationToken',
  verifyController.verification
);

router.post('/verify/', userMailValidation, verifyController.resendVerificationMail)

module.exports = router;
