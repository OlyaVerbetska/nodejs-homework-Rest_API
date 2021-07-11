const { findUserVerify, checkVerify } = require('../services/authService')

const verification = async (req, res) => {
  const { verificationToken } = req.params
  const result = await findUserVerify(verificationToken)
  if (!result) {
    res.status(404).json({ message: 'User not found. Verification failed' });
  } else return res.status(200).json({ message: 'Verification successful' });
};
const resendVerificationMail = async(req, res) => {
  const { email } = req.body
  const isVerify = await checkVerify(email)
  if (isVerify) {
    res.status(404).json({ message: 'Verification has already been passed' });
  }
  console.log('sending mail')
  res.status(200).json({ message: 'Verification email sent' });
}

module.exports = {
  verification,
  resendVerificationMail
};
