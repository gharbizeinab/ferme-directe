# ⚡ Fix Rapide : Erreurs de Compilation

## 🎯 Vos Erreurs

### 1. ❌ "JDK isn't specified for module 'FermeDirecte'"
**✅ RÉSOLU** - Vous avez déjà configuré JDK 23

### 2. ❌ "variable orderService not initialized in the default constructor"
**Cause :** Lombok n'est pas activé dans IntelliJ

---

## ✅ Solution Lombok (2 minutes)

### Étape 1 : Installer le plugin Lombok

1. `File` → `Settings` (ou `Ctrl+Alt+S`)
2. `Plugins`
3. Recherchez : **"Lombok"**
4. Si pas installé → **Install** → Redémarrez IntelliJ

### Étape 2 : Activer Annotation Processing

1. `File` → `Settings` (ou `Ctrl+Alt+S`)
2. `Build, Execution, Deployment` → `Compiler` → `Annotation Processors`
3. ✅ Cochez : **"Enable annotation processing"**
4. **Apply** → **OK**

### Étape 3 : Rebuild

`Build` → `Rebuild Project`

---

## 🚀 Après le Fix

Une fois les erreurs corrigées :

### 1. Démarrer le backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Vérifier les logs
Vous devriez voir :
```
✅ Utilisateur admin créé avec succès !
   📧 Email: admin@fermedirecte.com
   🔑 Mot de passe: Admin123!
```

### 3. Se connecter
- URL : http://localhost:4200
- Email : `admin@fermedirecte.com`
- Mot de passe : `Admin123!`

---

## 📋 Checklist Complète

- [x] JDK 23 configuré
- [x] Language level → 17
- [ ] Plugin Lombok installé
- [ ] Annotation Processing activé
- [ ] Projet rebuild sans erreur
- [ ] Backend démarré
- [ ] Admin créé automatiquement
- [ ] Connexion réussie

---

## 🆘 Si ça ne marche toujours pas

### Invalider les caches
1. `File` → `Invalidate Caches...`
2. Cochez "Clear file system cache and Local History"
3. **Invalidate and Restart**
4. Rebuild après redémarrage

### Vérifier Maven
```bash
cd backend
mvn clean install -DskipTests
```

Si ça compile en ligne de commande mais pas dans IntelliJ, c'est bien un problème de configuration IDE.

---

## 📚 Documentation

- **FIX_LOMBOK.md** - Guide détaillé Lombok
- **FIX_JDK_INTELLIJ.md** - Configuration JDK
- **GUIDE_CONNEXION_ADMIN.md** - Se connecter en admin

---

## 🎉 Résultat Final

Après ces corrections :
- ✅ Le projet compile
- ✅ Le backend démarre
- ✅ L'admin est créé automatiquement
- ✅ Vous pouvez vous connecter

Bon développement ! 🚀
