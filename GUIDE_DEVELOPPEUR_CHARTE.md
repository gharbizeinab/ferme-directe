# 👨‍💻 Guide Développeur - Charte Graphique Ferme Directe

## 🚀 Démarrage Rapide

Ce guide vous aide à appliquer la charte graphique dans vos développements quotidiens.

---

## 📐 Variables CSS à Utiliser

### Couleurs

```scss
/* Couleurs principales */
var(--color-primary)           // #4CAF50 - Vert agricole
var(--color-primary-dark)      // #388E3C - Vert foncé
var(--color-primary-light)     // #81C784 - Vert clair
var(--color-primary-bg)        // #E8F5E9 - Background vert

/* Couleurs secondaires */
var(--color-secondary)         // #8D6E63 - Terre
var(--color-accent)            // #FFC107 - Soleil

/* États */
var(--color-success)           // #4CAF50
var(--color-error)             // #F44336
var(--color-warning)           // #FF9800
var(--color-info)              // #2196F3

/* Texte */
var(--color-text-primary)      // #212121
var(--color-text-secondary)    // #757575
var(--color-text-disabled)     // #BDBDBD

/* Backgrounds */
var(--color-surface)           // #FFFFFF
var(--color-background)        // #F5F5F5
var(--color-border)            // #E0E0E0
```

### Espacements (Système 8px)

```scss
var(--spacing-xs)    // 4px
var(--spacing-sm)    // 8px
var(--spacing-md)    // 16px
var(--spacing-lg)    // 24px
var(--spacing-xl)    // 32px
var(--spacing-xxl)   // 48px
```

### Border Radius

```scss
var(--radius-sm)     // 6px
var(--radius-md)     // 8px
var(--radius-lg)     // 12px
var(--radius-xl)     // 16px
var(--radius-xxl)    // 24px
```

### Ombres

```scss
var(--shadow-sm)     // Légère
var(--shadow-md)     // Moyenne
var(--shadow-lg)     // Grande
var(--shadow-xl)     // Extra grande
```

### Transitions

```scss
var(--transition-fast)    // 0.2s ease
var(--transition-base)    // 0.3s ease
var(--transition-slow)    // 0.5s ease
```

---

## 🎨 Classes Utilitaires

### Espacements

```html
<!-- Marges -->
<div class="m-xs">Marge 4px</div>
<div class="m-sm">Marge 8px</div>
<div class="m-md">Marge 16px</div>
<div class="m-lg">Marge 24px</div>

<!-- Marges directionnelles -->
<div class="mt-md">Marge top 16px</div>
<div class="mb-md">Marge bottom 16px</div>

<!-- Padding -->
<div class="p-md">Padding 16px</div>
<div class="p-lg">Padding 24px</div>
```

### Badges

```html
<span class="status-badge badge-success">Succès</span>
<span class="status-badge badge-warning">Attention</span>
<span class="status-badge badge-error">Erreur</span>
<span class="status-badge badge-info">Info</span>
<span class="status-badge badge-neutral">Neutre</span>
```

### Animations

```html
<div class="animate-fade-in">Apparition en fondu</div>
<div class="animate-slide-up">Glissement vers le haut</div>
<div class="animate-scale-in">Zoom</div>
<div class="animate-pulse">Pulsation</div>
<div class="animate-shake">Secousse (erreur)</div>
```

### Transitions

```html
<button class="transition-fast">Transition rapide</button>
<div class="transition-normal">Transition normale</div>
<div class="transition-slow">Transition lente</div>
```

---

## 🏗️ Convention BEM

### Structure de Base

```
.block                    // Composant principal
.block__element          // Élément du composant
.block__element--modifier // Variante de l'élément
```

### Exemple Concret : Card Produit

```html
<div class="product-card">
  <div class="product-card__header">
    <img class="product-card__image" src="...">
    <span class="product-card__badge product-card__badge--promo">Promo</span>
  </div>
  
  <div class="product-card__body">
    <h3 class="product-card__title">Titre</h3>
    <p class="product-card__description">Description</p>
  </div>
  
  <div class="product-card__footer">
    <button class="product-card__button">Action</button>
  </div>
</div>
```

```scss
.product-card {
  // Styles du block
  
  &__header {
    // Styles de l'élément header
  }
  
  &__image {
    // Styles de l'élément image
  }
  
  &__badge {
    // Styles de l'élément badge
    
    &--promo {
      // Styles du modifier promo
      background-color: var(--color-error);
    }
    
    &--new {
      // Styles du modifier new
      background-color: var(--color-info);
    }
  }
}
```

---

## 📝 Structure de Composant Angular

### Ordre des Imports

```typescript
// 1. Angular core
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// 2. RxJS
import { Observable, Subject, takeUntil } from 'rxjs';

// 3. Material
import { MatSnackBar } from '@angular/material/snack-bar';

// 4. Services
import { ProductService } from 'src/app/services/product.service';

// 5. Models
import { Product } from 'src/app/models/product.model';
```

### Structure de Classe

```typescript
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit, OnDestroy {
  // 1. @Input properties
  @Input() data!: any;
  
  // 2. @Output properties
  @Output() action = new EventEmitter<void>();
  
  // 3. Public properties
  isLoading: boolean = false;
  items: any[] = [];
  
  // 4. Form properties
  form!: FormGroup;
  
  // 5. Private properties
  private destroy$ = new Subject<void>();
  
  // 6. Constructor
  constructor(
    private service: MyService,
    private router: Router
  ) {}
  
  // 7. Lifecycle hooks
  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // 8. Public methods
  loadData(): void {
    // Implementation
  }
  
  onSubmit(): void {
    // Implementation
  }
  
  // 9. Private methods
  private initializeForm(): void {
    // Implementation
  }
}
```

