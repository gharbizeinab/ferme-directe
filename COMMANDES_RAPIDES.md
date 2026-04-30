# ⚡ Commandes Rapides - Ferme Directe

Guide de référence rapide pour toutes les commandes du projet.

---

## 🧹 Nettoyage du projet

### Linux/Mac
```bash
cd ferme-directe-complete
chmod +x cleanup.sh
./cleanup.sh
```

### Windows
```cmd
cd ferme-directe-complete
cleanup.bat
```

---

## 🚀 Installation et Lancement

### Installation complète

```bash
# 1. Backend
cd backend
mvn clean install

# 2. Frontend
cd ../frontend
npm install
```

### Lancement rapide

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

---

## 🗄️ Base de données

### Créer la base
```bash
mysql -u root -p
CREATE DATABASE ferme_directe;
exit;
```

### Importer les données de test
```bash
mysql -u root -p ferme_directe < backend/sql/SIMPLE_TEST_DATA.sql
```

### Autres scripts SQL
```bash
# Catégories de test
mysql -u root -p ferme_directe < backend/sql/CATEGORIES_TEST_DATA.sql

# Corrections diverses
mysql -u root -p ferme_directe < backend/sql/FIX_DASHBOARD_DATA.sql
mysql -u root -p ferme_directe < backend/sql/FIX_ORDER_COLUMNS.sql
mysql -u root -p ferme_directe < backend/sql/FIX_SELLER_PROFILES.sql
mysql -u root -p ferme_directe < backend/sql/UPDATE_ADDRESS_TABLE.sql
```

---

## 🔧 Backend (Maven)

### Compilation
```bash
cd backend

# Compilation complète
mvn clean install

# Sans tests
mvn clean install -DskipTests

# Nettoyer uniquement
mvn clean
```

### Lancement
```bash
# Mode développement
mvn spring-boot:run

# Avec profil spécifique
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Tests
```bash
# Tous les tests
mvn test

# Test spécifique
mvn test -Dtest=NomDuTest
```

### Package
```bash
# Créer le JAR
mvn package

# Lancer le JAR
java -jar target/ferme-directe-0.0.1-SNAPSHOT.jar
```

---

## 🎨 Frontend (Angular)

### Installation
```bash
cd frontend

# Installer les dépendances
npm install

# Installer une dépendance spécifique
npm install <package-name>
```

### Développement
```bash
# Serveur de développement
npm start
# ou
ng serve

# Avec port spécifique
ng serve --port 4300

# Ouvrir automatiquement le navigateur
ng serve --open
```

### Build
```bash
# Build de développement
npm run build
# ou
ng build

# Build de production
npm run build -- --configuration production
# ou
ng build --configuration production
```

### Tests
```bash
# Tests unitaires
npm test
# ou
ng test

# Tests e2e
npm run e2e
# ou
ng e2e

# Coverage
ng test --code-coverage
```

### Linting
```bash
# Vérifier le code
npm run lint
# ou
ng lint

# Corriger automatiquement
ng lint --fix
```

### Génération de composants
```bash
# Composant
ng generate component nom-composant
# ou
ng g c nom-composant

# Service
ng generate service nom-service
# ou
ng g s nom-service

# Module
ng generate module nom-module
# ou
ng g m nom-module

# Guard
ng generate guard nom-guard
# ou
ng g g nom-guard
```

---

## 📦 Git

### Configuration initiale
```bash
cd ferme-directe-complete

# Initialiser (si pas déjà fait)
git init

# Configurer remote
git remote add origin https://github.com/votre-username/ferme-directe.git
```

### Workflow standard
```bash
# Vérifier l'état
git status

# Ajouter les fichiers
git add .

# Commit
git commit -m "Description des changements"

# Pousser
git push origin main
```

### Nettoyage Git
```bash
# Supprimer du cache (mais garder localement)
git rm -r --cached frontend/node_modules
git rm -r --cached backend/target

# Supprimer complètement
git rm -r frontend/node_modules
git rm -r backend/target

# Voir les fichiers ignorés
git status --ignored
```

### Branches
```bash
# Créer une branche
git checkout -b nom-branche

# Changer de branche
git checkout nom-branche

# Lister les branches
git branch

# Fusionner une branche
git checkout main
git merge nom-branche

# Supprimer une branche
git branch -d nom-branche
```

### Annuler des changements
```bash
# Annuler les modifications non commitées
git checkout -- fichier.txt

# Annuler le dernier commit (garder les changements)
git reset --soft HEAD~1

# Annuler le dernier commit (supprimer les changements)
git reset --hard HEAD~1

# Revenir à un commit spécifique
git reset --hard <commit-hash>
```

---

## 🐛 Débogage

### Backend
```bash
# Logs en temps réel
tail -f backend/logs/application.log

# Vérifier les ports utilisés
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # Linux/Mac

# Tuer un processus sur le port 8080
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Frontend
```bash
# Vérifier les ports utilisés
netstat -ano | findstr :4200  # Windows
lsof -i :4200                 # Linux/Mac

# Nettoyer le cache Angular
rm -rf frontend/.angular
rm -rf frontend/node_modules
cd frontend && npm install

# Vérifier la version d'Angular
ng version
```

### Base de données
```bash
# Se connecter à MySQL
mysql -u root -p

# Lister les bases
SHOW DATABASES;

# Utiliser une base
USE ferme_directe;

# Lister les tables
SHOW TABLES;

# Voir la structure d'une table
DESCRIBE nom_table;

# Exporter la base
mysqldump -u root -p ferme_directe > backup.sql

# Importer une base
mysql -u root -p ferme_directe < backup.sql
```

---

## 📊 Monitoring

### Vérifier que tout fonctionne
```bash
# Backend (devrait retourner du JSON)
curl http://localhost:8080/api/health

# Frontend (devrait retourner du HTML)
curl http://localhost:4200

# Base de données
mysql -u root -p -e "SELECT 1"
```

### Taille du projet
```bash
# Taille totale
du -sh ferme-directe-complete

# Taille par dossier
du -sh ferme-directe-complete/*

# Taille du dépôt Git
du -sh ferme-directe-complete/.git
```

---

## 🔑 Comptes de test

Après avoir importé `SIMPLE_TEST_DATA.sql` :

**Vendeur :**
```
Email: vendeur@test.com
Mot de passe: password123
```

**Client :**
```
Email: client@test.com
Mot de passe: password123
```

---

## 📱 URLs importantes

- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:8080/api
- **Swagger UI** : http://localhost:8080/swagger-ui.html (si configuré)
- **H2 Console** : http://localhost:8080/h2-console (si H2 activé)

---

## 🆘 Commandes d'urgence

### Tout réinitialiser
```bash
# Supprimer tous les builds
rm -rf frontend/node_modules frontend/.angular frontend/dist
rm -rf backend/target backend/.idea

# Réinstaller
cd frontend && npm install
cd ../backend && mvn clean install
```

### Forcer la reconstruction
```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Backend
cd backend
mvn clean install -U
```

### Réinitialiser Git
```bash
# Annuler tous les changements non commités
git reset --hard HEAD
git clean -fd

# Synchroniser avec le remote
git fetch origin
git reset --hard origin/main
```

---

## 📚 Documentation

- [README principal](./README.md)
- [Guide de réorganisation](./GUIDE_REORGANISATION.md)
- [Documentation complète](./docs/README.md)
- [Guide de débogage](./docs/GUIDE_DEBOGAGE.md)

---

**Astuce** : Ajoutez ce fichier à vos favoris pour un accès rapide ! 🌟
