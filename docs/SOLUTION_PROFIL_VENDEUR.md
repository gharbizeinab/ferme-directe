# 🔧 Solution : Erreur "Profil vendeur introuvable"

## 🐛 Problème

Lors de la création d'un produit, l'erreur suivante apparaît :
```
Profil vendeur introuvable
```

## 🔍 Cause

Cette erreur se produit dans les cas suivants :

1. **Utilisateur ADMIN sans profil vendeur**
   - Les ADMIN peuvent créer des produits (`@PreAuthorize("hasAnyRole('SELLER','ADMIN')")`)
   - Mais l'ancien code ne créait pas automatiquement de profil vendeur pour les ADMIN
   - Seuls les SELLER avaient un profil vendeur créé automatiquement

2. **Utilisateur créé avant la mise à jour**
   - Si un compte ADMIN ou SELLER a été créé avant cette correction
   - Le profil vendeur n'a pas été créé automatiquement

3. **Données de test incomplètes**
   - Scripts SQL qui créent des utilisateurs sans profils vendeurs

## ✅ Solutions implémentées

### 1. Création automatique lors de l'inscription (AuthService)

**Fichier modifié :** `AuthService.java`

```java
// Maintenant, les ADMIN et SELLER reçoivent automatiquement un profil vendeur
if (request.getRole() == Role.SELLER || request.getRole() == Role.ADMIN) {
    String nomBoutique = request.getRole() == Role.ADMIN 
        ? "Administration FermeDirecte" 
        : request.getPrenom() + " " + request.getNom();
    
    SellerProfile sellerProfile = SellerProfile.builder()
            .user(user)
            .nomBoutique(nomBoutique)
            .description(request.getRole() == Role.ADMIN 
                ? "Boutique officielle de l'administration" 
                : "Bienvenue dans ma boutique !")
            .note(0.0)
            .build();
    
    sellerProfileRepository.save(sellerProfile);
    user.setSellerProfile(sellerProfile);
}
```

### 2. Création automatique lors de la création de produit (ProductService)

**Fichier modifié :** `ProductService.java`

```java
// Si l'utilisateur n'a pas de profil vendeur, le créer automatiquement
if (seller == null) {
    // Vérifier que l'utilisateur a le droit de vendre
    if (user.getRole() != Role.SELLER && user.getRole() != Role.ADMIN) {
        throw new BadRequestException("Seuls les vendeurs et administrateurs peuvent créer des produits");
    }
    
    // Créer le profil vendeur automatiquement
    String nomBoutique = user.getRole() == Role.ADMIN 
        ? "Administration FermeDirecte" 
        : user.getPrenom() + " " + user.getNom();
    
    seller = SellerProfile.builder()
            .user(user)
            .nomBoutique(nomBoutique)
            .description(user.getRole() == Role.ADMIN 
                ? "Boutique officielle de l'administration" 
                : "Bienvenue dans ma boutique !")
            .note(0.0)
            .build();
    
    seller = sellerProfileRepository.save(seller);
    user.setSellerProfile(seller);
    userRepository.save(user);
}
```

### 3. Script SQL de correction pour les comptes existants

**Fichier créé :** `FIX_SELLER_PROFILES.sql`

Ce script :
- ✅ Identifie les utilisateurs ADMIN/SELLER sans profil vendeur
- ✅ Crée automatiquement les profils manquants
- ✅ Est idempotent (peut être exécuté plusieurs fois sans créer de doublons)

## 🚀 Comment appliquer la correction

### Option 1 : Pour les nouveaux utilisateurs (automatique)

Rien à faire ! Les nouveaux utilisateurs ADMIN et SELLER recevront automatiquement un profil vendeur lors de l'inscription.

### Option 2 : Pour les utilisateurs existants (automatique)

Rien à faire ! Lors de la première tentative de création de produit, le profil vendeur sera créé automatiquement.

### Option 3 : Correction manuelle via SQL (optionnel)

Si vous voulez corriger tous les comptes existants en une seule fois :

```bash
# Se connecter à la base de données
mysql -u root -p ferme_directe

# Exécuter le script de correction
source FIX_SELLER_PROFILES.sql
```

## 🧪 Vérification

