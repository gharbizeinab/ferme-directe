# ⚡ Fix Rapide : JDK isn't specified

## 🎯 Problème
```
java: JDK isn't specified for module 'FermeDirecte'
```

## ✅ Solution Rapide (IntelliJ IDEA)

### 1️⃣ Ouvrir Project Structure
**Raccourci :** `Ctrl + Alt + Shift + S`

**OU**

Menu : `File` → `Project Structure`

---

### 2️⃣ Configurer le SDK

Dans l'onglet **"Project"** :

1. **SDK :** Sélectionnez **JDK 17**
   
   **Si JDK 17 n'est pas dans la liste :**
   - Cliquez sur le menu déroulant
   - Cliquez sur **"Add SDK"** → **"Download JDK"**
   - Choisissez :
     - **Version :** `17`
     - **Vendor :** `Oracle OpenJDK` ou `Amazon Corretto`
   - Cliquez sur **"Download"**
   - Attendez le téléchargement

2. **Language level :** Sélectionnez **"17"**

3. Cliquez sur **"Apply"**

---

### 3️⃣ Recharger Maven

1. Clic droit sur `pom.xml`
2. **Maven** → **"Reload Project"**

**OU**

Cliquez sur l'icône 🔄 dans la vue Maven

---

### 4️⃣ Rebuild

Menu : `Build` → `Rebuild Project`

---

## ✅ Vérification

Essayez de compiler :

```bash
cd ferme-directe-complete/backend
mvn clean compile
```

**Résultat attendu :**
```
[INFO] BUILD SUCCESS
```

---

## 🆘 Ça ne marche toujours pas ?

Consultez le guide complet : **`CONFIGURATION_JDK.md`**

Ce guide contient :
- ✅ Instructions détaillées pour IntelliJ
- ✅ Comment installer Java 17
- ✅ Configuration de JAVA_HOME
- ✅ Solutions aux problèmes courants

---

## 📝 Résumé

| Étape | Action | Raccourci |
|-------|--------|-----------|
| 1 | Ouvrir Project Structure | `Ctrl+Alt+Shift+S` |
| 2 | SDK → JDK 17 | Télécharger si nécessaire |
| 3 | Recharger Maven | Clic droit sur pom.xml |
| 4 | Rebuild | `Build` → `Rebuild Project` |

---

## 🎉 C'est fait !

Vous pouvez maintenant :
- ✅ Compiler le projet
- ✅ Démarrer le backend
- ✅ Créer l'admin automatiquement

Retournez au guide : **`GUIDE_CONNEXION_ADMIN.md`** 🚀
