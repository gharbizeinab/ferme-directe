# 🔐 Créer un compte Administrateur

## Problème
L'application ne possède pas de compte admin par défaut. Vous devez en créer un manuellement.

## Solution 1 : Via l'API (Recommandé)

### Avec Postman ou un client REST

**Endpoint :** `POST http://localhost:8080/api/auth/register`

**Headers :**
```
Content-Type: application/json
```

**Body (JSON) :**
```json
{
  "email": "admin@fermedirecte.com",
  "motDePasse": "Admin123!",
  "prenom": "Admin",
  "nom": "FermeDirecte",
  "telephone": "0123456789",
  "role": "ADMIN"
}
```

### Avec curl (ligne de commande)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@fermedirecte.com\",\"motDePasse\":\"Admin123!\",\"prenom\":\"Admin\",\"nom\":\"FermeDirecte\",\"telephone\":\"0123456789\",\"role\":\"ADMIN\"}"
```

### Avec PowerShell (Windows)

```powershell
$body = @{
    email = "admin@fermedirecte.com"
    motDePasse = "Admin123!"
    prenom = "Admin"
    nom = "FermeDirecte"
    telephone = "0123456789"
    role = "ADMIN"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

---

## Solution 2 : Directement dans la base de données

### Étape 1 : Ouvrir phpMyAdmin
1. Allez sur http://localhost/phpmyadmin
2. Sélectionnez la base de données `fermedirecte`
3. Cliquez sur l'onglet "SQL"

### Étape 2 : Exécuter ce script SQL

```sql
-- Créer un utilisateur admin
-- Mot de passe : Admin123! (encodé en BCrypt)
INSERT INTO users (email, mot_de_passe, prenom, nom, telephone, role, actif, date_inscription)
VALUES (
    'admin@fermedirecte.com',
    '$2a$10$xQKhH5xQKhH5xQKhH5xQKuN7Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8',
    'Admin',
    'FermeDirecte',
    '0123456789',
    'ADMIN',
    true,
    NOW()
);

-- Récupérer l'ID de l'utilisateur créé
SET @admin_user_id = LAST_INSERT_ID();

-- Créer le profil vendeur pour l'admin
INSERT INTO seller_profiles (user_id, nom_boutique, description, note)
VALUES (
    @admin_user_id,
    'Administration FermeDirecte',
    'Boutique officielle de l''administration',
    0.0
);
```

**⚠️ Note :** Le mot de passe BCrypt ci-dessus est un exemple. Pour générer le vrai hash, utilisez plutôt la Solution 1 (API).

---

## Solution 3 : Créer un DataInitializer (Pour les développeurs)

Si vous voulez automatiser la création de l'admin au démarrage de l'application :

### Créer le fichier `DataInitializer.java`

Chemin : `backend/src/main/java/com/FermeDirecte/FermeDirecte/config/DataInitializer.java`

```java
package com.FermeDirecte.FermeDirecte.config;

import com.FermeDirecte.FermeDirecte.entity.SellerProfile;
import com.FermeDirecte.FermeDirecte.entity.User;
import com.FermeDirecte.FermeDirecte.enums.Role;
import com.FermeDirecte.FermeDirecte.repository.SellerProfileRepository;
import com.FermeDirecte.FermeDirecte.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SellerProfileRepository sellerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Créer un admin par défaut s'il n'existe pas
        if (!userRepository.existsByEmail("admin@fermedirecte.com")) {
            log.info("Création de l'utilisateur admin par défaut...");
            
            User admin = User.builder()
                    .email("admin@fermedirecte.com")
                    .motDePasse(passwordEncoder.encode("Admin123!"))
                    .prenom("Admin")
                    .nom("FermeDirecte")
                    .telephone("0123456789")
                    .role(Role.ADMIN)
                    .actif(true)
                    .build();
            
            userRepository.save(admin);
            
            // Créer le profil vendeur pour l'admin
            SellerProfile sellerProfile = SellerProfile.builder()
                    .user(admin)
                    .nomBoutique("Administration FermeDirecte")
                    .description("Boutique officielle de l'administration")
                    .note(0.0)
                    .build();
            
            sellerProfileRepository.save(sellerProfile);
            
            log.info("✅ Utilisateur admin créé avec succès !");
            log.info("   Email: admin@fermedirecte.com");
            log.info("   Mot de passe: Admin123!");
        } else {
            log.info("L'utilisateur admin existe déjà.");
        }
    }
}
```

Après avoir créé ce fichier, redémarrez le backend. L'admin sera créé automatiquement.

---

## 🎯 Credentials Admin

Après avoir utilisé l'une des solutions ci-dessus :

**Email :** `admin@fermedirecte.com`  
**Mot de passe :** `Admin123!`

---

## ✅ Vérification

1. Allez sur http://localhost:4200
2. Cliquez sur "Connexion"
3. Entrez les credentials admin
4. Vous devriez être connecté avec le rôle ADMIN

---

## 📝 Notes importantes

- Le rôle ADMIN a accès à toutes les fonctionnalités
- Un profil vendeur est automatiquement créé pour l'admin
- L'admin peut voir les données de tous les vendeurs dans le dashboard
- L'admin peut gérer les catégories de produits
