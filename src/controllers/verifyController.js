const { findUserVerify, checkVerify } = require('../services/authService')
const { sendEmail } = require('../helpers/mailHelper')

const verification = async (req, res) => {
  const { verificationToken } = req.params
  console.log(verificationToken)
  const result = await findUserVerify(verificationToken)
  console.log(result)
  if (!result) {
    res.status(404).json({ message: 'User not found. Verification failed' });
  } else return res.status(200).json({ message: 'Verification successful' });
};

const resendVerificationMail = async(req, res) => {
  const { email } = req.body
  const user = await checkVerify(email)
  if (!user.verifyToken) {
    res.status(404).json({ message: 'Verification has already been passed' });
  }
  await sendEmail(user.verificationToken, email)
  res.status(200).json({ message: 'Verification email sent' });
}

module.exports = {
  verification,
  resendVerificationMail
};