---

## 🎯 Patterns Courants

### Card avec Hover Effect

```scss
.my-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}
```

### Bouton Primaire

```html
<button mat-raised-button color="primary" class="btn-primary">
  <mat-icon>add</mat-icon>
  <span>Ajouter</span>
</button>
```

```scss
.btn-primary {
  border-radius: var(--radius-md);
  padding: 12px 24px;
  font-weight: 600;
  transition: all var(--transition-base);
  
  &:hover {
    transform: translateY(-2px);
  }
}
```

### Formulaire

```html
<form [formGroup]="form" class="form">
  <mat-form-field appearance="outline" class="form__field">
    <mat-label>Nom du produit</mat-label>
    <input matInput formControlName="name">
    <mat-icon matPrefix>shopping_basket</mat-icon>
    <mat-error *ngIf="form.get('name')?.hasError('required')">
      Le nom est requis
    </mat-error>
  </mat-form-field>
  
  <button mat-raised-button color="primary" type="submit">
    Enregistrer
  </button>
</form>
```

```scss
.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  
  &__field {
    width: 100%;
  }
}
```

### Liste avec États Vides

```html
<!-- Loading -->
<div class="loading-container" *ngIf="isLoading">
  <mat-spinner diameter="40"></mat-spinner>
  <p>Chargement...</p>
</div>

<!-- Empty state -->
<div class="empty-state" *ngIf="!isLoading && items.length === 0">
  <div class="empty-state__icon">
    <mat-icon>inbox</mat-icon>
  </div>
  <h3>Aucun élément</h3>
  <p>Commencez par ajouter un élément</p>
  <button mat-raised-button color="primary">
    <mat-icon>add</mat-icon>
    Ajouter
  </button>
</div>

<!-- Content -->
<div class="items-grid" *ngIf="!isLoading && items.length > 0">
  <!-- Items -->
</div>
```

---

## 🎨 Icônes Material

### Icônes Principales du Projet

```typescript
// Navigation
dashboard, shopping_basket, receipt_long, people, settings

// Actions
add, edit, delete, save, close, search, filter_list

// États
check_circle, error, warning, info

// E-commerce
shopping_cart, favorite, payment, local_shipping

// Utilisateur
account_circle, login, logout, person

// Ferme
agriculture, eco, local_florist, verified
```

### Utilisation

```html
<!-- Icône simple -->
<mat-icon>shopping_basket</mat-icon>

<!-- Icône avec taille -->
<mat-icon class="icon-lg">agriculture</mat-icon>

<!-- Icône avec couleur -->
<mat-icon color="primary">check_circle</mat-icon>

<!-- Icône dans un bouton -->
<button mat-icon-button>
  <mat-icon>edit</mat-icon>
</button>
```

---

## 📱 Responsive Design

### Breakpoints

```scss
/* Mobile first approach */

/* Default: < 576px */
.element {
  font-size: 14px;
}

/* Small devices: ≥ 576px */
@media (min-width: 576px) {
  .element {
    font-size: 16px;
  }
}

/* Medium devices: ≥ 768px */
@media (min-width: 768px) {
  .element {
    font-size: 18px;
  }
}

/* Large devices: ≥ 992px */
@media (min-width: 992px) {
  .element {
    font-size: 20px;
  }
}

/* Extra large: ≥ 1200px */
@media (min-width: 1200px) {
  .element {
    font-size: 22px;
  }
}
```

---

## ✅ Checklist Avant Commit

- [ ] Utilisation des variables CSS pour couleurs, espacements, radius
- [ ] Convention BEM appliquée pour les classes CSS
- [ ] Structure de composant Angular respectée
- [ ] Imports organisés par catégorie
- [ ] Transitions et animations utilisées
- [ ] Responsive design testé
- [ ] Accessibilité vérifiée (aria-label, alt, etc.)
- [ ] Code commenté si nécessaire
- [ ] Pas de valeurs en dur (utiliser les variables)

---

## 🆘 Aide Rapide

### Problème : Couleur ne s'applique pas
```scss
// ❌ Mauvais
color: #4CAF50;

// ✅ Bon
color: var(--color-primary);
```

### Problème : Espacement incohérent
```scss
// ❌ Mauvais
margin: 15px;
padding: 20px;

// ✅ Bon
margin: var(--spacing-md);
padding: var(--spacing-lg);
```

### Problème : Transition saccadée
```scss
// ❌ Mauvais
transition: all 0.1s;

// ✅ Bon
transition: all var(--transition-base);
// Ou pour les transformations
transition: transform var(--transition-base), box-shadow var(--transition-base);
```

### Problème : Classes CSS désorganisées
```html
<!-- ❌ Mauvais -->
<div class="product-card">
  <div class="image-container">
    <img class="img">
  </div>
</div>

<!-- ✅ Bon (BEM) -->
<div class="product-card">
  <div class="product-card__image-wrap">
    <img class="product-card__image">
  </div>
</div>
```

---

## 📚 Ressources

- **Charte complète** : `CHARTE_GRAPHIQUE.md`
- **Changements appliqués** : `CHANGEMENTS_CHARTE_GRAPHIQUE.md`
- **Material Design** : https://material.angular.io/
- **BEM Methodology** : https://getbem.com/

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2026-05-01
