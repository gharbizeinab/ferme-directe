# 🚀 Guide Rapide - Correction du Système de Coupons

## ⚡ En 3 Étapes Simples

### Étape 1️⃣ : Exécuter le Script SQL (2 minutes)

1. **Ouvrir phpMyAdmin** dans votre navigateur
2. **Sélectionner** la base de données `fermedirecte`
3. **Cliquer** sur l'onglet **SQL**
4. **Ouvrir** le fichier `backend/sql/AJOUTER_COLONNE_REMISE.sql`
5. **Copier** tout le contenu
6. **Coller** dans phpMyAdmin
7. **Cliquer** sur **Exécuter**

✅ **Vérification** : Vous devriez voir "1 ligne affectée" ou "Query OK"

---

### Étape 2️⃣ : Redémarrer le Backend (3 minutes)

#### Option A : Script Automatique (Recommandé)
1. **Double-cliquer** sur `APPLIQUER_CORRECTIONS_COUPON.bat`
2. **Suivre** les instructions à l'écran

#### Option B : Manuel
```bash
# 1. Arrêter le backend (Ctrl+C dans son terminal)

# 2. Aller dans le dossier backend
cd backend

# 3. Recompiler
mvn clean compile

# 4. Redémarrer
mvn spring-boot:run

# 5. Attendre "Started FermeDirecteApplication"
```

---

### Étape 3️⃣ : Tester (2 minutes)

1. **Rafraîchir** le navigateur (F5)
2. **Aller** au checkout avec des produits dans le panier
3. **Vérifier** que les frais de livraison s'affichent (5.00 DT)
4. **Appliquer** un coupon (TEST1 ou TEST2)
5. **Vérifier** que la réduction s'applique correctement
6. **Confirmer** la commande
7. **Vérifier** que le total est correct

---

## 🎯 Résultat Attendu

### Avant la Correction ❌
```
Sous-total:        21.45 DT
Réduction:         -2.15 DT
Livraison:       Gratuite  ← FAUX
─────────────────────────
Total:              5.86 DT  ← INCORRECT (devrait être 24.30)
```

### Après la Correction ✅
```
Sous-total:        21.45 DT
Réduction:         -2.15 DT
Livraison:          5.00 DT  ← CORRECT
─────────────────────────
Total:             24.30 DT  ← CORRECT
```

---

## 🐛 Problèmes Courants

### Le backend ne démarre pas
**Solution** : Vérifier que le port 8080 n'est pas déjà utilisé

### Erreur SQL "Column already exists"
**Solution** : La colonne existe déjà, passez à l'étape 2

### Le total est toujours incorrect
**Solution** : 
1. Vérifier que le script SQL a été exécuté
2. Vérifier que le backend a été redémarré
3. Vider le cache du navigateur (Ctrl+Shift+R)

---

## 📞 Besoin d'Aide ?

Consultez les fichiers de documentation :
- `CORRECTION_FINALE_COUPON.md` - Guide complet
- `SOLUTION_FINALE_COUPON.md` - Diagnostic des problèmes
- `backend/sql/AJOUTER_COLONNE_REMISE.sql` - Script SQL

---

**Temps total estimé : 7 minutes**  
**Difficulté : Facile** 🟢
