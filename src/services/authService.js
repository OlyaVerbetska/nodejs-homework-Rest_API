const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid')

const { UsersModel } = require('../db/usersModel');
const {
  RegistrationConflictError,
  UnauthorizeError,
  VerificationError,
} = require('../helpers/errors');

const createUser = async (email, password) => {
  const existEmail = await UsersModel.findOne({ email });
  if (existEmail) {
    throw new RegistrationConflictError('Email in use');
  }

  // ================ new
  const verifyToken = uuidv4()
  // ================

  const user = new UsersModel({
    email,
    password,
    // ======== new
    verifyToken
    // =======
  });
  console.log(user)
  return await user.save();
};

const loginUser = async (email, password) => {
  const user = await UsersModel.findOne({ email });

  if (!user) {
    throw new UnauthorizeError('User email is wrong');
  }
  // ===============
  if (!user.isVerify) {
    throw new VerificationError('Verification failed');
  }
  // ==============
  const userCheck = await bcrypt.compare(password, user.password);
  if (!userCheck) {
    throw new UnauthorizeError('User password is wrong');
  }
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      subscription: user.subscription,
    },
    process.env.JWT_SECRET
  );
  user.token = token;
  await user.save();
  return { user, token };
};

const findUser = async (id) => {
  return await UsersModel.findById(id);
};

const findUserVerify = async({ verificationToken }) => {
  const user = await UsersModel.findOne({ verifyToken: verificationToken })
  if (user) {
    user.verifyToken = null
    user.isVerify = true
    await user.save();
    return true
  }
  return false
}
const checkVerify = async ({ email }) => {
  const user = await UsersModel.findOne({ email: email })
  return user.isVerify
}

module.exports = { createUser, loginUser, findUser, findUserVerify, checkVerify };
