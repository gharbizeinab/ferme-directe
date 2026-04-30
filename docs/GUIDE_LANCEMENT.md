# 🌿 FermeDirecte — Guide Complet de Lancement (Angular 16 + Spring Boot + XAMPP)

---

## 📋 Ce que contient ce projet

| Partie | Technologie | Description |
|--------|-------------|-------------|
| **Frontend** | Angular **16** | Interface utilisateur |
| **Backend** | Spring Boot 3 + Java 17 | API REST + JWT |
| **Base de données** | MySQL (via XAMPP) | Données de l'application |

---

## ⚠️ IMPORTANT — Ce qui manque dans le backend

Le zip original ne contient **que** les controllers, config, et exceptions.
Les fichiers manquants qu'il faut créer ou récupérer :
- `entity/` — les entités JPA (Utilisateur, Produit, Commande, etc.)
- `service/` — la logique métier
- `repository/` — les accès base de données
- `dto/` — les objets de transfert de données
- `filter/JwtAuthenticationFilter.java`
- `FermeDirecteApplication.java` — le point d'entrée Spring Boot

**→ Vous devez les avoir dans votre version complète du projet. Si ce n'est pas le cas, recontactez votre équipe pour obtenir les sources complètes.**

---

## 🛠️ ÉTAPE 1 — Installer les outils

### 1.1 Java 17 (JDK)
1. Téléchargez depuis : https://adoptium.net/temurin/releases/?version=17
2. Choisissez : **Windows x64 → JDK → .msi**
3. Installez, puis vérifiez dans un terminal :
   ```
   java -version
   ```
   → Vous devez voir : `openjdk version "17.x.x"`

### 1.2 Node.js 18+
1. Téléchargez depuis : https://nodejs.org (version LTS)
2. Installez (cochez "Add to PATH")
3. Vérifiez :
   ```
   node -v    → v18.x.x ou plus
   npm -v     → 9.x.x ou plus
   ```

### 1.3 Angular CLI version 16
```bash
npm install -g @angular/cli@16
ng version
```
→ Vous devez voir `Angular CLI: 16.x.x`

### 1.4 XAMPP
1. Téléchargez depuis : https://www.apachefriends.org
2. Installez avec les options par défaut (Apache + MySQL suffisent)

### 1.5 IntelliJ IDEA
1. Téléchargez la **Community Edition** (gratuite) : https://www.jetbrains.com/idea/download
2. Installez avec les options par défaut

---

## 🗄️ ÉTAPE 2 — Configurer la base de données (XAMPP)

### 2.1 Démarrer XAMPP
1. Ouvrez **XAMPP Control Panel**
2. Cliquez **Start** à côté de **MySQL**
3. Le voyant doit devenir vert ✅
4. (Apache est optionnel mais pratique pour phpMyAdmin)
5. Cliquez **Start** à côté de **Apache** aussi

### 2.2 Créer la base de données via phpMyAdmin
1. Ouvrez votre navigateur : http://localhost/phpmyadmin
2. Dans le panneau gauche, cliquez **Nouveau** (ou **New**)
3. Dans "Nom de la base de données" : tapez `fermedirecte`
4. Encodage : choisissez `utf8mb4_unicode_ci`
5. Cliquez **Créer**

### 2.3 Importer le schéma SQL
1. Cliquez sur la base `fermedirecte` dans le panneau gauche
2. Cliquez l'onglet **Importer** (en haut)
3. Cliquez **Choisir un fichier**
4. Naviguez vers : `backend/src/main/resources/schema.sql`
5. Cliquez **Importer** en bas de la page
6. Vous devez voir : "Importation réussie"

### 2.4 Vérifier les tables créées
Dans phpMyAdmin, la base `fermedirecte` doit contenir :
- `utilisateur` — les comptes utilisateurs
- `categorie` — les catégories de produits
- `produit` — les produits
- `panier`, `ligne_panier` — le panier
- `commande`, `ligne_commande` — les commandes
- `adresse`, `coupon`, `avis` — autres tables

---

## ☕ ÉTAPE 3 — Lancer le Backend (IntelliJ)

### 3.1 Ouvrir le projet dans IntelliJ
1. Ouvrez **IntelliJ IDEA**
2. Cliquez **Open** (ou File → Open)
3. Naviguez vers le dossier **`backend/`** de votre projet
4. Cliquez **OK**
5. IntelliJ demande : **"Trust this project?"** → cliquez **Trust Project**
6. IntelliJ détecte automatiquement le `pom.xml` Maven
7. Attendez le téléchargement des dépendances (barre en bas à droite)
   → Peut prendre 3-10 minutes la première fois

