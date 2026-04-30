# ☕ Configuration du JDK pour FermeDirecte

## 🎯 Problème
```
java: JDK isn't specified for module 'FermeDirecte'
```

Ce message indique que votre IDE ne sait pas quelle version de Java utiliser.

## 📋 Prérequis

Le projet FermeDirecte nécessite **Java 17** (JDK 17).

---

## ✅ Solution 1 : Configuration IntelliJ IDEA (Recommandé)

### Étape 1 : Vérifier si Java 17 est installé

1. Ouvrez un terminal
2. Tapez :
```bash
java -version
```

**Résultat attendu :**
```
java version "17.0.x"
```

Si vous n'avez pas Java 17, passez à l'étape "Installer Java 17" ci-dessous.

### Étape 2 : Configurer le JDK dans IntelliJ

#### A. Ouvrir les paramètres du projet

**Méthode 1 :**
- Menu : `File` → `Project Structure` (ou `Ctrl+Alt+Shift+S`)

**Méthode 2 :**
- Clic droit sur le projet → `Open Module Settings`

#### B. Configurer le Project SDK

1. Dans la fenêtre "Project Structure"
2. Allez dans l'onglet **"Project"**
3. Dans "SDK", sélectionnez **JDK 17**
   - Si JDK 17 n'apparaît pas, cliquez sur "Add SDK" → "Download JDK"
   - Choisissez **Version 17**, **Vendor : Oracle OpenJDK** ou **Amazon Corretto**
   - Cliquez sur "Download"

4. Dans "Language level", sélectionnez **"17 - Sealed types, always-strict floating-point semantics"**

5. Cliquez sur **"Apply"** puis **"OK"**

#### C. Configurer les Modules

1. Toujours dans "Project Structure"
2. Allez dans l'onglet **"Modules"**
3. Sélectionnez le module **"FermeDirecte"**
4. Dans l'onglet "Sources", vérifiez que "Language level" est **"17"**
5. Cliquez sur **"Apply"** puis **"OK"**

#### D. Configurer Maven

1. Ouvrez les paramètres : `File` → `Settings` (ou `Ctrl+Alt+S`)
2. Allez dans : `Build, Execution, Deployment` → `Build Tools` → `Maven` → `Runner`
3. Dans "JRE", sélectionnez **JDK 17**
4. Cliquez sur **"Apply"** puis **"OK"**

### Étape 3 : Recharger le projet Maven

1. Ouvrez la vue Maven (clic droit sur `pom.xml`)
2. Cliquez sur **"Maven"** → **"Reload Project"**
   
   **OU**
   
   Cliquez sur l'icône de rechargement Maven (🔄) dans la barre d'outils Maven

### Étape 4 : Rebuild le projet

1. Menu : `Build` → `Rebuild Project`
2. Attendez la fin de la compilation

---

## ✅ Solution 2 : Installer Java 17 (si non installé)

### Option A : Télécharger Oracle JDK 17

1. Allez sur : https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
2. Téléchargez **JDK 17** pour Windows
3. Installez le JDK
4. Retournez à la Solution 1, Étape 2

### Option B : Télécharger Amazon Corretto 17 (Recommandé)

1. Allez sur : https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html
2. Téléchargez **Amazon Corretto 17** pour Windows (MSI installer)
3. Installez le JDK
4. Retournez à la Solution 1, Étape 2

### Option C : Via IntelliJ (Plus simple)

1. Dans IntelliJ : `File` → `Project Structure`
2. Onglet "Project" → "SDK" → "Add SDK" → "Download JDK"
3. Choisissez :
   - **Version :** 17
   - **Vendor :** Oracle OpenJDK ou Amazon Corretto
4. Cliquez sur "Download"
5. IntelliJ téléchargera et configurera automatiquement le JDK

---

## ✅ Solution 3 : Configuration via ligne de commande

Si vous préférez utiliser Maven en ligne de commande :

### Vérifier la version Java utilisée par Maven

```bash
mvn -version
```

**Résultat attendu :**
```
Apache Maven 3.x.x
Maven home: ...
Java version: 17.0.x, vendor: ...
```

### Si Maven utilise une mauvaise version de Java

#### Windows

1. Définir la variable d'environnement `JAVA_HOME` :

```cmd
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
```

2. Redémarrez votre terminal
3. Vérifiez : `mvn -version`

#### Ou utiliser un script temporaire

Créez un fichier `SET_JAVA_17.bat` :

```batch
@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
echo Java 17 configuré pour cette session
java -version
```

Exécutez-le avant de lancer Maven.

---

## ✅ Solution 4 : Vérifier le fichier pom.xml

Le fichier `pom.xml` doit contenir :

```xml
<properties>
    <java.version>17</java.version>
</properties>
```

Et dans le plugin Maven Compiler :

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <source>17</source>
        <target>17</target>
    </configuration>
</plugin>
```

Ces configurations sont déjà présentes dans le projet.

---

## 🧪 Vérification finale

### Test 1 : Compiler le projet

```bash
cd ferme-directe-complete/backend
mvn clean compile
```

**Résultat attendu :**
```
[INFO] BUILD SUCCESS
```

### Test 2 : Lancer l'application

```bash
mvn spring-boot:run
```

**Résultat attendu :**
```
✅ Utilisateur admin créé avec succès !
   📧 Email: admin@fermedirecte.com
   🔑 Mot de passe: Admin123!
```

---

## 🐛 Problèmes courants

### ❌ "Error: JAVA_HOME is not defined correctly"

**Solution :**
1. Vérifiez que `JAVA_HOME` pointe vers le JDK 17
2. Redémarrez votre terminal/IDE

### ❌ "Unsupported class file major version 61"

**Cause :** Vous essayez d'exécuter du code Java 17 avec une version plus ancienne.

**Solution :**
1. Installez Java 17
2. Configurez `JAVA_HOME` correctement

### ❌ IntelliJ ne trouve pas le JDK

**Solution :**
1. `File` → `Project Structure` → `SDKs`
2. Cliquez sur "+" → "Add JDK"
3. Naviguez vers le dossier d'installation de Java 17
   - Exemple : `C:\Program Files\Java\jdk-17`

---

## 📚 Ressources

- [Oracle JDK 17 Downloads](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Amazon Corretto 17 Downloads](https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads-list.html)
- [IntelliJ IDEA - Configure JDK](https://www.jetbrains.com/help/idea/sdk.html)

---

## 🎉 Résultat

Après avoir suivi ces étapes :
- ✅ Le JDK 17 est configuré
- ✅ Le projet compile sans erreur
- ✅ Vous pouvez démarrer l'application
- ✅ L'admin est créé automatiquement

Vous êtes prêt à développer ! 🚀
