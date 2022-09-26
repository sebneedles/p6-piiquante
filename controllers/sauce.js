// Import du modèle Mongoose : Sauce
const Sauce = require('../models/Sauce');

// Import du package fs
const fs = require('fs');


// Logique de route GET : Affiche toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// Logique de route GET : Affiche une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Logique de route POST : Créé une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersdisLiked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

// Logique de route PUT : Modifie une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message : 'Pas autorisé !'});
      } else {
        Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message : 'Objet modifié!'}))
        .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Logique de route DELETE : Supprime une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      // Vérifie si c'est le bon userId qui supprime le fichier
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({message: 'Pas autorisé !'});
      } else {
        // On vérifie que l'image est supprimé du dossier
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch( error => {
      res.status(500).json({ error });
    });
};


// Logique de route POST : Like/Dislike une sauce
exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like;
    
    switch (like) {
      // Le user clique sur j'aime : on incrémente avec l'opérateur $inc le likes
      case 1:
        // on ajoute une valeur avec $push à likes
        Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 }})
          .then(() => res.status(200).json({ message: 'J\'aime !' }))
          .catch((error) => res.status(400).json({ error }));      
      break;
  
      // Le user clique sur j'aime pas : on  incrémente avec l'opérateur $inc le dislikes
      case -1:
        // on ajoute une valeur avec $push à dislikes
          Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 }})
            .then(() => { res.status(200).json({ message: 'Je n\'aime pas !' }) })
            .catch((error) => res.status(400).json({ error }));
      break;

      // Le user re-clique sur j'aime ou j'aime pas
      case 0:
        Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
            // J'aime : on décremente avec l'opérateur $inc le likes
            if (sauce.usersLiked.includes(req.body.userId)) { 
              // on retire une valeur avec $pull à likes
              Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: 'On retire le j\'aime !' }))
                .catch((error) => res.status(400).json({ error }));
            }
            // J'aime pas : on décremente avec l'opérateur $inc le dislikes
            if (sauce.usersDisliked.includes(req.body.userId)) { 
              // on retire une valeur avec $pull à dislikes
              Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: 'On retire le j\'aime pas !' }))
                .catch((error) => res.status(400).json({ error }));
            }
          })
          .catch((error) => res.status(404).json({ error }));
      break;
        
      default:
          console.log(error);
    }
  };