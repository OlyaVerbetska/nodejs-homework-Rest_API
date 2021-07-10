const { findUserVerify } = require('../services/authService')

const verifyController = async (req, res) => {
  const { verificationToken } = req.params
  const result = await findUserVerify(verificationToken)
  if (!result) {
    res.status(404).json({ message: 'User not found. Verification failed' });
  } else return res.status(200).json({ message: 'Verification successful' });
};

module.exports = {
  verifyController,
};