### 1. Vérifier les profils vendeurs existants

```sql
SELECT 
    u.id,
    u.email,
    u.role,
    sp.nom_boutique,
    CASE 
        WHEN sp.id IS NULL THEN '❌ MANQUANT'
        ELSE '✅ OK'
    END AS statut
FROM users u
LEFT JOIN seller_profiles sp ON u.id = sp.user_id
WHERE u.role IN ('SELLER', 'ADMIN')
ORDER BY u.role, u.id;
```

### 2. Tester la création de produit

1. Se connecter en tant qu'ADMIN
2. Aller sur "Gestion des Produits"
3. Cliquer sur "Nouveau produit"
4. Remplir le formulaire
5. Cliquer sur "Créer"

**Résultat attendu :** ✅ Le produit est créé avec succès

## 📊 Statistiques

Après correction, vous devriez voir :

```
+--------+--------------------+-------------+-------------+
| role   | total_utilisateurs | avec_profil | sans_profil |
+--------+--------------------+-------------+-------------+
| ADMIN  |                  1 |           1 |           0 |
| SELLER |                  5 |           5 |           0 |
+--------+--------------------+-------------+-------------+
```

## 🔐 Sécurité

Les modifications respectent les règles de sécurité :

- ✅ Seuls les ADMIN et SELLER peuvent créer des produits
- ✅ Les CUSTOMER ne peuvent pas créer de profil vendeur
- ✅ Validation du rôle avant création du profil
- ✅ Transaction atomique (rollback en cas d'erreur)

## 📝 Modifications apportées

### Fichiers modifiés :

1. **AuthService.java**
   - Ajout de la création automatique de profil vendeur pour ADMIN
   - Ligne 58-73

2. **ProductService.java**
   - Ajout de l'import `Role` et `SellerProfileRepository`
   - Création automatique du profil vendeur si manquant
   - Ligne 50-82

### Fichiers créés :

1. **FIX_SELLER_PROFILES.sql**
   - Script de correction pour les comptes existants

2. **SOLUTION_PROFIL_VENDEUR.md**
   - Ce document

## 🎯 Prochaines étapes

1. ✅ Redémarrer le backend
2. ✅ Tester la création de produit en tant qu'ADMIN
3. ✅ (Optionnel) Exécuter le script SQL pour corriger les comptes existants
4. ✅ Vérifier que tous les ADMIN/SELLER ont un profil vendeur

## ❓ FAQ

### Q : Pourquoi les ADMIN ont-ils besoin d'un profil vendeur ?

**R :** Le code autorise les ADMIN à créer des produits (`@PreAuthorize("hasAnyRole('SELLER','ADMIN')")`). Pour créer un produit, il faut un profil vendeur car chaque produit est lié à un vendeur. Les ADMIN peuvent ainsi créer des produits "officiels" ou de démonstration.

### Q : Que se passe-t-il si je supprime un profil vendeur ?

**R :** Si vous supprimez un profil vendeur, tous les produits associés seront également supprimés (cascade). Il sera recréé automatiquement lors de la prochaine tentative de création de produit.

### Q : Puis-je personnaliser le nom de la boutique admin ?

**R :** Oui ! Vous pouvez modifier le profil vendeur directement dans la base de données :

```sql
UPDATE seller_profiles 
SET nom_boutique = 'Mon nom personnalisé',
    description = 'Ma description personnalisée'
WHERE user_id = (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1);
```

### Q : Les CUSTOMER peuvent-ils avoir un profil vendeur ?

**R :** Non. Le code vérifie explicitement que seuls les SELLER et ADMIN peuvent avoir un profil vendeur. Si un CUSTOMER essaie de créer un produit, il recevra l'erreur : "Seuls les vendeurs et administrateurs peuvent créer des produits".

## 📞 Support

Si le problème persiste après avoir appliqué ces corrections :

1. Vérifier les logs du backend
2. Vérifier que le rôle de l'utilisateur est bien ADMIN ou SELLER
3. Vérifier que la base de données est à jour
4. Redémarrer le backend après les modifications

---

**Date de correction :** 30 avril 2026  
**Version :** 1.0.0  
**Auteur :** Kiro AI Assistant
