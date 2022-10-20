const mongoose = require('mongoose');
const testURI = require('../../config').db.test.uri;
const User = require('../user.model');

describe('User model test', () => {
  it('should has a module', () => {
    expect(User).toBeDefined();
  });

  beforeAll(async () => {
    await mongoose.connect(testURI);
    await User.deleteMany();
  });
  afterEach(async () => {
    await User.deleteMany();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  const validUser = { name: 'foo', email: 'foo@bar.com', password: 'secret' };
  const validUser2 = { name: 'foo2', email: 'foo2@bar.com', password: 'secret2' };
  const adminUser = {
    name: 'foo3', email: 'foo3@bar.com', password: 'secret2', role: 'admin',
  };
  const basicUser = { name: 'foo4', email: 'foo4@bar.com', password: 'secret2' };

  describe('get user', () => {
    it('should success lists all users', async () => {
      const docs = [validUser, validUser2];
      await User.insertMany(docs);

      // get all user
      const users = await User.find();
      expect(users.length).toBe(docs.length);
    });

    it('should success get a user by id', async () => {
      const doc = validUser;
      const user = new User(doc);
      await user.save();

      const foundUser = await User.findById(user._id);
      expect(foundUser.name).toEqual(doc.name);
      expect(foundUser.email).toEqual(doc.email);
      expect(foundUser.password).toEqual(doc.password);
    });
  });

  describe('create a user', () => {
    it('should success create a basic user', async () => {
      const doc = basicUser;
      const user = new User(doc);
      const savedUser = await user.save();
      expect(savedUser.name).toEqual(doc.name);
      expect(savedUser.email).toEqual(doc.email);
      expect(savedUser.password).toEqual(doc.password);
      expect(savedUser.role).toEqual('basic');
    });

    it('should success create an admin user', async () => {
      const doc = adminUser;
      const user = new User(doc);
      const savedUser = await user.save();
      expect(savedUser.name).toEqual(doc.name);
      expect(savedUser.email).toEqual(doc.email);
      expect(savedUser.password).toEqual(doc.password);
      expect(savedUser.role).toEqual(doc.role);
    });

    it('should FAILED create a user when email is missing', async () => {
      try {
        const { email, ...missedEmailDoc } = validUser;
        const user = new User(missedEmailDoc);
        await user.save();
      } catch (error) {
        expect(error.name).toEqual('ValidationError');
        expect(error.message).toEqual('User validation failed: email: Path `email` is required.');
      }
    });
  });

  describe('edit a user', () => {
    it('should success edit a user', async () => {
      const doc = validUser;
      const docToUpdate = validUser2;
      const user = new User(doc);
      await user.save();

      // try to edit
      const updatedUser = await User
        .findOneAndUpdate({ _id: user._id }, docToUpdate, { new: true });
      expect(user._id).toEqual(updatedUser._id);
      expect(updatedUser.name).toEqual(docToUpdate.name);
      expect(updatedUser.email).toEqual(docToUpdate.email);
      expect(updatedUser.password).toEqual(docToUpdate.password);
    });

    it('should failed to edit if the id not found, and didn\'t create new document', async () => {
      const doc = validUser;
      const docToUpdate = validUser2;
      const user = new User(doc);
      // await user.save();

      // try to edit
      const updatedUser = await User
        .findOneAndUpdate({ _id: user._id }, docToUpdate, { new: true });

      expect(updatedUser).toBeNull();
    });
  });

  describe('delete a user', () => {
    it('should success delete a user', async () => {
      const doc = validUser;
      const user = new User(doc);
      await user.save();

      // try to delete
      const deletedUser = await User
        .findOneAndDelete({ _id: user._id });

      const users = await User.find();

      expect(users.length).toBe(0);

      expect(deletedUser._id).toEqual(user._id);
      expect(deletedUser.name).toEqual(user.name);
      expect(deletedUser.email).toEqual(user.email);
      expect(deletedUser.password).toEqual(user.password);
    });
  });
});
