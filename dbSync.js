const { DataTypes } = require('sequelize');
const { User } = require('./models/userModel');
const sequelize = require('./db');

(async () => {
    try {
        await sequelize.authenticate();

        await User.sync({ force: true });
        console.log('The table for the User model was created!');
    } catch (error) {
        console.error('Error creating the table:', error);
    } finally {
        await sequelize.close();
    }
})();
