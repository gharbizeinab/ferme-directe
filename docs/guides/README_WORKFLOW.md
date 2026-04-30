# 🚀 Guide Rapide - Workflow Quotidien

Guide ultra-simplifié pour travailler sur le projet au quotidien.

---

## ⚡ Workflow en 3 commandes

```cmd
git add .
git commit -m "Description de tes modifications"
git push origin main
```

**C'est tout !** 🎉

---

## 🔧 OU utilise le script automatique

```cmd
PUSH_RAPIDE.bat
```

Le script va :
1. Vérifier l'état du dépôt
2. Te demander un message de commit
3. Ajouter tous les fichiers
4. Créer le commit
5. Pousser vers GitHub

---

## 📚 Documentation complète

- **[WORKFLOW_QUOTIDIEN.md](./WORKFLOW_QUOTIDIEN.md)** - Guide complet et détaillé
- **[COMMANDES_GIT_QUOTIDIENNES.txt](./COMMANDES_GIT_QUOTIDIENNES.txt)** - Aide-mémoire rapide
- **[PUSH_RAPIDE.bat](./PUSH_RAPIDE.bat)** - Script automatique

---

## 🎯 Scénarios courants

### Scénario 1 : Modifications simples (quotidien)

```cmd
git add .
git commit -m "Ajout de la page produits"
git push origin main
```

### Scénario 2 : Début de journée

```cmd
git pull origin main
cd backend && mvn spring-boot:run    # Terminal 1
cd frontend && npm start              # Terminal 2
```

### Scénario 3 : Fin de journée

```cmd
git add .
git commit -m "Fin de journée - Travail sur le panier"
git push origin main
```

### Scénario 4 : Vérifier avant de pousser

```cmd
git status
git diff
git add .
git commit -m "Description"
git push origin main
```

---

## 💡 Exemples de messages de commit

```cmd
# Nouvelle fonctionnalité
git commit -m "✨ Ajout du système de filtrage des produits"

# Correction de bug
git commit -m "🐛 Fix: Correction du calcul du total du panier"

# Amélioration
git commit -m "♻️ Refactor: Optimisation du chargement des images"

# Documentation
git commit -m "📚 Docs: Mise à jour du README"

# Style/UI
git commit -m "💄 Style: Amélioration du design de la page d'accueil"
```

---

## 🆘 Problèmes courants

### "Push rejeté"

```cmd
git pull origin main
git push origin main
```

### "Conflit de fusion"

```cmd
git status                    # Voir les fichiers en conflit
# Résoudre les conflits manuellement
git add .
git commit -m "Résolution des conflits"
git push origin main
```

### "Fichiers non trackés"

```cmd
# Vérifier le .gitignore
type .gitignore

# Ajouter au .gitignore si nécessaire
echo frontend/.angular/ >> .gitignore
```

---

## ✅ Checklist avant chaque push

- [ ] `git status` - Vérifier les fichiers modifiés
- [ ] Pas de gros fichiers (`.angular/`, `node_modules/`, etc.)
- [ ] Le code compile sans erreur
- [ ] Message de commit descriptif
- [ ] `git push origin main`

---

## 🎓 Résumé

**Pour travailler au quotidien :**

1. **Début de journée** : `git pull origin main`
2. **Pendant le développement** : Modifie tes fichiers
3. **Sauvegarder** : `git add . && git commit -m "Description" && git push origin main`
4. **Fin de journée** : Push final

**OU simplement** : `PUSH_RAPIDE.bat` 🚀

---

**Dernière mise à jour** : 2024
