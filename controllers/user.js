const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
var CryptoJS = require("crypto-js");
const sauceCtrl = require("../controllers/sauces");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: CryptoJS.HmacSHA256(
          req.body.email,
          process.env.EMAIL
        ).toString(),
        emailAES: CryptoJS.AES.encrypt(
          req.body.email,
          process.env.EMAIL
        ).toString(),
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({
    email: CryptoJS.HmacSHA256(req.body.email, process.env.EMAIL).toString(),
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.modifyUser = (req, res, next) => {
  if (req.body.password) {
    if (req.body.email) {
      User.findOne({
        _id: req.params.id,
      });
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const userObject = {
            email: CryptoJS.HmacSHA256(
              req.body.email,
              process.env.EMAIL
            ).toString(),
            emailAES: CryptoJS.AES.encrypt(
              req.body.email,
              process.env.EMAIL
            ).toString(),
            password: hash,
          };
          User.updateOne(
            { _id: req.params.id },
            { ...userObject, _id: req.params.id }
          )
            .then(() =>
              res.status(200).json({ message: "Utilisateur modifié !" })
            )
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => {
          res.status(404).json({
            error: error,
          });
        });
    } else {
      User.findOne({
        _id: req.params.id,
      });
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const userObject = {
            password: hash,
          };
          User.updateOne(
            { _id: req.params.id },
            { ...userObject, _id: req.params.id }
          )
            .then(() =>
              res.status(200).json({ message: "Utilisateur modifié !" })
            )
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => {
          res.status(404).json({
            error: error,
          });
        });
    }
  } else {
    User.findOne({
      _id: req.params.id,
    })
      .then((user) => {
        const userObject = {
          email: CryptoJS.HmacSHA256(
            req.body.email,
            process.env.EMAIL
          ).toString(),
          emailAES: CryptoJS.AES.encrypt(
            req.body.email,
            process.env.EMAIL
          ).toString(),
          password: user.password,
        };
        console.log("utilisateur:", userObject);
        User.updateOne(
          { _id: req.params.id },
          { ...userObject, _id: req.params.id }
        )
          .then(() =>
            res.status(200).json({ message: "Utilisateur modifié !" })
          )
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => {
        res.status(404).json({
          error: error,
        });
      });
  }
};

exports.deleteUser = (req, res, next) => {
  sauceCtrl.deleteWithUser(req);
  User.deleteOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Utilisateur supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getUser = (req, res, next) => {
  User.findOne({
    _id: req.params.id,
  })
    .then((user) => {
      const bytes = CryptoJS.AES.decrypt(user.emailAES, process.env.EMAIL);
      user.emailAES = bytes.toString(CryptoJS.enc.Utf8);
      user = { email: user.emailAES, password: user.password };
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
