require("dotenv").config;
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');


exports.getUserDetails = async (req, res) => {
    try {

        const { user_id } = req.params;

        const user = await User.findOne({ where: { user_id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateUserDetails = async (req, res) => {
    try {
        const { user_id } = req.params;

        const newDetails = req.body;

        await User.update(newDetails, { where: { user_id } });

        res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserImage = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await User.findOne({ where: { user_id } });

        res.status(200).json({ user_image: user.user_image });
    } catch (error) {
        console.error('Error fetching user image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.insertUser = async (req, res) => {
    try {
        const user_details = JSON.parse(req.body.user_details);
        console.log(user_details)
        const file = req.file;


        if (!file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        user_details.user_image = file.path
        const hashedPassword = await bcrypt.hash(user_details.user_password, 10);
        user_details.user_password = hashedPassword;

        const newUser = await User.create(user_details);

        const token = jwt.sign({ userId: newUser.user_id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ message: 'User inserted successfully', user: newUser, token });
    } catch (error) {
        console.error('Error inserting user:', error);

        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ message: 'Validation error', errors: error.errors });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};



exports.deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        await User.destroy({ where: { user_id } });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        console.log(req.body, 104);

        const user = await User.findOne({
            where: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('user_email')), 'LIKE', user_email.toLowerCase())
        });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const passwordMatch = await bcrypt.compare(user_password, user.user_password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
        }

        // console.log(user)

        await User.update(
            { last_logged_in: new Date() },
            { where: { user_id: user.user_id } }
        );

        const token = jwt.sign({ userId: user.user_id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
