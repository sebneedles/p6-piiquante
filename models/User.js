// Import de Mongoose
const mongoose = require('mongoose');

// Import de Mongoose Unique Validator
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma User et dénition de son contenu
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Export du modèle User
module.exports = mongoose.model('User', userSchema);