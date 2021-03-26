const bcrypt = require('bcrypt');
const userDataMapper = require('../dataMappers/userDataMapper');
const tokenManager = require('../utils/tokenManager');
const { sendConfirmationEmail } = require('../utils/confirmationEmail');

const CLIENT_URL = process.env.CLIENT_URL;

const authController = {

  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password ) 
        return res.status(400).json({msg: "Please fill in all fields"});

        // TODO: implement JOI for validation

      const existingUser = await userDataMapper.findOneByEmail(email);
      if (existingUser) return res.status(400).json({msg: "This email already exists"});

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = {
        name,
        email,
        password: passwordHash
      };

      const activation_token = tokenManager.generateActivationToken(newUser);
      const url = `${CLIENT_URL}/confirmation/${activation_token}`;

      sendConfirmationEmail(newUser, url)

      res.status(200).json({msg: "Registration success ! Please activate your email to complete"})
      
    } catch (error) {
      return res.status(500).json({msg: error.message});
      
    }
  },

  activate: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = tokenManager.verifyActivationToken(activation_token);
      
      const { name, email, password } = user;

      const existingUser = await userDataMapper.findOneByEmail(email);
      if (existingUser) return res.status(400).json({msg: "This email already exists"});

      await userDataMapper.createUser(name, email, password);
      
      res.status(201).json({msg: "Account has been activated"});

    } catch (error) {
      return res.status(500).json({msg: error.message});
      
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userDataMapper.findOneByEmail(email);
      if (!user) return res.status(401).json({msg: "Invalid Email or Password"});

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({msg: "Invalid Email or Password"});

      const refresh_token = tokenManager.generateRefreshToken({id: user.id});
      res.cookie('refreshToken', refresh_token, {
        httpOnly: true,
        path: 'user/refresh_token',
        maxAge: 7*24*60*60*1000 //7 days
      });

      res.status(200).json({msg: "Login Success"})
      
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  }

};

module.exports = authController;


