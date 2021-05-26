const Sauce = require("../models/sauces");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { error } = require("console");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
      const userId = decodedToken.userId;
      if (userId == sauce.userId) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        console.log("L'utilisateur n'a pas le droit de supprimer cette sauce!");
        res
          .status(401)
          .json(
            message,
            "L'utilisateur n'a pas le droit de supprimer cette sauce!"
          );
      }
    })
    .catch((error) => res.status(401).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      switch (req.body.like) {
        case 1:
          sauce.usersLiked.push(req.body.userId);
          break;
        case -1:
          sauce.usersDisliked.push(req.body.userId);
          break;
        case 0:
          if (sauce.usersLiked.includes(req.body.userId)) {
            sauce.usersLiked.splice(
              sauce.usersLiked.indexOf(req.body.userId),
              1
            );
          } else {
            sauce.usersDisliked.splice(
              sauce.usersDisliked.indexOf(req.body.userId),
              1
            );
          }
          break;
      }
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;
      Sauce.updateOne(
        { _id: req.params.id },
        {
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
          likes: sauce.likes,
          dislikes: sauce.dislikes,
        }
      )
        .then(() =>
          res.status(200).json({ message: "Préférence prise en compte !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
      console.log("erreur:", error);
    });
};

exports.deleteWithUser = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      let sauces = sauce;
      for (sauce of sauces) {
        if (sauce.userId == req.params.id) {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteMany({ userId: req.params.id })
              .then(() => console.log("Sauces de l'utilisateur supprimées !"))
              .catch((error) => console.log("erreur:", error));
          });
        } else if (sauce.usersLiked.includes(req.params.id)) {
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.params.id), 1);
          Sauce.updateMany(
            {},
            {
              usersLiked: sauce.usersLiked,
              likes: sauce.usersLiked.length,
            }
          )
            .then(() => {
              console.log("préférences supprimées !");
            })
            .catch((error) => console.log("erreur:", error));
        } else if (sauce.usersDisliked.includes(req.params.id)) {
          sauce.usersDisliked.splice(
            sauce.usersDisliked.indexOf(req.params.id),
            1
          );
          Sauce.updateMany(
            {},
            {
              usersDisliked: sauce.usersDisliked,
              dislikes: sauce.usersDisliked.length,
            }
          )
            .then(() => console.log("préférences supprimées !"))
            .catch((error) => console.log("erreur:", error));
        }
      }
      console.log("Sauces et like ou dislike supprimés !");
    })
    .catch((error) => console.log("erreur:", error));
};
