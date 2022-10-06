// Import de Mongoose
const mongoose = require('mongoose');

// Import de Mongoose Unique Validator
const uniqueValidator = require('mongoose-unique-validator');

// Validation de l'email
const validateEmail = (email) => {
    const re = /^[\w-\.]+[\w]{4}@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
}

// Création du schéma User et dénition de son contenu
const userSchema = mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, 'Veuillez remplir une adresse email valide !'],
        match: [/^[\w-\.]+[\w]{4}@([\w-]+\.)+[\w-]{2,4}$/, 'Veuillez remplir une adresse email valide !']
    },     
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Export du modèle User
module.exports = mongoose.model('User', userSchema);