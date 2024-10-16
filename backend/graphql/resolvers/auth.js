const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  loginUser: async args => {
    try {
      // Find the user by email only (not by password)
      const existingUser = await User.findOne({ email: args.userInput.email });
      
      // If user is not found
      if (!existingUser) {
        throw new Error('User does not exist.');
      }
  
      // Compare the entered password with the hashed password stored in the database
      const isPasswordCorrect = await bcrypt.compare(args.userInput.password, existingUser.password);
      
      if (!isPasswordCorrect) {
        throw new Error('Incorrect password.');
      }
  
      // Password is correct, return user details, but set password to null
      return { ...existingUser._doc, password: null, _id: existingUser.id, role: existingUser.role };
  
    } catch (err) {
      throw err;
    }
  }
};
