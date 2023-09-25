const express = require('express');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./db');
// const cors = require('cors')
const morgan = require('morgan')


const app = express();
app.use(express.json());

app.use('/', userRoutes);
app.use(morgan('dev'))

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send("yeepee! backend dev on work")
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been established successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});