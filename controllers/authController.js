const bcrypt = require('bcrypt');
const userDataMapper = require('../dataMappers/userDataMapper');
const tokenManager = require('../utils/tokenManager');
const { sendConfirmationEmail, sendforgotPaswordEmail } = require('../utils/sendEmail');

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
      const url = `${CLIENT_URL}/user/activate/${activation_token}`;

     sendConfirmationEmail(newUser, url);

      res.status(200).json({msg: "Registration success ! Please activate your email to complete"});
      
    } catch (error) {
      return res.status(500).json({msg: error.message});
      
    }
  },

  activate: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = tokenManager.verifyActivationToken(activation_token);
      if (!user) return res.status(401).json({msg: "Problem with your activation token"});
      
      const { name, email, password } = user;

      const existingUser = await userDataMapper.findOneByEmail(email);
      if (existingUser) return res.status(409).json({msg: "This email already exists"});

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

      // https://indepth.dev/posts/1382/localstorage-vs-cookies
      const refresh_token = tokenManager.generateRefreshToken({id: user.id});
      res.cookie('refreshToken', refresh_token, {
        httpOnly: true,
        path: 'api/auth/refresh-token',
        maxAge: 7*24*60*60*1000 //7 days
      });

      const access_token = tokenManager.generateAccessToken({id: user.id});
      res.status(200).json({msg: "Login Success", access_token})
      
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refresh_token = req.cookies.refreshToken;
      if (refresh_token) return res.status(401).json({msg: "Please Log in now"});

      const user = tokenManager.verifyRefreshToken(refresh_token);
      if (!user) return res.status(401).json({msg: "Problem with your refresh token"});

      const access_token = tokenManager.generateAccessToken({id: user.id});
      res.status(200).json({msg: "New access-token generated", access_token})
      
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userDataMapper.findOneByEmail(email);
      if(!user) return res.status(404).json({msg: "This email does not exist."});

      const access_token = tokenManager.generateAccessToken(user);
      const url = `${CLIENT_URL}/user/reset-password/${access_token}`;

      sendforgotPaswordEmail(user, url);

      res.status(200).json({msg: "Password reset email has been sent, please check your mailbox !"});

    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  }

};

module.exports = authController;


