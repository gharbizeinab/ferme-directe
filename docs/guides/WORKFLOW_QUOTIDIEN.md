# 🔄 Workflow Quotidien - Travailler et Pousser sur GitHub

Guide complet pour travailler sur le projet Ferme Directe au quotidien.

---

## 📋 Table des matières

1. [Démarrer une session de travail](#démarrer-une-session-de-travail)
2. [Développer et tester](#développer-et-tester)
3. [Sauvegarder et pousser sur GitHub](#sauvegarder-et-pousser-sur-github)
4. [Workflow Git complet](#workflow-git-complet)
5. [Commandes rapides](#commandes-rapides)

---

## 🚀 Démarrer une session de travail

### 1. Ouvrir le projet

```cmd
cd C:\Users\User\Desktop\IIT\2éme GLID\SEM2\Angular\projet\test1\ferme-directe-complete
```

### 2. Récupérer les dernières modifications (si travail en équipe)

```cmd
git pull origin main
```

### 3. Vérifier l'état du projet

```cmd
git status
```

### 4. Lancer le backend (Terminal 1)

```cmd
cd backend
mvn spring-boot:run
```

### 5. Lancer le frontend (Terminal 2)

```cmd
cd frontend
npm start
```

---

## 💻 Développer et tester

### Pendant le développement

- ✅ Modifie tes fichiers dans `frontend/src/` ou `backend/src/`
- ✅ Teste régulièrement dans le navigateur
- ✅ Vérifie les logs dans les terminaux

### Vérifier les modifications

```cmd
# Voir les fichiers modifiés
git status

# Voir les modifications détaillées
git diff

# Voir les modifications d'un fichier spécifique
git diff frontend/src/app/components/home/home.component.ts
```

---

## 💾 Sauvegarder et pousser sur GitHub

### Workflow standard (3 étapes)

#### **Étape 1 : Ajouter les fichiers modifiés**

```cmd
# Ajouter tous les fichiers modifiés
git add .

# OU ajouter des fichiers spécifiques
git add frontend/src/app/components/home/home.component.ts
git add backend/src/main/java/com/FermeDirecte/controller/ProductController.java
```

#### **Étape 2 : Créer un commit avec un message descriptif**

```cmd
git commit -m "Description de tes modifications"
```

**Exemples de bons messages de commit :**

```cmd
# Nouvelle fonctionnalité
git commit -m "✨ Ajout du système de filtrage des produits"

# Correction de bug
git commit -m "🐛 Fix: Correction du calcul du total du panier"

# Amélioration
git commit -m "♻️ Refactor: Optimisation du chargement des images"

# Documentation
git commit -m "📚 Docs: Mise à jour du README avec les nouvelles API"

# Style/UI
git commit -m "💄 Style: Amélioration du design de la page d'accueil"
```

#### **Étape 3 : Pousser vers GitHub**

```cmd
git push origin main
```

---

## 🔄 Workflow Git complet

### Scénario 1 : Modifications simples (quotidien)

```cmd
# 1. Vérifier l'état
git status

# 2. Ajouter les modifications
git add .

# 3. Commit
git commit -m "Description des modifications"

# 4. Push
git push origin main
```

### Scénario 2 : Modifications par catégorie

```cmd
# Commit 1 : Frontend
git add frontend/
git commit -m "✨ Frontend: Ajout du composant de recherche"

# Commit 2 : Backend
git add backend/
git commit -m "✨ Backend: Ajout de l'API de recherche"

# Push tous les commits
git push origin main
```

### Scénario 3 : Annuler des modifications non commitées

```cmd
# Annuler les modifications d'un fichier
git checkout -- frontend/src/app/app.component.ts

# Annuler toutes les modifications
git reset --hard HEAD
```

### Scénario 4 : Modifier le dernier commit

```cmd
# Si tu as oublié d'ajouter un fichier
git add fichier-oublie.ts
git commit --amend --no-edit

# Si tu veux changer le message du dernier commit
git commit --amend -m "Nouveau message"

# Push (force car tu as modifié l'historique)
git push --force origin main
```

---

## ⚡ Commandes rapides

### Workflow ultra-rapide (1 ligne)

```cmd
git add . && git commit -m "Update" && git push origin main
```

### Avec message personnalisé

```cmd
git add . && git commit -m "Ajout de la page produits" && git push origin main
```

---

## 📊 Vérifications importantes

### Avant de pousser, vérifie toujours :

```cmd
# 1. Voir les fichiers qui seront poussés
git status

# 2. Vérifier qu'il n'y a pas de gros fichiers
git ls-files | findstr ".angular"
git ls-files | findstr "node_modules"

# 3. Voir l'historique des commits
git log --oneline -5
```

### Si tu vois des gros fichiers :

```cmd
# Les retirer du staging
git reset HEAD frontend/.angular
git reset HEAD frontend/node_modules

# Vérifier le .gitignore
type .gitignore
```

---

## 🌿 Travailler avec des branches (optionnel mais recommandé)

### Créer une branche pour une nouvelle fonctionnalité

```cmd
# Créer et basculer sur une nouvelle branche
git checkout -b feature/nouvelle-fonctionnalite

# Développer sur cette branche
# ... modifications ...

# Commit sur la branche
git add .
git commit -m "✨ Ajout de la nouvelle fonctionnalité"

# Pousser la branche
git push origin feature/nouvelle-fonctionnalite

# Revenir sur main
git checkout main

# Fusionner la branche
git merge feature/nouvelle-fonctionnalite

# Pousser main
git push origin main

# Supprimer la branche locale
git branch -d feature/nouvelle-fonctionnalite
```

---

## 🆘 Problèmes courants

### "Push rejeté - behind remote"

```cmd
# Récupérer les modifications distantes
git pull origin main

# Résoudre les conflits si nécessaire
# Puis pousser
git push origin main
```

### "Conflit de fusion"

```cmd
# 1. Voir les fichiers en conflit
git status

# 2. Ouvrir les fichiers et résoudre les conflits
# Chercher les marqueurs : <<<<<<< HEAD

# 3. Ajouter les fichiers résolus
git add .

# 4. Finaliser la fusion
git commit -m "Résolution des conflits"

# 5. Pousser
git push origin main
```

### "Fichiers non trackés"

```cmd
# Ajouter au .gitignore
echo frontend/.angular/ >> .gitignore
echo frontend/node_modules/ >> .gitignore

# Commit le .gitignore
git add .gitignore
git commit -m "Update .gitignore"
git push origin main
```

---

## 📅 Routine quotidienne recommandée

### Début de journée

```cmd
# 1. Récupérer les dernières modifications
git pull origin main

# 2. Vérifier l'état
git status

# 3. Lancer le projet
# Terminal 1 : cd backend && mvn spring-boot:run
# Terminal 2 : cd frontend && npm start
```

### Pendant le développement

```cmd
# Commit régulièrement (toutes les 30 min - 1h)
git add .
git commit -m "Description des modifications"
```

### Fin de journée

```cmd
# 1. Commit final
git add .
git commit -m "Fin de journée - [description]"

# 2. Push vers GitHub
git push origin main

# 3. Vérifier sur GitHub que tout est OK
```

---

## 🎯 Bonnes pratiques

### Messages de commit

✅ **BON :**
```cmd
git commit -m "✨ Ajout du système de filtrage par catégorie"
git commit -m "🐛 Fix: Correction du bug d'affichage du panier"
git commit -m "♻️ Refactor: Optimisation des requêtes API"
```

❌ **MAUVAIS :**
```cmd
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

### Fréquence des commits

- ✅ Commit après chaque fonctionnalité terminée
- ✅ Commit avant de changer de tâche
- ✅ Commit en fin de journée
- ❌ Ne pas attendre plusieurs jours avant de commit

### Fréquence des push

- ✅ Push au moins 1 fois par jour
- ✅ Push après chaque fonctionnalité importante
- ✅ Push avant de fermer l'ordinateur
- ❌ Ne pas garder les commits localement trop longtemps

---

## 📝 Checklist avant chaque push

- [ ] `git status` - Vérifier les fichiers modifiés
- [ ] Pas de fichiers `.angular/`, `node_modules/`, `dist/`, `target/`
- [ ] Le code compile sans erreur
- [ ] Les tests passent (si tu en as)
- [ ] Message de commit descriptif
- [ ] `git push origin main`
- [ ] Vérifier sur GitHub que le push a réussi

---

## 🔧 Configuration Git (une seule fois)

### Configurer ton identité

```cmd
git config --global user.name "Ton Nom"
git config --global user.email "ton.email@example.com"
```

### Configurer l'éditeur par défaut

```cmd
git config --global core.editor "code --wait"
```

### Voir ta configuration

```cmd
git config --list
```

---

## 📚 Ressources

- **Voir l'historique** : `git log --oneline --graph --all`
- **Voir les branches** : `git branch -a`
- **Voir les remotes** : `git remote -v`
- **Aide Git** : `git help <commande>`

---

## 🎓 Résumé - Workflow quotidien en 3 commandes

```cmd
# 1. Ajouter
git add .

# 2. Commit
git commit -m "Description de tes modifications"

# 3. Push
git push origin main
```

**C'est tout ! Simple et efficace.** 🚀

---

**Dernière mise à jour** : 2024
