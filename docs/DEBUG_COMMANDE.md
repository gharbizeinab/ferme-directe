# Guide de débogage - Erreur de commande

## Étape 1 : Vérifier que le backend a bien été redémarré

**IMPORTANT** : Les modifications du code Java ne prennent effet que si vous redémarrez le serveur backend.

### Comment redémarrer le backend :

1. **Arrêtez le serveur actuel** :
   - Trouvez le terminal où le backend tourne
   - Appuyez sur `Ctrl + C` pour arrêter le serveur

2. **Recompilez et redémarrez** :
   ```bash
   cd ferme-directe-complete/backend
   mvn clean package -DskipTests
   mvn spring-boot:run
   ```

3. **Attendez le message** : `Started FermeDirecte in X seconds`

## Étape 2 : Vérifier l'erreur exacte dans la console du navigateur

1. Ouvrez l'application dans le navigateur (http://localhost:4200)
2. Ouvrez la console du navigateur :
   - **Chrome/Edge** : Appuyez sur `F12` ou `Ctrl + Shift + I`
   - Allez dans l'onglet "Console"
   - Allez aussi dans l'onglet "Network" (Réseau)

3. Essayez de passer une commande

4. Dans l'onglet "Network" :
   - Cherchez la requête `POST` vers `/api/orders`
   - Cliquez dessus
   - Regardez la réponse dans l'onglet "Response"
   - **Copiez l'erreur complète** et envoyez-la moi

## Étape 3 : Vérifier les logs du backend

Dans le terminal où le backend tourne, vous devriez voir l'erreur complète.

**Cherchez des lignes comme** :
```
ERROR ... : ...
Exception in thread ...
Caused by: ...
```

**Copiez toute la trace d'erreur** (stack trace) et envoyez-la moi.

## Étape 4 : Vérifier la structure de la base de données

1. Ouvrez phpMyAdmin : http://localhost/phpmyadmin
2. Sélectionnez la base `fermedirecte`
3. Cliquez sur la table `addresses`
4. Allez dans l'onglet "Structure"

**Vérifiez que ces colonnes existent** :
- ✅ id
- ✅ user_id
- ✅ rue
- ✅ ville
- ✅ code_postal
- ✅ pays
- ✅ prenom
- ✅ nom
- ✅ gouvernorat
- ✅ telephone
- ✅ instructions
- ✅ principal

**Si une colonne manque**, exécutez ce SQL dans l'onglet "SQL" :
```sql
ALTER TABLE addresses ADD COLUMN prenom VARCHAR(255);
ALTER TABLE addresses ADD COLUMN nom VARCHAR(255);
ALTER TABLE addresses ADD COLUMN gouvernorat VARCHAR(255);
ALTER TABLE addresses ADD COLUMN telephone VARCHAR(255);
ALTER TABLE addresses ADD COLUMN instructions TEXT;
```

## Étape 5 : Vérifier les données envoyées

Dans la console du navigateur (onglet Network), vérifiez la requête envoyée :

**Payload attendu** :
```json
{
  "adresse": {
    "prenom": "Zeinab",
    "nom": "Gharbi",
    "rue": "sfax palmariome",
    "ville": "Sfax",
    "codePostal": "3031",
    "pays": "Tunisie",
    "gouvernorat": "",
    "telephone": "",
    "instructions": ""
  },
  "modePaiement": "ESPECES",
  "notes": ""
}
```

## Erreurs courantes et solutions

### Erreur : "Column 'prenom' not found"
**Solution** : Exécutez le script SQL dans phpMyAdmin (voir Étape 4)

### Erreur : "object references an unsaved transient instance"
**Solution** : Le backend n'a pas été redémarré. Redémarrez-le (voir Étape 1)

### Erreur : "Connection refused" ou "Unable to connect to database"
**Solution** : 
- Vérifiez que MySQL est démarré dans XAMPP
- Vérifiez que la base `fermedirecte` existe

### Erreur : "Panier vide"
**Solution** : Ajoutez des produits au panier avant de passer commande

### Erreur : "Stock insuffisant"
**Solution** : Vérifiez que les produits ont du stock dans la base de données

## Que faire ensuite ?

**Envoyez-moi** :
1. ✅ La réponse complète de l'API (onglet Network > Response)
2. ✅ Les logs du backend (terminal)
3. ✅ Une capture d'écran de la structure de la table `addresses` dans phpMyAdmin

Avec ces informations, je pourrai identifier le problème exact !
