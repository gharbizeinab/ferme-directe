import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { Cart, CartLine } from '../../models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  // Propriétés du panier
  cart: Cart | null = null;
  isLoading: boolean = true;

  // Propriétés du coupon
  couponCode: string = '';
  couponLoading: boolean = false;
  couponError: string = '';
  couponApplied: boolean = false;
  isApplyingCoupon: boolean = false;

  // Injection de dépendances
  constructor(
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.loadCart();
  }

  // Chargement du panier
  private loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.couponApplied = !!cart.couponCode;
        if (cart.couponCode) {
          this.couponCode = cart.couponCode;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erreur lors du chargement du panier', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Vérification si le panier est vide
  isCartEmpty(): boolean {
    return !this.cart || this.cart.lignes.length === 0;
  }

  // Augmentation de la quantité
  increaseQty(line: CartLine): void {
    this.updateQuantity(line, 1);
  }

  // Diminution de la quantité
  decreaseQty(line: CartLine): void {
    this.updateQuantity(line, -1);
  }

  // Mise à jour de la quantité
  private updateQuantity(line: CartLine, delta: number): void {
    const newQty: number = line.quantite + delta;
    
    if (newQty < 1) {
      this.removeItem(line);
      return;
    }

    this.cartService.updateItem(line.id, newQty).subscribe({
      next: (cart) => {
        this.cart = cart;
      },
      error: () => {
        this.snackBar.open('Erreur lors de la mise à jour de la quantité', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Suppression d'un article
  removeItem(line: CartLine): void {
    this.cartService.removeItem(line.id).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.snackBar.open('Article retiré du panier', 'Fermer', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Vidage du panier
  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart = null;
        this.snackBar.open('Panier vidé', 'Fermer', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors du vidage du panier', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Application d'un code promo
  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.snackBar.open('Veuillez entrer un code promo', 'Fermer', { duration: 2000 });
      return;
    }

    this.isApplyingCoupon = true;
    this.couponError = '';

    this.cartService.applyCoupon(this.couponCode.trim()).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.couponApplied = true;
        this.isApplyingCoupon = false;
        this.snackBar.open('Code promo appliqué avec succès !', 'Fermer', { duration: 2500 });
      },
      error: (err) => {
        this.couponError = err.error?.message ?? 'Code promo invalide';
        this.isApplyingCoupon = false;
        this.snackBar.open(this.couponError, 'Fermer', { duration: 2500 });
      }
    });
  }

  // Retrait du code promo
  removeCoupon(): void {
    this.cartService.removeCoupon().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.couponCode = '';
        this.couponError = '';
        this.couponApplied = false;
        this.snackBar.open('Code promo retiré', 'Fermer', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors du retrait du code promo', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Navigation vers la page des produits
  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  // Navigation vers la page de paiement
  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  // Fonction de tracking pour ngFor
  trackByItem(_: number, item: CartLine): number {
    return item.id;
  }
}
