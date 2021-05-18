const rateLimit = require("express-rate-limit");

exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Trop de demande depuis cette IP.",
});

exports.createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    "Trop de comptes créé depuis cette adresse IP, réessayez dans une 1h.",
});

exports.loginLimiter = rateLimit({
  windowMs: 120 * 60 * 1000, // 2 hour window
  max: 3, // start blocking after 3 requests
  skipSuccessfulRequests: true,
  message:
    "Trop de tentative de login depuis cette adresse, réessayer dans 2h.",
});
