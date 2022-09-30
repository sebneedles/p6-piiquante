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
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Pas autorisé !' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Logique de route DELETE : Supprime une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // Vérifie si c'est le bon userId qui supprime le fichier
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Vous n\'êtes pas autorisé !' });
      } else {
        // On vérifie que l'image est supprimé du dossier
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};


// Logique de route POST : Like/Dislike une sauce
exports.likeDislikeSauce = (req, res, next) => {

  Sauce.findOne({ _id: req.params.id })
    .then((objet) => {

      switch (req.body.like) {
        case 1:
          // LIKE = 1
          if (!objet.usersLiked.includes(req.body.userId) && req.body.like === 1) {
            // USER CLIQUE SUR LIKE
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId }
              }
            )
              .then(() => res.status(201).json({ message: 'A cliquer sur J\'aime !' }))
              .catch((error) => res.status(400).json({ error }));
            console.log(req.body.userId, 'A cliquer sur J\'aime !');
          }
          break;

        case -1:
          // DISLIKE = -1
          if (!objet.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
            // USER CLIQUE SUR DISLIKE
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId }
              }
            )
              .then(() => res.status(201).json({ message: 'A cliquer sur J\'aime pas !' }))
              .catch((error) => res.status(400).json({ error }));
            console.log(req.body.userId, 'A cliquer sur J\'aime pas !');
          }
          break;

        case 0:
          // LIKE = 0
          if (objet.usersLiked.includes(req.body.userId)) {
            // USER RECLIQUE SUR LIKE
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId }
              }
            )
              .then(() => res.status(201).json({ message: 'Annule J\'aime !' }))
              .catch((error) => res.status(400).json({ error }));
            console.log(req.body.userId, 'Annule J\'aime !');
          };

          // DISLIKE = 0
          if (objet.usersDisliked.includes(req.body.userId)) {
            // USER RECLIQUE SUR DISLIKE
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId }
              }
            )
              .then(() => res.status(201).json({ message: 'Annule Je n\'aime pas !' }))
              .catch((error) => res.status(400).json({ error }));
            console.log(req.body.userId, 'Annule Je n\'aime pas !');
          }
          break;
          default: console.log(error);
      }
    })
    .catch((error) => res.status(404).json({ message: 'Vous ne pouvez pas voter 2x !' }));
};