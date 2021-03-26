const bcrypt = require('bcrypt');
const userDataMapper = require('../dataMappers/userDataMapper');
const tokenGenerator = require('../utils/tokens');
const { sendConfirmationEmail } = require('../utils/sendEmail');

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

      const activation_token = tokenGenerator.activationToken(newUser);
      const url = `${CLIENT_URL}/confirmation/${activation_token}`;

      sendConfirmationEmail(newUser, url)

      res.json({msg: "Registration success ! Please activate your email to complete"})
      
    } catch (error) {
      return res.status(500).json({msg: error.message});
      
    }
  }

};

module.exports = authController;


