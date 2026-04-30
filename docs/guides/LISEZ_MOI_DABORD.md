# 👋 LISEZ-MOI D'ABORD !

## 🎯 Vous êtes ici parce que...

Vous avez rencontré un ou plusieurs de ces problèmes :
- ❌ "JDK isn't specified for module 'FermeDirecte'"
- ❌ "Email ou mot de passe incorrect" (connexion admin)
- ❌ L'application ne démarre pas

## ✅ Tout est résolu !

J'ai créé une documentation complète pour vous aider.

---

## 🚀 Par où commencer ?

### 1️⃣ Configurer le JDK (si erreur JDK)

**Erreur :** `java: JDK isn't specified for module 'FermeDirecte'`

**Solution rapide :**
1. Dans IntelliJ : `Ctrl + Alt + Shift + S`
2. SDK → Sélectionnez votre **JDK** (vous utilisez JDK 23, c'est parfait !)
3. Language level → **17**
4. Apply → Rechargez Maven

📖 **Guide complet :** `FIX_JDK_INTELLIJ.md`

> 💡 Le projet nécessite Java 17+ mais fonctionne avec JDK 23

---

### 1️⃣ bis - Configurer Lombok (si erreur "variable not initialized")

**Erreur :** `java: variable orderService not initialized in the default constructor`

**Solution rapide :**
1. `File` → `Settings` → `Plugins` → Installez **"Lombok"**
2. `Settings` → `Compiler` → `Annotation Processors` → ✅ **Enable annotation processing**
3. `Build` → `Rebuild Project`

📖 **Guide complet :** `FIX_LOMBOK.md` ou `FIX_ERREURS_COMPILATION.md`

---

### 2️⃣ Démarrer l'application

**Méthode 1 : Tout en un (Recommandé)**

Double-cliquez sur : **`DEMARRER_TOUT.bat`**

**Méthode 2 : Manuel**

1. Démarrez MySQL dans XAMPP
2. Démarrez le backend : `DEMARRER_BACKEND.bat`
3. Démarrez le frontend : `DEMARRER_FRONTEND.bat`

📖 **Guide complet :** `DEMARRAGE_RAPIDE.md`

---

### 3️⃣ Se connecter en tant qu'admin

**URL :** http://localhost:4200

**Credentials :**
- **Email :** `admin@fermedirecte.com`
- **Mot de passe :** `Admin123!`

> ⚠️ **Important :** Le mot de passe est sensible à la casse !

📖 **Guide complet :** `GUIDE_CONNEXION_ADMIN.md`

---

## 📚 Documentation Disponible

### Guides de Démarrage
- ⭐ **DEMARRAGE_RAPIDE.md** - Démarrage en 4 étapes
- ⭐ **GUIDE_CONNEXION_ADMIN.md** - Se connecter en admin
- **INDEX_DOCUMENTATION.md** - Index complet de la documentation

### Configuration
- ⭐ **FIX_JDK_RAPIDE.md** - Fix rapide pour l'erreur JDK
- **CONFIGURATION_JDK.md** - Configuration détaillée de Java 17

### Compte Admin
- **CREER_ADMIN.md** - 3 méthodes pour créer un admin
- **SOLUTION_ADMIN.md** - Explication technique

### Scripts Windows
- **DEMARRER_TOUT.bat** - Démarre tout en un clic
- **DEMARRER_BACKEND.bat** - Démarre le backend
- **DEMARRER_FRONTEND.bat** - Démarre le frontend

---

## 🎯 Parcours Recommandé

```
1. FIX_JDK_RAPIDE.md (si erreur JDK)
   ↓
2. DEMARRAGE_RAPIDE.md
   ↓
3. GUIDE_CONNEXION_ADMIN.md
   ↓
4. Vous êtes prêt ! 🎉
```

---

## 🔑 Credentials

### Admin (créé automatiquement)
```
Email : admin@fermedirecte.com
Mot de passe : Admin123!
```

### Vendeur de test (optionnel)
```
Email : vendeur@test.com
Mot de passe : password123
```

### Client de test (optionnel)
```
Email : client@test.com
Mot de passe : password123
```

---

## 🆘 Problèmes Courants

| Problème | Solution |
|----------|----------|
| JDK isn't specified | `FIX_JDK_RAPIDE.md` |
| Email/mot de passe incorrect | `GUIDE_CONNEXION_ADMIN.md` |
| Backend ne démarre pas | Vérifiez MySQL dans XAMPP |
| Frontend ne démarre pas | `npm install` puis `npm start` |

---

## 📋 Checklist de Démarrage

- [ ] Java 17 installé et configuré
- [ ] MySQL démarré dans XAMPP
- [ ] Backend compilé et démarré
- [ ] Frontend démarré
- [ ] Connexion admin réussie

---

## 🎉 C'est Parti !

Vous avez tout ce qu'il faut pour démarrer FermeDirecte ! 🚀

**Prochaine étape :** Ouvrez `DEMARRAGE_RAPIDE.md` et suivez les instructions.

---

## 💡 Astuce

Gardez ces fichiers ouverts pendant que vous travaillez :
- `DEMARRAGE_RAPIDE.md` - Pour démarrer rapidement
- `INDEX_DOCUMENTATION.md` - Pour trouver la bonne documentation
- `GUIDE_CONNEXION_ADMIN.md` - Pour les credentials

---

## 📞 Structure de la Documentation

```
📁 ferme-directe-complete/
│
├── 📄 LISEZ_MOI_DABORD.md ⭐ (Vous êtes ici)
├── 📄 INDEX_DOCUMENTATION.md (Index complet)
│
├── 🚀 Démarrage
│   ├── DEMARRAGE_RAPIDE.md
│   ├── GUIDE_CONNEXION_ADMIN.md
│   └── README.md
│
├── 🔧 Configuration
│   ├── FIX_JDK_RAPIDE.md
│   └── CONFIGURATION_JDK.md
│
├── 🔐 Admin
│   ├── CREER_ADMIN.md
│   └── SOLUTION_ADMIN.md
│
├── 🛠️ Scripts
│   ├── DEMARRER_TOUT.bat
│   ├── DEMARRER_BACKEND.bat
│   └── DEMARRER_FRONTEND.bat
│
└── 📚 Documentation Technique
    └── docs/
```

---

**Bon développement ! 🎊**
