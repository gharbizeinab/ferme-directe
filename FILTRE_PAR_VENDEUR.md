# 👥 Filtre par Vendeur - Amélioration du Système de Coupons

## ✅ Fonctionnalités Ajoutées

### 1. Filtre de Portée par Nom de Vendeur
Au lieu d'afficher "Vendeurs" générique, le filtre affiche maintenant la liste des vendeurs avec leurs noms complets.

### 2. Recherche par Nom de Vendeur
La recherche permet maintenant de trouver des coupons en tapant le nom du vendeur.

### 3. Création de Coupon pour un Vendeur Spécifique
L'admin peut maintenant créer un coupon pour un vendeur spécifique au lieu de juste "Global" ou "Vendeur".

---

## 🎯 Modifications Apportées

### Backend (Java/Spring Boot)

#### 1. Nouveau DTO : `SellerResponse.java`
```java
@Data
@Builder
public class SellerResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String nomComplet; // nom + prenom
}
```

#### 2. UserRepository - Nouvelle Méthode
```java
List<User> findByRole(Role role);
```

#### 3. CouponController - Nouvel Endpoint
```java
@GetMapping("/admin/sellers")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<SellerResponse>> getAllSellers() {
    return ResponseEntity.ok(couponService.getAllSellers());
}
```

#### 4. CouponService - Nouvelle Méthode
```java
public List<SellerResponse> getAllSellers() {
    return userRepository.findByRole(Role.SELLER).stream()
        .map(seller -> SellerResponse.builder()
            .id(seller.getId())
            .nom(seller.getNom())
            .prenom(seller.getPrenom())
            .email(seller.getEmail())
            .nomComplet(seller.getPrenom() + " " + seller.getNom())
            .build())
        .collect(Collectors.toList());
}
```

#### 5. CouponRequest - Nouveau Champ
```java
private Long sellerId; // ID du vendeur si admin crée pour un vendeur spécifique
```

#### 6. CouponService.createCoupon() - Logique Modifiée
```java
// Déterminer le vendeur
User vendeur = null;
if (request.getScope() == CouponScope.SELLER) {
    if (request.getSellerId() != null && user.getRole() == Role.ADMIN) {
        // Admin crée un coupon pour un vendeur spécifique
        vendeur = userRepository.findById(request.getSellerId())
            .orElseThrow(() -> new RuntimeException("Vendeur non trouvé"));
    } else {
        // Vendeur crée son propre coupon
        vendeur = user;
    }
}
```

---

### Frontend (Angular)

#### 1. Nouveau Modèle : `Seller`
```typescript
export interface Seller {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  nomComplet: string;
}
```

#### 2. CouponService - Nouvelle Méthode
```typescript
getAllSellers(): Observable<Seller[]> {
  return this.http.get<Seller[]>(`${this.apiUrl}/admin/sellers`);
}
```

#### 3. CouponRequest - Nouveau Champ
```typescript
export interface CouponRequest {
  // ...
  sellerId?: number | null;
  // ...
}
```

#### 4. AdminCouponsComponent - Modifications

**TypeScript :**
```typescript
sellers: Seller[] = [];

ngOnInit(): void {
  this.loadCoupons();
  this.loadSellers();
}

loadSellers(): void {
  this.couponService.getAllSellers().subscribe({
    next: (data) => {
      this.sellers = data;
    },
    error: (error) => {
      console.error('Erreur lors du chargement des vendeurs', error);
    }
  });
}

applyFilters(): void {
  this.filteredCoupons = this.coupons.filter(coupon => {
    // Filtre par portée (ALL, GLOBAL, ou ID du vendeur)
    let matchScope = false;
    if (this.filterScope === 'ALL') {
      matchScope = true;
    } else if (this.filterScope === 'GLOBAL') {
      matchScope = coupon.scope === 'GLOBAL';
    } else {
      // C'est un ID de vendeur
      matchScope = coupon.vendeurId?.toString() === this.filterScope;
    }

    // Recherche par code, description OU nom du vendeur
    const matchSearch = !this.searchTerm ||
      coupon.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (coupon.vendeurNom && coupon.vendeurNom.toLowerCase().includes(this.searchTerm.toLowerCase()));
    
    return matchScope && matchStatus && matchSearch;
  });
  // ... tri
}
```

**HTML :**
```html
<div class="filter-group">
  <label>Portée</label>
  <select [(ngModel)]="filterScope" (ngModelChange)="applyFilters()" class="form-control">
    <option value="ALL">Tous</option>
    <option value="GLOBAL">Globaux</option>
    <optgroup label="Vendeurs">
      <option *ngFor="let seller of sellers" [value]="seller.id">
        {{ seller.nomComplet }}
      </option>
    </optgroup>
  </select>
</div>
```

#### 5. CouponFormComponent - Modifications

**TypeScript :**
```typescript
sellers: Seller[] = [];

ngOnInit(): void {
  this.isEditMode = !!this.coupon;
  this.loadCategories();
  if (this.isAdmin) {
    this.loadSellers();
  }
  this.initForm();
}

loadSellers(): void {
  this.couponService.getAllSellers().subscribe({
    next: (data: Seller[]) => {
      this.sellers = data;
    },
    error: (error: any) => {
      console.error('Erreur lors du chargement des vendeurs', error);
    }
  });
}

onSubmit(): void {
  // ...
  const scopeValue = formValue.scope;
  const isGlobal = scopeValue === 'GLOBAL';
  const sellerId = isGlobal ? null : parseInt(scopeValue);

  const request: CouponRequest = {
    // ...
    scope: isGlobal ? CouponScope.GLOBAL : CouponScope.SELLER,
    sellerId: sellerId,
    // ...
  };
  // ...
}
```

