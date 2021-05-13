Vous trouverez ici le backend pour le projet 6 de la formation "développeur web" d'Open Classrooms.

Contexte: So Pekocko est une entreprise familiale de 10 salariés. Son activité principale est la création
de sauces piquantes dont la composition est tenue secrète. Forte de son succès, l’entreprise
souhaite se développer et créer une application web, dans laquelle les utilisateurs pourront
ajouter leurs sauces préférées et liker ou disliker les sauces proposées par les autres.

Le frontend peut être cloné à l'adresse suivante: https://github.com/OpenClassrooms-Student-Center/dwj-projet6.git
Pour démarrer le front:

- Exécuter la commande npm install
- Installer Saas avec la commande npm --save node-sass
- Modifier la version de node-sass dans le fichier package.json => mettre "node-sass": "^4.14.1"
- Effectuer une nouvelle commande npm install
- Démarrer le projet avec la commande ng serve

=> ouvrir le navigateur http://localhost:4200/

Afin de pouvoir utiliser ce backend, il faut:

- l'initialiser avec la commande npm install.
- créer un fichier .env à la racine du backend avec comme contenu:
  MONGODB=' l'adresse de connexion à une base MongoDB '
  TOKEN_KEY=' Une clé pour le Token.'
  EMAIL=' Une clé pour le cryptage des emails.'
- Démarrer le backend avec la commande node server.

L'API fonctionne de la manière suivante:

UTILISATEUR:

- Création d'un compte utilisateur:
  Body: Objet JSON du type {"email": "...", "password":"..."}
  route post: /api/auth/signup
- Connexion:
  Body: Objet JSON du type {"email": "...", "password":"..."}
  route post: /api/auth/login
- Modification:
  Body: Objet JSON du type {"email": "...", "password":"..."} (l'objet contient seulement l'élément modifié)
  route put: /api/auth/:id (l'id correspond au UserId)
- Suppression:
  route delete: /api/auth/:id (l'id correspond au UserId)
- Consultation de son profil utilisateur:
  route get: /api/auth/:id (l'id correspond au UserId)

Note: Les routes de consultation, modification et suppression d'un utilisateur ne sont pas encore implémentées du côté frontend. Elles ont été incluses dans le backend dans un souci de mise en conformité ultérieur du frontend avec le RGPD. Pour les tester, il est possible d'utiliser postman (https://www.postman.com/downloads/) de la façon suivante: - Modifier le middleware auth.js: enlever le ".split(" ")[1]" à la ligne 5. - Faire un login pour récupérer le token et le UserId. - Ajouter au Header une ligne Authorization et coller le token.

SAUCES

- Liste des sauces:
  route get: /api/sauces
- Consultation d'une sauce spécifique:
  route get: /api/sauces/:id (l'id correspond à l'id de la Sauce)
- Modification:
  Body: Objet JSON du type; {
  id: { type: String, require: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: String, required: true, min: 0, max: 10 },
  likes: { type: Number, min: 0 },
  dislikes: { type: Number, min: 0 },
  usersLiked: { type: Array },
  usersDisliked: { type: Array },
  } (l'objet contient seulement les éléments modifiés)
  route put: /api/sauces/:id (l'id correspond à l'id de la Sauce)
- Suppression:
  route delete: /api/sauces/:id (l'id correspond à l'id de la Sauce)
- like:
  Body: Objet JSON du type {"id": type: String, "like":type: Number}
  Le nombre "like" peut avoir 3 valeurs: 1: l'utilisateur aime la sauce, - 1: l'utilisateur n'aime pas la sauce, 0: annule le like ou dislike pour l'utilisateur.
  route post: /api/sauces/:id/like
