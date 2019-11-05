const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniquevalidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, index: true },
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    contact: { type: String, required: true }
});

UserSchema.plugin(uniquevalidator);

const User = module.exports = mongoose.model('user', UserSchema);

//Find user by ID
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}
//Find user by username
module.exports.getUserByUsername = (username, callback) => {
    const query = { username }
    User.findOne(query, callback);
}
//To register user
module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) return err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};
//Compare password
module.exports.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}