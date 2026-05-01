# 📍 Où Trouver les Coupons dans l'Interface ?

## 🎯 Accès Rapide

### Pour les ADMINS 👨‍💼

1. **Connectez-vous** avec un compte admin
2. **Regardez le menu de gauche**
3. **Section "TRANSACTIONS"**
4. **Cliquez sur "Coupons"** (icône 🏷️)

**URL directe :** `http://localhost:4200/admin/coupons`

---

### Pour les VENDEURS 🛒

1. **Connectez-vous** avec un compte vendeur
2. **Regardez le menu de gauche**
3. **Section "TRANSACTIONS"**
4. **Cliquez sur "Mes Coupons"** (icône 🎟️)

**URL directe :** `http://localhost:4200/seller/coupons`

---

## 📋 Menu de Navigation

```
┌─────────────────────────────────┐
│  FermeDirecte                   │
│  MARCHÉ AGRICOLE                │
├─────────────────────────────────┤
│                                 │
│  APERÇU                         │
│  📊 Tableau de bord             │
│  👥 Utilisateurs (Admin)        │
│                                 │
│  CATALOGUE                      │
│  📦 Produits                    │
│  🏷️  Catégories (Admin)         │
│                                 │
│  TRANSACTIONS                   │
│  📄 Commandes                   │
│  🏷️  Coupons (Admin)      ← ICI │
│  🎟️  Mes Coupons (Vendeur) ← ICI│
│                                 │
└─────────────────────────────────┘
```

---

## 🖼️ Aperçu de l'Interface

### Interface Admin

```
╔═══════════════════════════════════════════════════╗
║  Gestion des Coupons                              ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  [+ Nouveau Coupon]  [Filtrer: Tous ▼]          ║
║                                                   ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ BIENVENUE2024                               │ ║
║  │ -20% + -5 DT + Livraison offerte            │ ║
║  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ║
║  │ Utilisations: 15/100 | Expire: 30/05/2026  │ ║
║  │ [Modifier] [Bloquer] [Statistiques]         │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                   ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ PROMO15                                     │ ║
║  │ -15% sur tout le site                       │ ║
║  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ║
║  │ Utilisations: 42/200 | Expire: 30/06/2026  │ ║
║  │ [Modifier] [Bloquer] [Statistiques]         │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

### Interface Vendeur

```
╔═══════════════════════════════════════════════════╗
║  Mes Coupons                                      ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  [+ Créer un Coupon]                             ║
║                                                   ║
║  ┌─────────────────────────────────────────────┐ ║
║  │ VENDEUR10                                   │ ║
║  │ -10% sur mes produits                       │ ║
║  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ║
║  │ Utilisations: 8/50 | Actif: ✓               │ ║
║  │ [Modifier] [Désactiver] [Supprimer]         │ ║
║  └─────────────────────────────────────────────┘ ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

---

## 🎬 Démarrage Rapide

### 1. Démarrer le Backend
```bash
cd ferme-directe-complete/backend
mvn spring-boot:run
```

### 2. Démarrer le Frontend
```bash
cd ferme-directe-complete/frontend
ng serve
```

### 3. Ouvrir l'Application
```
http://localhost:4200
```

### 4. Se Connecter
- **Admin** : Utilisez votre compte admin
- **Vendeur** : Utilisez votre compte vendeur

### 5. Accéder aux Coupons
- Menu de gauche → **TRANSACTIONS** → **Coupons** (ou **Mes Coupons**)

---

## ✅ Vérification

### Si vous êtes ADMIN, vous devriez voir :
- ✅ Lien "Coupons" dans le menu
- ✅ Tous les coupons (globaux + vendeurs)
- ✅ Bouton "Nouveau Coupon"
- ✅ Boutons "Bloquer" sur chaque coupon

### Si vous êtes VENDEUR, vous devriez voir :
- ✅ Lien "Mes Coupons" dans le menu
- ✅ Uniquement vos coupons
- ✅ Bouton "Créer un Coupon"
- ✅ Boutons "Modifier" et "Supprimer"

### Si vous êtes CLIENT :
- ❌ Pas de lien "Coupons" dans le menu
- ✅ Vous pourrez appliquer des coupons au checkout (à venir)

---

## 🆘 Problèmes Courants

### Je ne vois pas le lien "Coupons"
**Cause :** Vous n'êtes pas connecté avec le bon rôle  
**Solution :** Connectez-vous avec un compte ADMIN ou SELLER

### Le lien est grisé ou désactivé
**Cause :** Les guards de route bloquent l'accès  
**Solution :** Vérifiez votre rôle dans le profil

### Erreur 404 sur `/admin/coupons`
**Cause :** Les routes ne sont pas configurées  
**Solution :** Vérifiez que `app.module.ts` a été modifié correctement

### La page est blanche
**Cause :** Le backend n'est pas démarré  
**Solution :** Démarrez le backend avec `mvn spring-boot:run`

---

## 📞 Aide Supplémentaire

- **Guide complet :** `INTEGRATION_FRONTEND_TERMINEE.md`
- **Tests :** `TEST_RAPIDE.md`
- **Documentation :** `INTEGRATION_COUPONS_HYBRIDES.md`

---

**Vous devriez maintenant voir les liens "Coupons" dans votre menu !** 🎉