### 3.2 Vérifier application.properties
Ouvrez : `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fermedirecte?useSSL=false&serverTimezone=UTC&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

> ⚠️ Si vous avez mis un mot de passe MySQL dans XAMPP, changez la ligne `password=` par `password=votre_mot_de_passe`

### 3.3 Lancer l'application Spring Boot
**Option A — Via IntelliJ (recommandé) :**
1. Dans le panneau gauche, naviguez vers :
   `src/main/java/com/FermeDirecte/FermeDirecte/FermeDirecteApplication.java`
2. Clic droit sur ce fichier → **Run 'FermeDirecteApplication'**
3. Ou : cliquez le bouton ▶ vert dans la barre du haut

**Option B — Via terminal Maven :**
```bash
cd backend
mvn spring-boot:run
```

**✅ Le backend est prêt quand vous voyez :**
```
Started FermeDirecteApplication in X.XXX seconds (JVM running for X.XXX)
Tomcat started on port(s): 8080
```

### 3.4 Tester le backend
Ouvrez votre navigateur ou terminal :
```
http://localhost:8080/api/categories
```
→ Vous devez voir une liste JSON (peut être vide `[]` si le schéma n'a pas de données de test)

---

## 🌐 ÉTAPE 4 — Lancer le Frontend (Angular 16)

### 4.1 Ouvrir un terminal dans le dossier frontend
```bash
cd chemin/vers/votre/projet/frontend
```

### 4.2 Installer les dépendances Node.js
```bash
npm install
```
→ Cela crée un dossier `node_modules/`. Peut prendre 2-5 minutes.

Si vous avez des erreurs, essayez :
```bash
npm install --legacy-peer-deps
```

### 4.3 Lancer le serveur de développement
```bash
ng serve
```
ou pour ouvrir automatiquement dans le navigateur :
```bash
ng serve --open
```

**✅ Angular est prêt quand vous voyez :**
```
✔ Browser application bundle generation complete.
Local:   http://localhost:4200/
```

### 4.4 Ouvrir l'application
Naviguez vers : **http://localhost:4200**

---

## 👤 ÉTAPE 5 — Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | admin@fermedirecte.tn | admin1234 |
| **Vendeur** | ali@ferme.tn | seller123 |
| **Acheteur** | sonia@email.tn | customer123 |

> Ces comptes sont créés par le `schema.sql`. Vérifiez que l'import a bien fonctionné.

---

## 🔁 Ordre de lancement quotidien

Chaque fois que vous travaillez sur le projet, respectez cet ordre :

```
1. Ouvrez XAMPP → Start MySQL (et Apache)
2. Ouvrez IntelliJ → Run FermeDirecteApplication
   (attendre "Tomcat started on port 8080")
3. Dans le terminal frontend → ng serve
   (attendre "http://localhost:4200")
4. Ouvrez http://localhost:4200 dans le navigateur
```

---

## ❌ Résolution des problèmes courants

### Erreur : "Communications link failure"
**Cause :** MySQL XAMPP n'est pas démarré
**Solution :** Ouvrez XAMPP → Start MySQL

### Erreur : "Unknown database 'fermedirecte'"
**Cause :** La base de données n'existe pas
**Solution :** Suivez l'étape 2.2 pour la créer

### Erreur : "Port 8080 already in use"
**Solution Windows :**
```bash
netstat -ano | findstr :8080
taskkill /PID <NUMERO_PID> /F
```

### Erreur : "Port 4200 already in use"
```bash
ng serve --port 4201
```

### Erreur Angular : "Cannot find module '@angular/material'"
```bash
npm install @angular/material @angular/cdk @angular/animations
```

### Erreur : "ng: command not found"
```bash
npm install -g @angular/cli@16
```

### Erreur CORS dans le navigateur
Vérifiez que `application.properties` contient :
```properties
app.cors.allowed-origins=http://localhost:4200
```
Et que le backend est bien lancé sur le port 8080.

### L'application Angular se lance mais les données ne s'affichent pas
1. Vérifiez que le backend tourne sur http://localhost:8080
2. Ouvrez les DevTools du navigateur (F12) → onglet "Console" → regardez les erreurs
3. Onglet "Network" → regardez les requêtes qui échouent

### Erreur IntelliJ : "Cannot resolve symbol 'lombok'"
Dans IntelliJ : Settings → Plugins → cherchez "Lombok" → Installez → Redémarrez IntelliJ

### Erreur IntelliJ : beans Spring non trouvés
Vérifiez que les packages entity/, service/, repository/ existent dans le backend.
Ces fichiers ne sont pas inclus dans le zip — récupérez-les depuis votre version complète.

---

## 📁 Structure finale du projet

```
ferme-directe/
├── backend/                  ← Spring Boot (Maven)
│   ├── pom.xml               ← Dépendances Java
│   └── src/main/
│       ├── java/com/FermeDirecte/FermeDirecte/
│       │   ├── FermeDirecteApplication.java   ← Point d'entrée
│       │   ├── config/        SecurityConfig, WebConfig
│       │   ├── controller/    AuthController, ProductController...
│       │   ├── dto/           Request/Response DTOs
│       │   ├── entity/        Entités JPA (Utilisateur, Produit...)
│       │   ├── exception/     GlobalExceptionHandler
│       │   ├── filter/        JwtAuthenticationFilter
│       │   ├── repository/    Spring Data JPA
│       │   └── service/       Logique métier
│       └── resources/
│           ├── application.properties
│           └── schema.sql
│
└── frontend/                 ← Angular 16
    ├── package.json          ← Angular 16 (pas 17 !)
    ├── angular.json
    ├── tsconfig.json
    └── src/
        ├── main.ts
        ├── styles.scss
        └── app/
            ├── app.module.ts          ← Module principal
            ├── app.component.ts
            ├── models/index.ts        ← Interfaces TypeScript
            ├── services/              auth, cart, product, order...
            ├── guards/                AuthGuard, RoleGuard
            ├── interceptors/          AuthInterceptor (JWT)
            └── components/
                ├── layout/            Navbar + Sidenav
                ├── login/ register/   Authentification
                ├── products/          Liste des produits
                ├── product-details/   Détail produit
                ├── cart/              Panier
                ├── checkout/          Commande (3 étapes)
                ├── dashboard/         Admin + Seller stats
                ├── manage-products/   CRUD produits
                ├── orders/            Liste commandes
                └── confirm-dialog/    Dialog de confirmation
```

---

## 🔗 URLs importantes

| Service | URL |
|---------|-----|
| Application Angular | http://localhost:4200 |
| API Backend | http://localhost:8080/api |
| phpMyAdmin | http://localhost/phpmyadmin |
| Test API catégories | http://localhost:8080/api/categories |
| Test API produits | http://localhost:8080/api/products |

---

*Guide rédigé pour FermeDirecte v2.0 — Angular 16 + Spring Boot 3 + MySQL (XAMPP)*
