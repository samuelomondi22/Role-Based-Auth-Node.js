const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const config = require('./config/database');

const app = express();
const port = process.env.PORT || 4000;

mongoose.connect(config.database, { useCreateIndex: true, useNewUrlParser: true, useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Database connected successfully....'))
    .catch(err => console.log(err));

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.send('Role Based Auth'));

const checkUserType = (req, res, next) => {
    const userType = req.originalUrl.split('/')[2];
    require('./config/passport')(userType, passport)
    next();
}

app.use(checkUserType);

const users = require('./routes/users');
app.use('/api/users', users);

const admin = require('./routes/admin');
app.use('/api/admin', admin);

app.listen(port, () => console.log(`listening on port ${port}`));