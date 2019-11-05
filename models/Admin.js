const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniquevalidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, index: true },
    username: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    job_profile:{ type: String, required: true}
});

AdminSchema.plugin(uniquevalidator);

const Admin = module.exports = mongoose.model('admin', AdminSchema);

//Find user by ID
module.exports.getAdminById = (id, callback) => {
    Admin.findById(id, callback);
}
//Find user by username
module.exports.getAdminByUsername = (username, callback) => {
    const query = { username }
    Admin.findOne(query, callback);
}
//To register user
module.exports.addAdmin = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) return err;
            newAdmin.password = hash;
            newAdmin.save(callback);
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