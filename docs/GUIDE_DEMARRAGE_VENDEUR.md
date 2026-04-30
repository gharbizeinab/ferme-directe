# Guide de Démarrage Rapide - Tableau de Bord Vendeur

## 🚀 Démarrage Rapide

### Prérequis
- Backend Spring Boot démarré (port 8080)
- Frontend Angular démarré (port 4200)
- Base de données PostgreSQL configurée

### Étape 1 : Créer des Données de Test

Exécutez le script SQL de test :

```bash
psql -U votre_utilisateur -d ferme_directe -f backend/TEST_SELLER_DASHBOARD.sql
```

Ou copiez-collez le contenu du fichier `TEST_SELLER_DASHBOARD.sql` dans votre client PostgreSQL.

### Étape 2 : Se Connecter

1. Ouvrez votre navigateur : `http://localhost:4200`
2. Cliquez sur "Connexion"
3. Utilisez les identifiants de test :
   - **Email** : `vendeur@test.com`
   - **Mot de passe** : (celui que vous avez défini lors de l'inscription)

### Étape 3 : Accéder au Tableau de Bord

1. Une fois connecté, cliquez sur "Tableau de bord" dans le menu
2. Vous devriez voir :
   - ✅ 4 cartes de statistiques en haut
   - ✅ Un graphique des revenus sur 7 jours
   - ✅ La liste des commandes récentes
   - ✅ Les produits en stock faible
   - ✅ Les statistiques détaillées des commandes
   - ✅ Les boutons d'actions rapides

---

## 📊 Que Voir sur le Tableau de Bord ?

### Statistiques Principales

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  📦 Produits    │  📋 Commandes   │  💰 Revenus     │  ⚠️ Stock       │
│      4          │      1          │   ~300 DT       │      2          │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### Graphique des Revenus

Un graphique en barres montrant les revenus des 7 derniers jours :

```
    │
200 │     ▓▓▓
    │     ▓▓▓
150 │ ▓▓▓ ▓▓▓ ▓▓▓
    │ ▓▓▓ ▓▓▓ ▓▓▓
100 │ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓
    │ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓
 50 │ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓
    │ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓ ▓▓▓
  0 └─────────────────────────────
      Lun Mar Mer Jeu Ven Sam Dim
```

### Commandes Récentes

| N° Commande | Montant | Statut | Date |
|------------|---------|--------|------|
| CMD-00000001 | 55.00 DT | 🟠 En attente | 30/04/2026 |
| CMD-00000002 | 75.50 DT | 🔵 Confirmé | 29/04/2026 |
| CMD-00000003 | 115.00 DT | 🟣 En livraison | 28/04/2026 |
| CMD-00000004 | 100.00 DT | 🟢 Livré | 27/04/2026 |
| CMD-00000005 | 65.00 DT | 🔴 Annulé | 26/04/2026 |

### Produits en Stock Faible

```
┌────────────────────────────────────────────────┐
│ Pommes de Terre                    🔴 3 unités │
│ 2.50 DT                                        │
├────────────────────────────────────────────────┤
│ Carottes Bio                       🟠 8 unités │
│ 3.20 DT                                        │
└────────────────────────────────────────────────┘
```

### Statistiques des Commandes

```
┌─────────┬───────────┬───────────┬─────────────┬─────────┬──────────┐
│  Total  │ En attente│ Confirmées│ En livraison│ Livrées │ Annulées │
│    5    │     1     │     1     │      1      │    1    │    1     │
└─────────┴───────────┴───────────┴─────────────┴─────────┴──────────┘
```

---

## 🎯 Actions Disponibles

### 1. Ajouter un Nouveau Produit
Cliquez sur le bouton "➕ Ajouter un nouveau produit" pour créer un nouveau produit.

### 2. Gérer les Produits
Cliquez sur "📦 Voir mes produits" pour :
- Modifier les produits existants
- Mettre à jour les stocks
- Désactiver des produits

### 3. Gérer les Commandes
Cliquez sur "📋 Gérer mes commandes" pour :
- Voir toutes les commandes
- Changer le statut des commandes
- Voir les détails de chaque commande

---

## 🔍 Vérification du Bon Fonctionnement

### Checklist de Vérification

- [ ] Les 4 cartes de statistiques affichent des valeurs correctes
- [ ] Le graphique des revenus s'affiche avec des barres
- [ ] Les commandes récentes sont listées (5 maximum)
- [ ] Les produits en stock faible sont affichés (2 produits)
- [ ] Les statistiques des commandes montrent la répartition par statut
- [ ] Les boutons d'actions rapides sont cliquables
- [ ] La navigation vers les autres pages fonctionne

### Valeurs Attendues (avec les données de test)

| Statistique | Valeur Attendue |
|------------|-----------------|
| Total Produits | 4 |
| Commandes en Attente | 1 |
| Revenu Total | ~300 DT |
| Produits Stock Faible | 2 |
| Total Commandes | 5 |

---

## 🐛 Dépannage

### Problème : Les statistiques affichent 0

**Solution** :
1. Vérifiez que le script SQL a été exécuté correctement
2. Vérifiez que vous êtes connecté avec le bon compte vendeur
3. Vérifiez les logs du backend pour les erreurs

### Problème : Le graphique ne s'affiche pas

**Solution** :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les erreurs JavaScript
3. Vérifiez que les données `revenusParJour` sont bien reçues de l'API

### Problème : Erreur 403 (Forbidden)

**Solution** :
1. Vérifiez que votre token JWT est valide
2. Vérifiez que votre compte a le rôle `SELLER`
3. Reconnectez-vous si nécessaire

### Problème : Les commandes ne s'affichent pas

**Solution** :
1. Vérifiez que les commandes contiennent bien des produits du vendeur
2. Vérifiez la table `order_items` dans la base de données
3. Vérifiez les logs du backend

---

## 📱 Test sur Mobile

1. Ouvrez le navigateur sur votre mobile
2. Accédez à `http://votre-ip:4200`
3. Connectez-vous avec le compte vendeur
4. Vérifiez que :
   - Les cartes de stats sont en grille 2x2
   - Le graphique est scrollable horizontalement
   - Les tableaux sont scrollables
   - Les boutons sont facilement cliquables

---

## 🔐 Sécurité

### Points de Sécurité Vérifiés

✅ **Authentification** : Token JWT requis pour accéder au dashboard
✅ **Autorisation** : Seuls les utilisateurs avec rôle `SELLER` ou `ADMIN` peuvent accéder
✅ **Isolation** : Chaque vendeur ne voit que ses propres données
✅ **Validation** : Toutes les données sont validées côté backend

---

## 📚 Ressources Supplémentaires

- **Documentation complète** : `TABLEAU_BORD_VENDEUR.md`
- **Script de test** : `backend/TEST_SELLER_DASHBOARD.sql`
- **Code source backend** : `backend/src/main/java/com/FermeDirecte/FermeDirecte/`
- **Code source frontend** : `frontend/src/app/components/dashboard/`

---

## 💡 Conseils d'Utilisation

1. **Consultez le tableau de bord quotidiennement** pour suivre vos ventes
2. **Surveillez les produits en stock faible** pour éviter les ruptures
3. **Traitez rapidement les commandes en attente** pour satisfaire vos clients
4. **Analysez le graphique des revenus** pour identifier les tendances
5. **Utilisez les actions rapides** pour gagner du temps

---

## 🎉 Félicitations !

Votre tableau de bord vendeur est maintenant opérationnel ! Vous pouvez :
- ✅ Suivre vos ventes en temps réel
- ✅ Gérer vos produits efficacement
- ✅ Traiter vos commandes rapidement
- ✅ Analyser vos performances

**Bon commerce ! 🚀**
