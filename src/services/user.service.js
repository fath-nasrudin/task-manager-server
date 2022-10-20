const {
  generateHTTPError, hashData, isHashedDataMatch, generateJWTToken, isValidId,
} = require('../utils');

// auth
const signup = (User) => async (data) => {
  data || (data = {});
  const { email, password, name } = data;

  // check is all required data provided?
  if (!email || !password) generateHTTPError(400, 'required properties are missing');

  // check if email already exist
  const foundUser = await User.findOne({ email });
  if (foundUser) generateHTTPError(400, 'user with given email already registered');

  // hash the password
  const hashedPassword = await hashData(password);

  // do email verification

  // save into db
  const userData = {
    name,
    email,
    password: hashedPassword,
  };
  return User.create(userData);
};

const signin = (User) => async (data) => {
  (data) || (data = {});

  const { email, password } = data;

  // check all required data
  if (!email || !password) generateHTTPError(400, 'required properties are missing');

  // is user appear
  const foundUser = await User.findOne({ email });
  if (!foundUser) generateHTTPError(400, 'wrong email or password');

  // is password match
  const passwordMatched = await isHashedDataMatch(password, foundUser.password);
  if (!passwordMatched) generateHTTPError(400, 'wrong email or password');

  // create jwt token
  const token = generateJWTToken(foundUser._id);

  // return the data
  const { password: hide, ...user } = foundUser._doc;
  const result = { ...user, token };
  return result;
};

// CRUD
const getUsers = (User) => async () => User.find().select('-password');

const getUserById = (User) => async (data) => {
  (data) || (data = {});
  let id;
  if (typeof data === 'string') { id = data; } else { id = data.id; }

  if (!id) throw new Error('id is missing');
  if (!isValidId(id)) generateHTTPError(400, 'invalid id');

  const user = await User.findById(id).select('-password');
  if (!user) generateHTTPError(404, 'User not found');

  return user;
};

const createUser = (User) => async (data) => {
  data || (data = {});
  // check required properties
  const {
    email, password, name, role,
  } = data;
  if (!email || !password) generateHTTPError(400, 'required properties are missing');

  // check if email already exist
  const foundUser = await User.findOne({ email });
  if (foundUser) generateHTTPError(400, 'user with given email already registered');

  // hash the password
  const hashedPassword = await hashData(password);

  const userData = {
    email, password: hashedPassword, name, role,
  };
  const user = await User.create(userData);
  const { password: hide, ...userWithoutPassword } = await user;
  return userWithoutPassword;
};

const editUser = (User) => async (id, data) => {
  (data) || (data = {});

  const updatedUser = await User
    .findOneAndUpdate({ _id: id }, data, { new: true }).select('-password');

  if (!updatedUser) generateHTTPError(404, 'User not found');
  return updatedUser;
};

const deleteUser = (User) => async (data) => {
  (data) || (data = {});
  let id;
  if (typeof data === 'string') { id = data; } else { id = data.id; }

  if (!id) throw new Error('id is missing');
  const deletedUser = await User.findOneAndDelete({ _id: id }).select('-password');

  if (!deletedUser) generateHTTPError(404, 'User not found');

  return deletedUser;
};

module.exports = (User) => ({
  signup: signup(User),
  signin: signin(User),

  getUsers: getUsers(User),
  getUserById: getUserById(User),
  createUser: createUser(User),
  editUser: editUser(User),
  deleteUser: deleteUser(User),
});
