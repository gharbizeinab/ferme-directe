# 📚 Index de la Documentation - FermeDirecte

## 🚀 Démarrage

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **DEMARRAGE_RAPIDE.md** | Guide de démarrage en 4 étapes | ⭐ Commencez ici ! |
| **GUIDE_CONNEXION_ADMIN.md** | Guide pas à pas pour se connecter en admin | Après le démarrage |
| **README.md** | Vue d'ensemble du projet | Pour comprendre le projet |

---

## 🔧 Configuration

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **FIX_JDK_RAPIDE.md** | Fix rapide pour l'erreur JDK | ⚠️ Si erreur "JDK isn't specified" |
| **CONFIGURATION_JDK.md** | Guide complet de configuration Java 17 | Pour configuration détaillée |

---

## 🔐 Compte Administrateur

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **CREER_ADMIN.md** | 3 méthodes pour créer un admin | Si l'admin n'est pas créé automatiquement |
| **SOLUTION_ADMIN.md** | Explication technique de la solution | Pour comprendre comment ça marche |
| **backend/sql/CREATE_ADMIN.sql** | Script SQL pour créer l'admin | Création manuelle via phpMyAdmin |

---

## 🛠️ Scripts de Démarrage (Windows)

| Fichier | Description | Utilisation |
|---------|-------------|-------------|
| **DEMARRER_TOUT.bat** | Démarre backend + frontend | ⭐ Double-clic pour tout démarrer |
| **DEMARRER_BACKEND.bat** | Démarre uniquement le backend | Pour tester l'API seule |
| **DEMARRER_FRONTEND.bat** | Démarre uniquement le frontend | Si le backend est déjà lancé |

---

## 📖 Documentation Technique

| Dossier/Fichier | Description |
|-----------------|-------------|
| **docs/** | Documentation technique complète |
| **docs/API_DASHBOARD_VENDEUR.md** | API du dashboard vendeur |
| **docs/GESTION_CATEGORIES.md** | Gestion des catégories |
| **docs/GESTION_COMMANDES_VENDEUR.md** | Gestion des commandes |
| **docs/GESTION_PROFIL_UTILISATEUR.md** | Gestion du profil |

---

## 🗄️ Scripts SQL

| Fichier | Description |
|---------|-------------|
| **backend/sql/CREATE_ADMIN.sql** | Créer un admin manuellement |
| **backend/sql/SIMPLE_TEST_DATA.sql** | Données de test (vendeur, client) |
| **backend/sql/FIX_SELLER_PROFILES.sql** | Corriger les profils vendeurs |
| **backend/sql/UPDATE_ADDRESS_TABLE.sql** | Mise à jour de la table addresses |

---

## 🔄 Workflow de Développement

| Fichier | Description |
|---------|-------------|
| **WORKFLOW_QUOTIDIEN.md** | Workflow quotidien de développement |
| **GUIDE_REORGANISATION.md** | Guide de réorganisation du projet |
| **COMMANDES_RAPIDES.md** | Commandes utiles |

---

## 🆘 Dépannage

### Problème : "JDK isn't specified"
➡️ **FIX_JDK_RAPIDE.md** ou **CONFIGURATION_JDK.md**

### Problème : "Email ou mot de passe incorrect" (admin)
➡️ **GUIDE_CONNEXION_ADMIN.md** puis **CREER_ADMIN.md**

### Problème : Le backend ne démarre pas
➡️ **DEMARRAGE_RAPIDE.md** section "Problèmes courants"

### Problème : Erreur de base de données
➡️ **backend/sql/** (scripts de correction)

### Problème : Erreur de commande
➡️ **backend/RESOLUTION_ERREUR_COMMANDE.md**

---

## 🎯 Parcours Recommandé

### Pour démarrer le projet (première fois)

1. ✅ **DEMARRAGE_RAPIDE.md** - Démarrer l'application
2. ✅ **FIX_JDK_RAPIDE.md** - Si erreur JDK
3. ✅ **GUIDE_CONNEXION_ADMIN.md** - Se connecter en admin
4. ✅ **README.md** - Comprendre le projet

### Pour développer

1. ✅ **WORKFLOW_QUOTIDIEN.md** - Workflow de développement
2. ✅ **docs/** - Documentation technique
3. ✅ **COMMANDES_RAPIDES.md** - Commandes utiles

### En cas de problème

1. ✅ Consultez la section "🆘 Dépannage" ci-dessus
2. ✅ Vérifiez les logs (backend et frontend)
3. ✅ Consultez phpMyAdmin : http://localhost/phpmyadmin

---

## 📋 Credentials par Défaut

### Admin (créé automatiquement)
- **Email :** `admin@fermedirecte.com`
- **Mot de passe :** `Admin123!`

### Vendeur (après import de SIMPLE_TEST_DATA.sql)
- **Email :** `vendeur@test.com`
- **Mot de passe :** `password123`

### Client (après import de SIMPLE_TEST_DATA.sql)
- **Email :** `client@test.com`
- **Mot de passe :** `password123`

---

## 🌐 URLs Importantes

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080 |
| phpMyAdmin | http://localhost/phpmyadmin |
| Swagger (si activé) | http://localhost:8080/swagger-ui.html |

---

## 📁 Structure du Projet

```
ferme-directe-complete/
├── backend/                    # API Spring Boot
│   ├── src/                   # Code source Java
│   ├── sql/                   # Scripts SQL
│   └── pom.xml               # Configuration Maven
├── frontend/                  # Application Angular
│   ├── src/                  # Code source TypeScript
│   └── package.json          # Configuration npm
├── docs/                      # Documentation technique
├── *.md                       # Guides et documentation
└── *.bat                      # Scripts de démarrage Windows
```

---

## 🎉 Bon développement !

Vous avez maintenant accès à toute la documentation nécessaire pour travailler sur FermeDirecte ! 🚀

**Commencez par :** `DEMARRAGE_RAPIDE.md` ⭐
