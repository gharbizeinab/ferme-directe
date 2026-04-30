# ⚡ Fix : JDK isn't specified for module 'FermeDirecte'

## 🎯 Problème
```
java: JDK isn't specified for module 'FermeDirecte'
```

IntelliJ ne sait pas quel JDK utiliser pour compiler le projet.

## ✅ Solution Rapide (2 minutes)

### Étape 1 : Ouvrir Project Structure
**Raccourci :** `Ctrl + Alt + Shift + S`

**OU**

Menu : `File` → `Project Structure`

---

### Étape 2 : Configurer le SDK

Dans l'onglet **"Project"** :

1. **SDK :** Sélectionnez votre **JDK 23** (ou JDK 17+)
   - Si votre JDK n'apparaît pas dans la liste, cliquez sur "Add SDK" → "JDK"
   - Naviguez vers le dossier d'installation de votre JDK

2. **Language level :** Sélectionnez **"17"** (le projet utilise Java 17)

3. Cliquez sur **"Apply"**

---

### Étape 3 : Configurer le Module

Toujours dans "Project Structure", allez dans l'onglet **"Modules"** :

1. Sélectionnez le module **"FermeDirecte"**
2. Dans l'onglet "Sources", vérifiez que "Language level" est **"17"** ou **"Project default"**
3. Cliquez sur **"Apply"** puis **"OK"**

---

### Étape 4 : Recharger Maven

1. Clic droit sur `pom.xml`
2. **Maven** → **"Reload Project"**

**OU**

Cliquez sur l'icône 🔄 dans la vue Maven (à droite)

---

### Étape 5 : Rebuild (optionnel)

Menu : `Build` → `Rebuild Project`

---

## ✅ C'est fait !

Le projet devrait maintenant compiler sans erreur.

---

## 📝 Note Importante

Le projet est configuré pour **Java 17** dans le `pom.xml`, mais il fonctionne parfaitement avec **JDK 23** car Java est rétrocompatible.

Vous pouvez continuer à utiliser votre JDK 23 sans problème ! 👍

---

## 🐛 Si ça ne marche toujours pas

### Vérifier la configuration Maven

1. `File` → `Settings` (ou `Ctrl+Alt+S`)
2. `Build, Execution, Deployment` → `Build Tools` → `Maven` → `Runner`
3. Dans "JRE", sélectionnez votre **JDK 23**
4. Apply → OK

### Invalider les caches

1. `File` → `Invalidate Caches...`
2. Cochez "Clear file system cache and Local History"
3. Cliquez sur "Invalidate and Restart"

---

## 🎉 Résultat

- ✅ IntelliJ sait quel JDK utiliser
- ✅ Le projet compile
- ✅ Vous pouvez démarrer le backend
- ✅ L'admin sera créé automatiquement

Retournez au guide : **`GUIDE_CONNEXION_ADMIN.md`** 🚀
