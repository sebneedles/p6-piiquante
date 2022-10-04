# p6-piiquante

## Etapes à suivre :

## FRONTEND
1. Cloner le repo distant : https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6 dans un nouveau dossier "frontend".
2. Aller dans le dossier "frontend".
3. Lancer la commande terminal "npm install" depuis le dossier frontend.
4. Il se peut que l'installation comporte des erreurs => lancer la commande "npm audit fix", puis "npm audit fix --force".
5. Depuis le dossier frontend, lancer la commande => "npm start".
4. Dans le navigateur, taper l'adresse http://localhost:4200, la page d'accueil du site s'ouvrira.

## BACKEND
1. Ajouter le dossier de l'API au même niveau que le dossier frontend.
2. Renommer le nouveau dossier => "backend".
3. Lancer une nouvelle fenêtre terminal depuis le dossier backend.
4. Lancer la commande "npm run dev".
5. Le backend est prêt.

## BASE DE DONNEES
La base de données est sur mongoDB
1. Il faut créer un fichier .env à la racine du dossier backend
2. Remplir ce fichier suivant le modèle des variables d'environnement ci-dessous :

- PORT = 3000
- DB_USERNAME = "le nom d'utilisateur de la base mongoDB"
- DB_PASSWORD = "le mot de passe"
- DB_NAME = "le nom de la base de donnée"

