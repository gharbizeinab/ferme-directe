# 🌾 FermeDirecte - Plateforme de Vente Directe Agricole

Plateforme e-commerce connectant directement les producteurs agricoles tunisiens aux consommateurs.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Technologies](#technologies)
- [Installation](#installation)
- [Démarrage rapide](#démarrage-rapide)
- [Structure du projet](#structure-du-projet)
- [Documentation](#documentation)
- [Fonctionnalités](#fonctionnalités)
- [Contributeurs](#contributeurs)

## 🎯 Aperçu

FermeDirecte est une plateforme web permettant aux agriculteurs tunisiens de vendre leurs produits directement aux consommateurs, éliminant les intermédiaires et garantissant des produits frais à des prix équitables.

### Rôles utilisateurs

- **👤 Acheteur** : Parcourir les produits, passer des commandes, suivre les livraisons
- **🌾 Vendeur** : Gérer son catalogue, traiter les commandes, suivre ses ventes
- **👨‍💼 Administrateur** : Gérer la plateforme, les utilisateurs et les produits

## 🛠️ Technologies

### Backend
- **Java 17** avec Spring Boot 3.x
- **Spring Security** pour l'authentification JWT
- **Spring Data JPA** avec Hibernate
- **PostgreSQL** comme base de données
- **Maven** pour la gestion des dépendances

### Frontend
- **Angular 17**
- **Angular Material** pour l'interface utilisateur
- **TypeScript**
- **RxJS** pour la programmation réactive
- **SCSS** pour les styles

## 📦 Installation

### Prérequis

- **Java JDK 17+** (testé avec JDK 23)
- **Node.js 18+** et npm
- **PostgreSQL 14+**
- **Maven 3.8+**
- **Git**

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/ferme-directe-complete.git
cd ferme-directe-complete
```

### 2. Configuration de la base de données

```sql
CREATE DATABASE fermedirecte;
CREATE USER fermedirecte_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE fermedirecte TO fermedirecte_user;
```

### 3. Configuration du backend

Modifier `backend/src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fermedirecte
spring.datasource.username=fermedirecte_user
spring.datasource.password=votre_mot_de_passe
```

### 4. Installation des dépendances

**Backend :**
```bash
cd backend
mvn clean install
```

**Frontend :**
```bash
cd frontend
npm install
```

## 🚀 Démarrage rapide

### Option 1 : Script automatique (Windows)

```bash
# Démarrer backend et frontend ensemble
scripts\start-all.bat
```

### Option 2 : Démarrage manuel

**Terminal 1 - Backend :**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm start
```

### Accès à l'application

- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:8080
- **Swagger UI** : http://localhost:8080/swagger-ui.html

### Compte administrateur par défaut

```
Email : admin@fermedirecte.com
Mot de passe : Admin123!
```

## 📁 Structure du projet

```
ferme-directe-complete/
├── backend/                    # Application Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/          # Code source Java
│   │   │   └── resources/     # Fichiers de configuration
│   │   └── test/              # Tests unitaires
│   ├── sql/                   # Scripts SQL
│   └── pom.xml               # Configuration Maven
│
├── frontend/                  # Application Angular
│   ├── src/
│   │   ├── app/              # Composants Angular
│   │   ├── assets/           # Images et ressources
│   │   └── environments/     # Configuration environnements
│   ├── package.json          # Dépendances npm
│   └── angular.json          # Configuration Angular
│
├── docs/                     # Documentation
│   ├── setup/               # Guides d'installation
│   ├── guides/              # Guides utilisateur
│   └── troubleshooting/     # Solutions aux problèmes
│
├── scripts/                 # Scripts utilitaires
│   ├── start-backend.bat
│   ├── start-frontend.bat
│   └── start-all.bat
│
└── README.md               # Ce fichier
```

## 📚 Documentation

- [Guide d'installation détaillé](docs/setup/INSTALLATION.md)
- [Configuration IntelliJ IDEA](docs/setup/CONFIGURATION_INTELLIJ.md)
- [Guide administrateur](docs/guides/GUIDE_ADMIN.md)
- [Guide vendeur](docs/guides/GUIDE_VENDEUR.md)
- [Résolution des erreurs courantes](docs/troubleshooting/ERREURS_COMMUNES.md)
- [Index complet de la documentation](docs/README.md)

## ✨ Fonctionnalités

### Pour les acheteurs
- ✅ Parcourir le catalogue de produits
- ✅ Recherche et filtrage par catégorie
- ✅ Panier d'achat
- ✅ Passer des commandes
- ✅ Suivi des commandes
- ✅ Gestion du profil

### Pour les vendeurs
- ✅ Tableau de bord avec statistiques
- ✅ Gestion du catalogue produits
- ✅ Gestion des commandes
- ✅ Suivi des revenus
- ✅ Alertes stock faible

### Pour les administrateurs
- ✅ Dashboard global avec métriques
- ✅ Gestion des utilisateurs
- ✅ Gestion des produits (tous vendeurs)
- ✅ Gestion des catégories
- ✅ Suivi de toutes les commandes
- ✅ Statistiques et rapports

## 🔧 Scripts disponibles

### Backend
```bash
mvn clean install          # Compiler le projet
mvn spring-boot:run       # Démarrer le serveur
mvn test                  # Exécuter les tests
```

### Frontend
```bash
npm start                 # Démarrer en mode développement
npm run build            # Build de production
npm test                 # Exécuter les tests
npm run lint             # Vérifier le code
```

## 🐛 Résolution de problèmes

### Erreur de compilation backend
```bash
# Nettoyer et recompiler
cd backend
mvn clean install -U
```

### Erreur de dépendances frontend
```bash
# Réinstaller les dépendances
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Port déjà utilisé
```bash
# Backend (port 8080)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Frontend (port 4200)
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

## 📝 Workflow de développement

1. Créer une branche pour votre feature
```bash
git checkout -b feature/nom-de-la-feature
```

2. Faire vos modifications et commits
```bash
git add .
git commit -m "feat: description de la feature"
```

3. Pousser et créer une Pull Request
```bash
git push origin feature/nom-de-la-feature
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Contributeurs

- **Votre Nom** - Développeur principal

## 📞 Contact

Pour toute question ou suggestion :
- Email : contact@fermedirecte.com
- GitHub Issues : [Créer une issue](https://github.com/votre-username/ferme-directe-complete/issues)

---

**Note** : Ce projet est en développement actif. Certaines fonctionnalités peuvent être incomplètes ou en cours d'amélioration.
