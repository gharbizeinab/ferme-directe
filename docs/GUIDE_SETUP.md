# FermeDirecte — Guide de Configuration et d'Exécution Complet

> Application Angular 17 + Spring Boot 3 + MySQL 8  
> Marché agricole tunisien — version améliorée

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Structure du projet](#structure)
3. [Base de données (XAMPP + MySQL)](#base-de-données)
4. [Backend — Spring Boot (IntelliJ)](#backend)
5. [Frontend — Angular](#frontend)
6. [Comptes de test](#comptes-de-test)
7. [Routes API](#routes-api)
8. [Résolution des problèmes courants](#dépannage)

---

## 1. Prérequis

| Outil | Version minimale | Téléchargement |
|-------|-----------------|----------------|
| Java (JDK) | 17+ | https://adoptium.net |
| Maven | 3.8+ | https://maven.apache.org |
| Node.js | 18+ | https://nodejs.org |
| Angular CLI | 17+ | `npm install -g @angular/cli` |
| XAMPP | 8.x | https://www.apachefriends.org |
| IntelliJ IDEA | 2023+ | https://www.jetbrains.com |
| Git | any | https://git-scm.com |

---

## 2. Structure du projet

```
FermeDirecte/
├── backend/          ← Spring Boot (Maven)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/FermeDirecte/FermeDirecte/
│   │       │   ├── config/          SecurityConfig, WebConfig
│   │       │   ├── controller/      REST controllers
│   │       │   ├── dto/             Request/Response DTOs
│   │       │   ├── entity/          JPA Entities
│   │       │   ├── exception/       GlobalExceptionHandler
│   │       │   ├── filter/          JwtAuthenticationFilter
│   │       │   ├── repository/      Spring Data JPA repos
│   │       │   └── service/         Business logic
│   │       └── resources/
│   │           ├── application.properties
│   │           └── schema.sql
│   └── pom.xml
│
└── frontend/         ← Angular 17
    ├── src/
    │   ├── app/
    │   │   ├── components/          UI components
    │   │   ├── services/            HTTP services
    │   │   ├── models/              TypeScript interfaces
    │   │   ├── guards/              Route guards
    │   │   └── interceptors/        HTTP interceptors
    │   ├── environments/
    │   └── styles.scss
    └── package.json
```

---

## 3. Base de données (XAMPP + MySQL)

### 3.1 Démarrer XAMPP

1. Ouvrez **XAMPP Control Panel**
2. Cliquez **Start** sur **Apache** et **MySQL**
3. Vérifiez que les voyants sont verts

### 3.2 Créer la base de données

**Option A — Via phpMyAdmin (interface graphique)**

1. Ouvrez http://localhost/phpmyadmin dans votre navigateur
2. Cliquez sur **Nouvelle base de données** (ou "New" dans le menu gauche)
3. Nom : `fermedirecte` → Encodage : `utf8mb4_unicode_ci` → **Créer**
4. Cliquez sur **Importer** (onglet en haut)
5. Sélectionnez le fichier `backend/src/main/resources/schema.sql`
6. Cliquez **Exécuter**

**Option B — Via terminal MySQL**

```bash
# Ouvrir MySQL depuis XAMPP
cd C:\xampp\mysql\bin        # Windows
# ou
cd /Applications/XAMPP/bin   # macOS

# Connexion
mysql -u root -p
# (appuyez Entrée si pas de mot de passe)

# Créer et importer
source /chemin/vers/schema.sql;
# ou copier-coller le contenu du fichier
```

### 3.3 Vérifier l'import

Dans phpMyAdmin, la base `fermedirecte` doit contenir ces tables :

- `utilisateur`, `categorie`, `produit`, `produit_categorie`
- `variante_produit`, `adresse`, `coupon`
- `panier`, `ligne_panier`, `commande`, `ligne_commande`, `avis`

---

## 4. Backend — Spring Boot (IntelliJ)

### 4.1 Ouvrir le projet

1. Ouvrez **IntelliJ IDEA**
2. `File` → `Open` → sélectionnez le dossier **`backend/`**
3. IntelliJ détecte automatiquement le `pom.xml` Maven
4. Attendez le chargement des dépendances (barre de progression en bas)

### 4.2 Configurer `application.properties`

Ouvrez `src/main/resources/application.properties` et vérifiez :

```properties
# URL de la base de données
spring.datasource.url=jdbc:mysql://localhost:3306/fermedirecte?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8&allowPublicKeyRetrieval=true

# Identifiants MySQL (XAMPP par défaut = root / pas de mot de passe)
spring.datasource.username=root
spring.datasource.password=

# Port du serveur (ne pas changer si Angular utilise 4200)
server.port=8080
```

> ⚠️ Si vous avez défini un mot de passe MySQL dans XAMPP, mettez-le dans `spring.datasource.password=votre_mot_de_passe`

### 4.3 Lancer le backend

**Via IntelliJ :**

1. Ouvrez `src/main/java/com/FermeDirecte/FermeDirecte/FermeDirecteApplication.java`
2. Cliquez sur le bouton ▶ vert en haut à droite
3. Ou : clic droit sur le fichier → **Run 'FermeDirecteApplication'**

**Via terminal Maven :**

```bash
cd backend
mvn spring-boot:run
```

**Vérification :** Le serveur est prêt quand vous voyez :

```
Started FermeDirecteApplication in X.XXX seconds
Tomcat started on port(s): 8080
```

### 4.4 Tester le backend

```bash
# Test de santé
curl http://localhost:8080/api/categories

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fermedirecte.tn","motDePasse":"admin1234"}'
```

---

## 5. Frontend — Angular

### 5.1 Installer les dépendances

```bash
cd frontend
npm install
```

> ⏳ Cela peut prendre 2-5 minutes la première fois.

### 5.2 Vérifier la configuration API

Ouvrez `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // ← doit pointer vers votre backend
};
```

### 5.3 Lancer l'application

```bash
ng serve
# ou
ng serve --open   # ouvre automatiquement le navigateur
```

L'application est disponible sur **http://localhost:4200**

### 5.4 Commandes utiles

```bash
# Build de production
ng build --configuration production

# Lancer les tests
ng test

# Vérifier les erreurs TypeScript
ng build --aot

# Mettre à jour les modules Angular Material
ng update @angular/core @angular/cli @angular/material
```

---

## 6. Comptes de test

| Rôle | Email | Mot de passe | Accès |
|------|-------|-------------|-------|
| **Admin** | admin@fermedirecte.tn | admin1234 | Dashboard complet, toutes les commandes, gestion catégories |
| **Vendeur** | ali@ferme.tn | seller123 | Dashboard vendeur, gestion de ses produits, ses commandes |
| **Acheteur** | sonia@email.tn | customer123 | Parcourir produits, panier, commandes personnelles |

### Créer un nouveau compte

Via l'interface : http://localhost:4200/register

Via API :
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Test",
    "nom": "Utilisateur",
    "email": "test@test.tn",
    "motDePasse": "password123",
    "role": "CUSTOMER"
  }'
```

---

## 7. Routes API principales

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/auth/login` | Non | Connexion |
| POST | `/api/auth/register` | Non | Inscription |
| GET | `/api/products` | Non | Liste des produits (avec pagination + filtres) |
| GET | `/api/products/{id}` | Non | Détail produit |
| GET | `/api/categories` | Non | Liste des catégories |
| GET | `/api/cart` | Oui | Panier de l'utilisateur |
| POST | `/api/cart/items` | Oui | Ajouter au panier |
| POST | `/api/orders` | Oui | Passer une commande |
| GET | `/api/orders/my-orders` | Oui | Mes commandes |
| GET | `/api/orders` | Admin/Seller | Toutes les commandes |
| GET | `/api/dashboard/admin` | Admin | Stats admin |
| GET | `/api/dashboard/seller` | Seller | Stats vendeur |

### Paramètres de filtrage des produits

```
GET /api/products?page=0&size=12&search=tomate&categoryId=1&sortBy=prix&sortDir=asc
```

---

## 8. Résolution des problèmes courants

### ❌ Erreur : "Communications link failure"
**Cause :** MySQL n'est pas démarré  
**Solution :** Ouvrez XAMPP et démarrez MySQL

### ❌ Erreur : "Unknown database 'fermedirecte'"
**Cause :** La base de données n'a pas été créée  
**Solution :** Suivez l'étape 3.2 pour importer `schema.sql`

### ❌ Erreur : "CORS policy" dans le navigateur
**Cause :** Le backend n'autorise pas les requêtes depuis Angular  
**Solution :** Vérifiez `application.properties` :
```properties
app.cors.allowed-origins=http://localhost:4200
```

### ❌ Erreur : "Port 8080 already in use"
**Solution :**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8080 | xargs kill -9
```

### ❌ Erreur Angular : "Cannot find module '@angular/material/...'"
**Solution :**
```bash
npm install @angular/material @angular/cdk @angular/animations
```

### ❌ Erreur : "401 Unauthorized" sur toutes les requêtes
**Cause :** Token JWT expiré ou invalide  
**Solution :** Déconnectez-vous et reconnectez-vous. Si le problème persiste, vérifiez la clé secrète JWT dans `application.properties`

### ❌ Erreur : "Unsatisfied dependency" au démarrage Spring
**Cause :** Bean Spring manquant  
**Solution :** Vérifiez que tous les services, repositories et contrôleurs ont les annotations `@Service`, `@Repository`, `@RestController`

### ❌ Les catégories n'apparaissent pas dans le dropdown produit
**Cause :** L'endpoint `/api/categories` ne retourne pas de données  
**Solution :** 
1. Vérifiez que le schema.sql a bien été importé (les catégories de test y sont incluses)
2. Testez : `curl http://localhost:8080/api/categories`

---

## 9. Flux de test complet

Voici la séquence recommandée pour tester toute l'application :

```
1. Ouvrir http://localhost:4200
2. Se connecter en tant qu'Admin (admin@fermedirecte.tn / admin1234)
3. Vérifier le tableau de bord admin → stats globales
4. Aller dans "Gestion des Produits" → créer un nouveau produit
5. Se déconnecter

6. Se connecter en tant qu'Acheteur (sonia@email.tn / customer123)
7. Parcourir les produits → recherche par nom ou catégorie
8. Cliquer sur un produit → voir les détails
9. Ajouter au panier
10. Aller dans le panier → tester le coupon "BIENVENUE10"
11. Passer la commande (checkout en 3 étapes)
12. Vérifier la commande dans "Mes Commandes"
13. Laisser un avis sur un produit

14. Se déconnecter
15. Se connecter en tant que Vendeur (ali@ferme.tn / seller123)
16. Vérifier le tableau de bord vendeur
17. Voir les commandes reçues
18. Modifier le statut d'une commande
```

---

## 10. Variables d'environnement (production)

Pour un déploiement en production, créez des variables d'environnement au lieu de les coder en dur :

```bash
# Backend
export DB_URL=jdbc:mysql://votre-serveur/fermedirecte
export DB_USER=votre_user
export DB_PASSWORD=votre_password
export JWT_SECRET=votre_secret_tres_long_et_securise

# Frontend — modifiez environment.prod.ts
export API_URL=https://votre-api.com/api
```

---

*Guide rédigé pour FermeDirecte v2.0 — Version améliorée et optimisée*