**HTML :**
```html
<mat-form-field appearance="outline" class="full-width" *ngIf="isAdmin">
  <mat-label>Portée</mat-label>
  <mat-select formControlName="scope" required (selectionChange)="onScopeChange()">
    <mat-option value="GLOBAL">
      <mat-icon>public</mat-icon>
      Global (toute la plateforme)
    </mat-option>
    <mat-optgroup label="Vendeurs">
      <mat-option *ngFor="let seller of sellers" [value]="seller.id">
        <mat-icon>store</mat-icon>
        {{ seller.nomComplet }}
      </mat-option>
    </mat-optgroup>
  </mat-select>
  <mat-icon matPrefix>visibility</mat-icon>
  <mat-hint>Choisissez "Global" ou un vendeur spécifique</mat-hint>
</mat-form-field>
```

---

## 🎯 Utilisation

### 1. Filtrer par Vendeur (Admin)
1. Allez sur `/admin/coupons`
2. Dans le filtre "Portée", vous voyez maintenant :
   - **Tous** - Affiche tous les coupons
   - **Globaux** - Affiche uniquement les coupons globaux
   - **Vendeurs** (groupe) :
     - Jean Dupont
     - Marie Martin
     - etc.
3. Sélectionnez un vendeur pour voir uniquement ses coupons

### 2. Rechercher par Nom de Vendeur
1. Dans le champ "Recherche"
2. Tapez le nom d'un vendeur (ex: "Jean")
3. Les coupons de ce vendeur s'affichent

### 3. Créer un Coupon pour un Vendeur Spécifique (Admin)
1. Cliquez sur "Créer un coupon global"
2. Dans le champ "Portée", vous voyez :
   - **Global (toute la plateforme)**
   - **Vendeurs** (groupe) :
     - Jean Dupont
     - Marie Martin
     - etc.
3. Sélectionnez un vendeur
4. Le coupon sera créé pour ce vendeur spécifique

---

## 📊 Exemples

### Exemple 1 : Voir les Coupons de Jean Dupont
1. Filtre "Portée" → Sélectionnez "Jean Dupont"
2. Résultat : Seuls les coupons de Jean Dupont s'affichent

### Exemple 2 : Rechercher "Marie"
1. Champ "Recherche" → Tapez "Marie"
2. Résultat : Tous les coupons contenant "Marie" (code, description, ou nom du vendeur)

### Exemple 3 : Créer un Coupon pour Marie Martin
1. Cliquez sur "Créer un coupon global"
2. Portée → Sélectionnez "Marie Martin"
3. Remplissez le formulaire
4. Cliquez sur "Créer"
5. Résultat : Coupon créé pour Marie Martin (elle peut le gérer)

---

## 🔧 Fichiers Modifiés

### Backend (7 fichiers)
1. ✅ `SellerResponse.java` (nouveau)
2. ✅ `UserRepository.java` (méthode `findByRole` ajoutée)
3. ✅ `CouponController.java` (endpoint `/admin/sellers` ajouté)
4. ✅ `CouponService.java` (méthode `getAllSellers` + logique `createCoupon` modifiée)
5. ✅ `CouponRequest.java` (champ `sellerId` ajouté)

### Frontend (5 fichiers)
1. ✅ `coupon.model.ts` (interface `Seller` + `sellerId` dans `CouponRequest`)
2. ✅ `coupon.service.ts` (méthode `getAllSellers` ajoutée)
3. ✅ `admin-coupons.component.ts` (chargement vendeurs + filtre modifié)
4. ✅ `admin-coupons.component.html` (select vendeurs dans filtre)
5. ✅ `coupon-form.component.ts` (chargement vendeurs + logique soumission)
6. ✅ `coupon-form.component.html` (select vendeurs dans formulaire)

---

## ✅ Avantages

### Pour l'Admin
- ✅ Voir rapidement les coupons d'un vendeur spécifique
- ✅ Créer des coupons pour des vendeurs spécifiques
- ✅ Rechercher par nom de vendeur
- ✅ Meilleure organisation et gestion

### Pour le Vendeur
- ✅ Peut recevoir des coupons créés par l'admin
- ✅ Peut gérer ses propres coupons + ceux créés par l'admin pour lui

---

## 🎉 Résultat Final

Le système de coupons est maintenant beaucoup plus flexible et puissant :

✅ Filtre par vendeur avec noms complets  
✅ Recherche par nom de vendeur  
✅ Création de coupons pour des vendeurs spécifiques  
✅ Meilleure UX pour l'admin  
✅ Plus de contrôle et de flexibilité  

---

## 🚀 Test

### Redémarrer le Backend
```bash
cd ferme-directe-complete/backend
mvn spring-boot:run
```

### Tester
1. Connectez-vous en tant qu'admin
2. Allez sur `/admin/coupons`
3. Vérifiez le filtre "Portée" → Vous devriez voir les vendeurs
4. Créez un coupon → Vous devriez pouvoir choisir un vendeur

---

**🎊 Le système de filtrage par vendeur est maintenant opérationnel !**

