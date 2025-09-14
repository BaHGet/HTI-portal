const { Sequelize } = require('sequelize');

const sequelize = new Sequelize( 
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql', 
});

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL Database');
    return sequelize;
  } catch (error) {
    console.error('Database connection error:', error.message);
    return null;
  }
};

module.exports = { dbConnection, sequelize };
