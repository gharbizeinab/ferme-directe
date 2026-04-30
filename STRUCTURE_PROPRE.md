# Structure du Projet FermeDirecte

## 📁 Structure Actuelle (Problèmes identifiés)

### ❌ Problèmes à corriger :

1. **Dossier vide** : `/-p/` (à supprimer)
2. **Documentation éparpillée** : 30+ fichiers MD à la racine (à déplacer dans `/docs`)
3. **Scripts redondants** : Multiples fichiers `.bat` similaires
4. **Fichiers temporaires** : Fichiers de debug et de test

## 📁 Structure Recommandée

```
ferme-directe-complete/
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules
├── README.md                      # Documentation principale
│
├── backend/                       # Backend Spring Boot
│   ├── .gitignore
│   ├── pom.xml
│   ├── src/
│   ├── sql/                       # Scripts SQL
│   └── target/                    # Build output (gitignored)
│
├── frontend/                      # Frontend Angular
│   ├── .gitignore
│   ├── package.json
│   ├── angular.json
│   ├── src/
│   ├── node_modules/              # Dependencies (gitignored)
│   └── .angular/                  # Angular cache (gitignored)
│
├── docs/                          # Documentation complète
│   ├── README.md                  # Index de la documentation
│   ├── setup/                     # Guides d'installation
│   ├── guides/                    # Guides utilisateur
│   └── api/                       # Documentation API
│
└── scripts/                       # Scripts utilitaires
    ├── start-backend.bat
    ├── start-frontend.bat
    ├── start-all.bat
    └── cleanup.bat
```

## 🔧 Actions à effectuer

### 1. Supprimer les dossiers vides
```bash
rmdir /s /q ferme-directe-complete/-p
```

### 2. Créer la structure docs/
```
docs/
├── setup/
│   ├── INSTALLATION.md
│   ├── CONFIGURATION_JDK.md
│   └── CONFIGURATION_INTELLIJ.md
├── guides/
│   ├── GUIDE_ADMIN.md
│   ├── GUIDE_VENDEUR.md
│   └── GUIDE_ACHETEUR.md
└── troubleshooting/
    ├── ERREURS_COMMUNES.md
    └── SOLUTIONS_RAPIDES.md
```

### 3. Créer la structure scripts/
```
scripts/
├── start-backend.bat
├── start-frontend.bat
├── start-all.bat
├── cleanup.bat
└── push-github.bat
```

### 4. Nettoyer .gitignore
Vérifier que ces éléments sont ignorés :
- `node_modules/`
- `target/`
- `.angular/`
- `.idea/`
- `*.log`
- `.DS_Store`

## 📝 Fichiers à conserver à la racine

- `README.md` - Documentation principale
- `.gitignore` - Règles Git
- `LICENSE` (optionnel)

## 🗑️ Fichiers à supprimer ou déplacer

### À déplacer dans `/docs/setup/`:
- CONFIGURATION_INTELLIJ.md
- CONFIGURATION_JDK.md
- FIX_JDK_INTELLIJ.md
- FIX_LOMBOK.md
- DEMARRAGE_RAPIDE.md

### À déplacer dans `/docs/guides/`:
- GUIDE_CONNEXION_ADMIN.md
- GUIDE_REORGANISATION.md
- WORKFLOW_QUOTIDIEN.md
- CREER_ADMIN.md
- SOLUTION_ADMIN.md

### À déplacer dans `/scripts/`:
- DEMARRER_BACKEND.bat
- DEMARRER_FRONTEND.bat
- DEMARRER_TOUT.bat
- NOUVEAU_REPO_GITHUB.bat
- PUSH_PROPRE.bat
- PUSH_RAPIDE.bat
- cleanup.bat
- cleanup.sh

### À supprimer (redondants ou obsolètes):
- COMMANDES_GIT_QUOTIDIENNES.txt
- COMMANDES_MANUELLES.txt
- COMMANDES_URGENTES.txt
- LIRE_MOI_URGENT.txt
- SOLUTION_URGENTE.md
- SOLUTION_RAPIDE.md
- SOLUTION_DEFINITIVE.bat
- fix-git-cache.bat
- NOUVEAU_DEPOT.bat

## ✅ Vérifications avant push

1. ✅ Dossiers vides supprimés
2. ✅ Documentation organisée dans `/docs`
3. ✅ Scripts organisés dans `/scripts`
4. ✅ `.gitignore` à jour
5. ✅ Pas de fichiers sensibles (mots de passe, clés API)
6. ✅ Pas de fichiers de build (`target/`, `node_modules/`)
7. ✅ README.md clair et à jour

## 🚀 Commandes pour nettoyer

```bash
# 1. Supprimer le dossier vide
rmdir /s /q -p

# 2. Créer les dossiers
mkdir docs\setup
mkdir docs\guides
mkdir docs\troubleshooting
mkdir scripts

# 3. Déplacer les fichiers (voir script de nettoyage)

# 4. Vérifier le statut Git
git status

# 5. Ajouter les changements
git add .

# 6. Commit
git commit -m "chore: restructuration du projet pour organisation claire"

# 7. Push
git push origin main
```
