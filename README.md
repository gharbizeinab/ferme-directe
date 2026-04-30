# 🌾 Ferme Directe - Plateforme E-commerce

Plateforme de vente directe producteur-consommateur développée avec Angular 16 et Spring Boot.

## 📋 Table des matières

- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement](#lancement)
- [Documentation](#documentation)
- [Structure du projet](#structure-du-projet)

## 🏗️ Architecture

**Stack technique :**
- **Frontend** : Angular 16, TypeScript, SCSS
- **Backend** : Spring Boot, Java, MySQL
- **Authentification** : JWT

## 📦 Prérequis

### Frontend
- Node.js >= 16.x
- npm >= 8.x
- Angular CLI 16.x

### Backend
- Java JDK >= 17
- Maven >= 3.8
- MySQL >= 8.0

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <repository-url>
cd ferme-directe-complete
```

### 2. Configuration de la base de données
```bash
# Créer la base de données
mysql -u root -p
CREATE DATABASE ferme_directe;
exit;

# Importer les données de test (optionnel)
mysql -u root -p ferme_directe < backend/SIMPLE_TEST_DATA.sql
```

### 3. Configuration du Backend
```bash
cd backend

# Configurer application.properties
# Modifier src/main/resources/application.properties avec vos identifiants MySQL

# Installer les dépendances et compiler
mvn clean install

# Lancer le backend
mvn spring-boot:run
```

Le backend sera accessible sur : `http://localhost:8080`

### 4. Configuration du Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start
```

Le frontend sera accessible sur : `http://localhost:4200`

## 🎯 Lancement rapide

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm start
```

## 📚 Documentation

Toute la documentation est disponible dans le dossier [docs/](./docs/README.md) :

- **Guides de démarrage** : Configuration et lancement
- **Documentation technique** : API, architecture
- **Guides fonctionnels** : Gestion des commandes, catégories, profils
- **Débogage** : Solutions aux problèmes courants

## 📁 Structure du projet

```
ferme-directe-complete/
├── backend/                    # Backend Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/          # Code source Java
│   │       └── resources/     # Configuration
│   ├── pom.xml               # Dépendances Maven
│   └── *.sql                 # Scripts SQL
│
├── frontend/                  # Frontend Angular
│   ├── src/
│   │   ├── app/              # Composants Angular
│   │   ├── assets/           # Images, styles
│   │   └── environments/     # Configuration environnements
│   ├── angular.json          # Configuration Angular
│   └── package.json          # Dépendances npm
│
├── docs/                     # Documentation complète
└── README.md                 # Ce fichier
```

## 🔑 Comptes de test

Après avoir importé `SIMPLE_TEST_DATA.sql` :

**Vendeur :**
- Email : `vendeur@test.com`
- Mot de passe : `password123`

**Client :**
- Email : `client@test.com`
- Mot de passe : `password123`

## 🛠️ Commandes utiles

### Backend
```bash
# Compiler sans tests
mvn clean install -DskipTests

# Nettoyer le projet
mvn clean

# Lancer les tests
mvn test
```

### Frontend
```bash
# Build de production
npm run build

# Lancer les tests
npm test

# Linter
npm run lint
```

## 🐛 Problèmes courants

Consultez les guides de débogage dans [docs/](./docs/README.md) :
- [GUIDE_DEBOGAGE.md](./GUIDE_DEBOGAGE.md)
- [GUIDE_DEBOGAGE_FINAL.md](./GUIDE_DEBOGAGE_FINAL.md)

## 📝 Licence

Ce projet est sous licence privée.

## 👥 Contributeurs

Développé pour la plateforme Ferme Directe.
