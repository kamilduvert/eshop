const pool = require("../database/config");

const userDataMapper = {

  findOneByEmail : async (email) => {
    try {
      const result = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
      if (result.rowCount == 0) {
        return null;
      };
      return result.rows[0];

    } catch (error) {
      console.log(error.message)
    }

  },

  createUser : async(name, email, password) => {
    try {
      await pool.query(`INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3)`, [
        name,
        email,
        password
      ])
      return
      
    } catch (error) {
      console.log(error.message)
    }

  }

}

module.exports = userDataMapper;
