# 🔧 Configuration IntelliJ IDEA - Guide Complet

## 🎯 Problèmes à Résoudre

1. ❌ "JDK isn't specified for module 'FermeDirecte'"
2. ❌ "variable orderService not initialized in the default constructor"

---

## ✅ Solution 1 : Configurer le JDK et Language Level

### Étape 1 : Ouvrir Project Structure

**Raccourci :** `Ctrl + Alt + Shift + S`

**OU**

Menu : `File` → `Project Structure`

---

### Étape 2 : Configurer le Project

Dans l'onglet **"Project"** (à gauche) :

```
┌─────────────────────────────────────────┐
│ Project Structure                       │
├─────────────────────────────────────────┤
│ Project Settings                        │
│   ► Project          ← VOUS ÊTES ICI    │
│   ► Modules                             │
│   ► Libraries                           │
│   ► Facets                              │
│   ► Artifacts                           │
├─────────────────────────────────────────┤
│ Name: backend                           │
│                                         │
│ SDK: [23 Oracle OpenJDK 23.0.1    ▼]   │
│                                         │
│ Language level: [17 - Sealed types ▼]  │
│                 ↑                       │
│                 └─ CHANGEZ ICI !        │
└─────────────────────────────────────────┘
```

**Actions :**
1. **SDK :** Vérifiez que c'est bien votre JDK 23 ✅
2. **Language level :** Changez de "SDK default" à **"17 - Sealed types, always-strict floating-point semantics"**
3. Cliquez sur **"Apply"**

---

### Étape 3 : Vérifier les Modules (optionnel)

Dans l'onglet **"Modules"** :

1. Sélectionnez le module **"FermeDirecte"**
2. Vérifiez que "Language level" est **"17"** ou **"Project default"**
3. **Apply** → **OK**

---

### Étape 4 : Recharger Maven

1. Clic droit sur `pom.xml` dans l'arborescence du projet
2. **Maven** → **Reload Project**

**OU**

Cliquez sur l'icône 🔄 dans la vue Maven (panneau de droite)

---

## ✅ Solution 2 : Configurer Lombok

### Étape 1 : Installer le Plugin Lombok

1. Ouvrez les paramètres : `File` → `Settings` (ou `Ctrl+Alt+S`)

```
┌─────────────────────────────────────────┐
│ Settings                                │
├─────────────────────────────────────────┤
│ ► Appearance & Behavior                 │
│ ► Keymap                                │
│ ► Editor                                │
│ ► Plugins          ← CLIQUEZ ICI        │
│ ► Version Control                       │
│ ► Build, Execution, Deployment          │
└─────────────────────────────────────────┘
```

2. Dans l'onglet **"Marketplace"**, recherchez : **"Lombok"**

```
┌─────────────────────────────────────────┐
│ Plugins                                 │
├─────────────────────────────────────────┤
│ [Installed] [Marketplace]               │
│                                         │
│ 🔍 Search: Lombok                       │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 📦 Lombok                           │ │
│ │    by JetBrains                     │ │
│ │    [Install] ← CLIQUEZ ICI          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

3. Cliquez sur **"Install"**
4. **Redémarrez IntelliJ** après l'installation

---

### Étape 2 : Activer Annotation Processing

1. Ouvrez les paramètres : `File` → `Settings` (ou `Ctrl+Alt+S`)
2. Naviguez vers : `Build, Execution, Deployment` → `Compiler` → `Annotation Processors`

```
┌─────────────────────────────────────────┐
│ Settings                                │
├─────────────────────────────────────────┤
│ ► Build, Execution, Deployment          │
│   ► Build Tools                         │
│   ► Compiler                            │
│     ► Annotation Processors ← ICI       │
│     ► Java Compiler                     │
└─────────────────────────────────────────┘
```

3. **Cochez** la case : ✅ **"Enable annotation processing"**

```
┌─────────────────────────────────────────┐
│ Annotation Processors                   │
├─────────────────────────────────────────┤
│ ☑ Enable annotation processing          │
│   ↑                                     │
│   └─ COCHEZ CETTE CASE !                │
│                                         │
│ Store generated sources relative to:    │
│ ○ Module content root                   │
│ ● Module output directory               │
│                                         │
│ Production sources directory:           │
│ generated                               │
└─────────────────────────────────────────┘
```

4. Cliquez sur **"Apply"** puis **"OK"**

---

### Étape 3 : Rebuild le Projet

Menu : `Build` → `Rebuild Project`

Attendez la fin de la compilation (barre de progression en bas)

---

## ✅ Solution 3 : Si ça ne marche toujours pas

### Invalider les Caches

1. Menu : `File` → `Invalidate Caches...`
2. Cochez : ✅ **"Clear file system cache and Local History"**
3. Cliquez sur : **"Invalidate and Restart"**
4. Attendez le redémarrage d'IntelliJ
5. Rebuild le projet : `Build` → `Rebuild Project`

---

## 🧪 Vérification

### Test 1 : Compilation dans IntelliJ

`Build` → `Build Project`

**Résultat attendu :** Aucune erreur

### Test 2 : Compilation Maven

```bash
cd backend
mvn clean compile
```

**Résultat attendu :**
```
[INFO] BUILD SUCCESS
```

---

## 📋 Checklist Complète

### Configuration JDK
- [ ] Project Structure ouvert (`Ctrl+Alt+Shift+S`)
- [ ] SDK → JDK 23 sélectionné
- [ ] Language level → **17** sélectionné
- [ ] Apply → OK
- [ ] Maven rechargé

### Configuration Lombok
- [ ] Plugin Lombok installé
- [ ] IntelliJ redémarré
- [ ] Annotation Processing activé
- [ ] Apply → OK
- [ ] Projet rebuild

### Vérification
- [ ] Aucune erreur de compilation
- [ ] `mvn clean compile` fonctionne
- [ ] Prêt à démarrer le backend

---

## 🚀 Prochaine Étape

Une fois la configuration terminée, démarrez le backend :

```bash
cd backend
mvn spring-boot:run
```

**Vous devriez voir :**
```
✅ Utilisateur admin créé avec succès !
   📧 Email: admin@fermedirecte.com
   🔑 Mot de passe: Admin123!
```

Ensuite, connectez-vous sur http://localhost:4200 ! 🎉

---

## 📚 Documentation Complémentaire

- **FIX_JDK_INTELLIJ.md** - Configuration JDK détaillée
- **FIX_LOMBOK.md** - Configuration Lombok détaillée
- **FIX_ERREURS_COMPILATION.md** - Guide rapide des erreurs
- **GUIDE_CONNEXION_ADMIN.md** - Se connecter en admin

---

## 🎉 C'est Fait !

Votre IntelliJ est maintenant correctement configuré pour FermeDirecte ! 🚀
