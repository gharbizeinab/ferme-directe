# 🎨 Charte Graphique - Ferme Directe

## 📋 Table des matières
1. [Palette de couleurs](#palette-de-couleurs)
2. [Typographie](#typographie)
3. [Composants UI](#composants-ui)
4. [Iconographie](#iconographie)
5. [Espacements et grilles](#espacements-et-grilles)
6. [Animations et transitions](#animations-et-transitions)
7. [Conventions de code](#conventions-de-code)

---

## 🎨 Palette de couleurs

### Couleurs principales
```css
/* Vert agricole - Couleur primaire */
--primary-color: #4CAF50;
--primary-dark: #388E3C;
--primary-light: #81C784;

/* Terre - Couleur secondaire */
--secondary-color: #8D6E63;
--secondary-dark: #5D4037;
--secondary-light: #BCAAA4;

/* Accent - Soleil */
--accent-color: #FFC107;
--accent-dark: #FFA000;
--accent-light: #FFD54F;
```

### Couleurs d'état
```css
/* Succès */
--success-color: #4CAF50;
--success-bg: #E8F5E9;

/* Erreur */
--error-color: #F44336;
--error-bg: #FFEBEE;

/* Avertissement */
--warning-color: #FF9800;
--warning-bg: #FFF3E0;

/* Information */
--info-color: #2196F3;
--info-bg: #E3F2FD;
```

### Couleurs neutres
```css
/* Texte */
--text-primary: #212121;
--text-secondary: #757575;
--text-disabled: #BDBDBD;
--text-hint: #9E9E9E;

/* Arrière-plans */
--bg-primary: #FFFFFF;
--bg-secondary: #F5F5F5;
--bg-tertiary: #EEEEEE;

/* Bordures */
--border-color: #E0E0E0;
--border-light: #F5F5F5;
--border-dark: #BDBDBD;
```

---

## 📝 Typographie

### Polices
```css
/* Police principale */
font-family: 'Roboto', 'Helvetica Neue', sans-serif;

/* Police pour les titres (optionnel) */
font-family: 'Poppins', 'Roboto', sans-serif;
```

### Hiérarchie typographique
```css
/* H1 - Titres de page */
h1 {
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--text-primary);
  margin-bottom: 24px;
}

/* H2 - Sections principales */
h2 {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
  margin-bottom: 20px;
}

/* H3 - Sous-sections */
h3 {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--text-primary);
  margin-bottom: 16px;
}

/* Corps de texte */
body {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-primary);
}

/* Texte secondaire */
.text-secondary {
  font-size: 12px;
  color: var(--text-secondary);
}
```

---

## 🧩 Composants UI

### Boutons

#### Bouton principal
```css
.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background-color: #388E3C;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-primary:disabled {
  background-color: #BDBDBD;
  cursor: not-allowed;
  box-shadow: none;
}
```

#### Bouton secondaire
```css
.btn-secondary {
  background-color: transparent;
  color: #4CAF50;
  border: 2px solid #4CAF50;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #4CAF50;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}
```

#### Bouton danger
```css
.btn-danger {
  background-color: #F44336;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.btn-danger:hover {
  background-color: #D32F2F;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}
```

### Cartes (Cards)
```css
.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  border: 1px solid #F5F5F5;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.card-header {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #F5F5F5;
}

.card-body {
  color: var(--text-secondary);
  line-height: 1.6;
}

.card-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #F5F5F5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

### Formulaires
```css
/* Champs de formulaire */
.form-field {
  width: 100%;
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-input:disabled {
  background-color: #F5F5F5;
  cursor: not-allowed;
  color: var(--text-disabled);
}

.form-input.error {
  border-color: #F44336;
}

.form-error {
  color: #F44336;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-hint {
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 4px;
}
```

### Tableaux
```css
.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background-color: #F5F5F5;
}

.table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 2px solid #E0E0E0;
}

.table td {
  padding: 16px;
  font-size: 14px;
  color: var(--text-secondary);
  border-bottom: 1px solid #F5F5F5;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #FAFAFA;
}

.table tbody tr:last-child td {
  border-bottom: none;
}
```

### Badges et étiquettes
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-success {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.badge-warning {
  background-color: #FFF3E0;
  color: #E65100;
}

.badge-error {
  background-color: #FFEBEE;
  color: #C62828;
}

.badge-info {
  background-color: #E3F2FD;
  color: #1565C0;
}

.badge-neutral {
  background-color: #F5F5F5;
  color: #616161;
}
```

### Modales (Dialogs)
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #F5F5F5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.modal-close:hover {
  background-color: #F5F5F5;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #F5F5F5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

---

## 🎯 Iconographie

### Icônes Material Design
Utiliser Material Icons pour la cohérence avec Angular Material :

```html
<!-- Import dans index.html -->
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

### Icônes principales du projet
```typescript
// Mapping des icônes par contexte
export const ICONS = {
  // Navigation
  dashboard: 'dashboard',
  products: 'shopping_basket',
  orders: 'receipt_long',
  users: 'people',
  settings: 'settings',
  
  // Actions
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  cancel: 'close',
  search: 'search',
  filter: 'filter_list',
  
  // États
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
  
  // E-commerce
  cart: 'shopping_cart',
  favorite: 'favorite',
  payment: 'payment',
  delivery: 'local_shipping',
  
  // Utilisateur
  account: 'account_circle',
  login: 'login',
  logout: 'logout',
  profile: 'person',
  
  // Ferme
  farm: 'agriculture',
  organic: 'eco',
  fresh: 'local_florist',
  quality: 'verified'
};
```

### Tailles d'icônes
```css
.icon-sm { font-size: 16px; }
.icon-md { font-size: 24px; }
.icon-lg { font-size: 32px; }
.icon-xl { font-size: 48px; }
```

---

## 📐 Espacements et grilles

### Système d'espacement (8px base)
```css
/* Espacements standardisés */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;

/* Classes utilitaires */
.m-xs { margin: 4px; }
.m-sm { margin: 8px; }
.m-md { margin: 16px; }
.m-lg { margin: 24px; }
.m-xl { margin: 32px; }

.p-xs { padding: 4px; }
.p-sm { padding: 8px; }
.p-md { padding: 16px; }
.p-lg { padding: 24px; }
.p-xl { padding: 32px; }

/* Marges directionnelles */
.mt-md { margin-top: 16px; }
.mb-md { margin-bottom: 16px; }
.ml-md { margin-left: 16px; }
.mr-md { margin-right: 16px; }
```

### Grille responsive
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -12px;
}

.col {
  flex: 1;
  padding: 0 12px;
}

/* Colonnes spécifiques */
.col-1 { flex: 0 0 8.333%; }
.col-2 { flex: 0 0 16.666%; }
.col-3 { flex: 0 0 25%; }
.col-4 { flex: 0 0 33.333%; }
.col-6 { flex: 0 0 50%; }
.col-12 { flex: 0 0 100%; }

/* Responsive */
@media (max-width: 768px) {
  .col-sm-12 { flex: 0 0 100%; }
}
```

---

## ✨ Animations et transitions

### Transitions standards
```css
/* Transitions de base */
.transition-fast {
  transition: all 0.2s ease;
}

.transition-normal {
  transition: all 0.3s ease;
}

.transition-slow {
  transition: all 0.5s ease;
}
```

### Animations clés
```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide Up */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Slide Down */
@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Pulse (pour notifications) */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Shake (pour erreurs) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
```

### Classes d'animation
```css
.animate-fade-in {
  animation: fadeIn 0.3s ease;
}

.animate-slide-up {
  animation: slideUp 0.3s ease;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease;
}

.animate-pulse {
  animation: pulse 0.5s ease;
}

.animate-shake {
  animation: shake 0.5s ease;
}
```

---

## 💻 Conventions de code

### Structure des composants Angular
```typescript
// Ordre des imports
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';

// Models
import { Product } from 'src/app/models/product.model';

// Décorateur Component
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  // 1. Propriétés @Input
  @Input() product!: Product;
  
  // 2. Propriétés @Output
  @Output() addToCart = new EventEmitter<Product>();
  
  // 3. Propriétés publiques
  isLoading: boolean = false;
  errorMessage: string = '';
  
  // 4. Propriétés de formulaire
  form!: FormGroup;
  
  // 5. Constructeur avec injection de dépendances
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}
  
  // 6. Lifecycle hooks
  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }
  
  // 7. Méthodes publiques
  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
  
  // 8. Méthodes privées
  private initializeForm(): void {
    this.form = new FormGroup({
      quantity: new FormControl(1, [Validators.required, Validators.min(1)])
    });
  }
  
  private loadData(): void {
    // Logique de chargement
  }
}
```

### Nommage des fichiers
```
// Composants
product-card.component.ts
product-card.component.html
product-card.component.css
product-card.component.spec.ts

// Services
product.service.ts
cart.service.ts
auth.service.ts

// Models
product.model.ts
user.model.ts
order.model.ts

// Guards
auth.guard.ts

// Interceptors
auth.interceptor.ts
```

### Conventions de nommage
```typescript
// Classes : PascalCase
export class ProductService { }
export class UserModel { }

// Interfaces : PascalCase avec préfixe I (optionnel)
export interface Product { }
export interface IUser { }

// Variables et fonctions : camelCase
const productList: Product[] = [];
function calculateTotal(): number { }

// Constantes : UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000';
const MAX_ITEMS_PER_PAGE = 10;

// Propriétés privées : préfixe _ (optionnel)
private _internalState: any;

// Observables : suffixe $
products$: Observable<Product[]>;
isLoading$: Observable<boolean>;
```

### Structure HTML
```html
<!-- Utiliser des classes sémantiques -->
<div class="product-card">
  <div class="product-card__header">
    <img class="product-card__image" [src]="product.image" [alt]="product.name">
    <span class="product-card__badge" *ngIf="product.isOrganic">Bio</span>
  </div>
  
  <div class="product-card__body">
    <h3 class="product-card__title">{{ product.name }}</h3>
    <p class="product-card__description">{{ product.description }}</p>
    
    <div class="product-card__price">
      <span class="price__amount">{{ product.price | currency:'EUR' }}</span>
      <span class="price__unit">/ {{ product.unit }}</span>
    </div>
  </div>
  
  <div class="product-card__footer">
    <button 
      class="btn btn-primary" 
      (click)="onAddToCart()"
      [disabled]="!product.available">
      <mat-icon>shopping_cart</mat-icon>
      <span>Ajouter au panier</span>
    </button>
  </div>
</div>
```

### Structure CSS (BEM)
```css
/* Block */
.product-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Element */
.product-card__header {
  position: relative;
  margin-bottom: 16px;
}

.product-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.product-card__badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #4CAF50;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.product-card__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

/* Modifier */
.product-card--featured {
  border: 2px solid #4CAF50;
}

.product-card--unavailable {
  opacity: 0.6;
  pointer-events: none;
}
```

### Gestion des erreurs
```typescript
// Dans les services
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
    catchError(error => {
      console.error('Erreur lors du chargement des produits:', error);
      return throwError(() => new Error('Impossible de charger les produits'));
    })
  );
}

// Dans les composants
loadProducts(): void {
  this.isLoading = true;
  this.errorMessage = '';
  
  this.productService.getProducts().subscribe({
    next: (products) => {
      this.products = products;
      this.isLoading = false;
    },
    error: (error) => {
      this.errorMessage = error.message;
      this.isLoading = false;
    }
  });
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first approach */
/* Extra small devices (phones, less than 576px) */
/* Default styles */

/* Small devices (tablets, 576px and up) */
@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
```

---

## 🎯 Accessibilité

### Bonnes pratiques
```html
<!-- Utiliser des labels pour les formulaires -->
<label for="email">Email</label>
<input id="email" type="email" name="email">

<!-- Ajouter des attributs ARIA -->
<button aria-label="Ajouter au panier">
  <mat-icon>shopping_cart</mat-icon>
</button>

<!-- Utiliser des rôles sémantiques -->
<nav role="navigation">
  <ul role="list">
    <li role="listitem"><a href="/products">Produits</a></li>
  </ul>
</nav>

<!-- Contraste de couleurs suffisant -->
<!-- Ratio minimum 4.5:1 pour le texte normal -->
<!-- Ratio minimum 3:1 pour le texte large -->
```

---

## 📦 Exemples d'utilisation

### Page de liste de produits
```html
<div class="container">
  <div class="page-header">
    <h1>Nos Produits Frais</h1>
    <button class="btn btn-primary" routerLink="/products/new">
      <mat-icon>add</mat-icon>
      <span>Nouveau produit</span>
    </button>
  </div>
  
  <div class="filters-bar">
    <mat-form-field class="filter-field">
      <mat-label>Rechercher</mat-label>
      <input matInput placeholder="Nom du produit...">
      <mat-icon matPrefix>search</mat-icon>
    </mat-form-field>
    
    <mat-form-field class="filter-field">
      <mat-label>Catégorie</mat-label>
      <mat-select>
        <mat-option value="all">Toutes</mat-option>
        <mat-option value="fruits">Fruits</mat-option>
        <mat-option value="legumes">Légumes</mat-option>
      </mat-select>
    </mat-form-field>
  </div>
  
  <div class="products-grid">
    <app-product-card 
      *ngFor="let product of products" 
      [product]="product"
      (addToCart)="onAddToCart($event)">
    </app-product-card>
  </div>
</div>
```

```css
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.filters-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.filter-field {
  flex: 1;
  min-width: 200px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .filters-bar {
    flex-direction: column;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 🔄 Mise à jour

**Version:** 1.0.0  
**Dernière mise à jour:** 2026-05-01  
**Auteur:** Équipe Ferme Directe

Cette charte graphique est un document vivant qui évoluera avec le projet.
