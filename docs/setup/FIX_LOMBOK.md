# 🔧 Fix : variable not initialized in the default constructor

## 🎯 Problème
```
java: variable orderService not initialized in the default constructor
```

Cette erreur signifie que **Lombok n'est pas activé** dans IntelliJ IDEA.

Lombok génère automatiquement les constructeurs avec `@RequiredArgsConstructor`, mais IntelliJ ne le voit pas.

---

## ✅ Solution (3 étapes)

### Étape 1 : Installer le plugin Lombok

1. Ouvrez les paramètres : `File` → `Settings` (ou `Ctrl+Alt+S`)
2. Allez dans : `Plugins`
3. Dans la barre de recherche, tapez : **"Lombok"**
4. Si le plugin **"Lombok"** n'est pas installé :
   - Cliquez sur **"Install"**
   - Redémarrez IntelliJ après l'installation

---

### Étape 2 : Activer l'Annotation Processing

1. Toujours dans les paramètres : `File` → `Settings` (ou `Ctrl+Alt+S`)
2. Allez dans : `Build, Execution, Deployment` → `Compiler` → `Annotation Processors`
3. **Cochez** la case : **"Enable annotation processing"**
4. Cliquez sur **"Apply"** puis **"OK"**

---

### Étape 3 : Rebuild le projet

1. Menu : `Build` → `Rebuild Project`
2. Attendez la fin de la compilation

---

## ✅ Vérification

L'erreur devrait disparaître. Si elle persiste :

### Solution alternative : Invalider les caches

1. Menu : `File` → `Invalidate Caches...`
2. Cochez **"Clear file system cache and Local History"**
3. Cliquez sur **"Invalidate and Restart"**
4. Attendez le redémarrage d'IntelliJ
5. Rebuild le projet : `Build` → `Rebuild Project`

---

## 🔍 Pourquoi cette erreur ?

Le projet utilise **Lombok** pour générer automatiquement du code :

- `@RequiredArgsConstructor` → Génère un constructeur avec tous les champs `final`
- `@Getter` / `@Setter` → Génère les getters/setters
- `@Builder` → Génère un builder pattern
- `@Slf4j` → Génère un logger

Sans le plugin Lombok et l'annotation processing activé, IntelliJ ne voit pas ce code généré et affiche des erreurs.

---

## 📋 Checklist

- [ ] Plugin Lombok installé
- [ ] Annotation Processing activé
- [ ] Projet rebuild
- [ ] Erreur disparue

---

## 🎉 C'est fait !

Votre projet devrait maintenant compiler sans erreur ! 🚀

Vous pouvez maintenant démarrer le backend et créer l'admin automatiquement.
