# 👋 COMMENCEZ ICI - Correction du Système de Coupons

## 🎯 Vous êtes au bon endroit !

Votre système de coupons fonctionne, mais le **total de la commande est incorrect**. 

**Exemple** : La commande devrait coûter **0.86 DT** mais affiche **5.86 DT**.

## ⚡ Solution Rapide (7 minutes)

### Étape 1 : Exécuter le Script SQL

1. Ouvrez **phpMyAdmin**
2. Sélectionnez la base **fermedirecte**
3. Cliquez sur **SQL**
4. Ouvrez le fichier : `backend/sql/AJOUTER_COLONNE_REMISE.sql`
5. Copiez tout le contenu
6. Collez dans phpMyAdmin
7. Cliquez sur **Exécuter**

### Étape 2 : Redémarrer le Backend

**Option A - Script automatique** (recommandé) :
- Double-cliquez sur `APPLIQUER_CORRECTIONS_COUPON.bat`

**Option B - Manuel** :
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

### Étape 3 : Tester

1. Rafraîchissez le navigateur (F5)
2. Allez au checkout
3. Appliquez un coupon
4. Vérifiez que le total est correct

## 📚 Documentation Disponible

| Fichier | Quand l'utiliser |
|---------|------------------|
| **GUIDE_RAPIDE_CORRECTION.md** | Pour appliquer les corrections rapidement |
| **CORRECTION_FINALE_COUPON.md** | Pour comprendre en détail les modifications |
| **SOLUTION_FINALE_COUPON.md** | Pour diagnostiquer d'autres problèmes |
| **RESUME_CORRECTIONS.txt** | Pour un aperçu textuel complet |

## 🆘 Besoin d'Aide ?

### Le backend ne démarre pas
→ Vérifiez que le port 8080 n'est pas déjà utilisé

### Le total est toujours incorrect
→ Vérifiez que :
1. Le script SQL a été exécuté
2. Le backend a été redémarré
3. Le navigateur a été rafraîchi (F5)

### Erreur SQL "Column already exists"
→ La colonne existe déjà, passez directement à l'étape 2

## ✅ Résultat Attendu

Après les corrections :

```
Sous-total:        21.45 DT
Réduction (10%):   -2.15 DT
Livraison:          5.00 DT
─────────────────────────
Total:             24.30 DT  ✅ CORRECT
```

## 🎊 C'est Tout !

Une fois ces 3 étapes terminées, votre système de coupons fonctionnera parfaitement.

---

**Temps estimé** : 7 minutes  
**Difficulté** : Facile 🟢  
**Prérequis** : phpMyAdmin, Maven, Backend arrêté
