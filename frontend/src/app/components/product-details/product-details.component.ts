import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product, Review, ProductVariant } from '../../models';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  // Propriétés du produit
  product: Product | null = null;
  reviews: Review[] = [];
  isLoading: boolean = true;
  quantity: number = 1;
  selectedVariant: ProductVariant | null = null;
  isAddingToCart: boolean = false;

  // Propriétés du formulaire d'avis
  reviewForm!: FormGroup;
  showReviewForm: boolean = false;
  submittingReview: boolean = false;
  reviewRating: number = 5;
  reviewComment: string = '';
  hoverRating: number = 0;
  hasReviewed: boolean = false;

  // Injection de dépendances
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.initializeForm();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProduct(id);
      this.loadReviews(id);
    }
  }

  // Initialisation du formulaire
  private initializeForm(): void {
    this.reviewForm = new FormGroup({
      note: new FormControl(5, [Validators.required, Validators.min(1), Validators.max(5)]),
      commentaire: new FormControl('')
    });
  }


  // Chargement du produit
  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Produit introuvable', 'Fermer', { duration: 2500 });
        this.router.navigate(['/products']);
      }
    });
  }

  // Chargement des avis
  loadReviews(id: number): void {
    this.productService.getReviews(id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: () => {
        console.error('Erreur lors du chargement des avis');
      }
    });
  }

  // Vérification de la promotion
  hasPromo(): boolean {
    return !!this.product?.prixPromo && this.product.prixPromo < this.product.prix;
  }

  // Calcul du prix effectif
  getEffectivePrice(): number {
    if (!this.product) return 0;
    return this.hasPromo() ? this.product.prixPromo! : this.product.prix;
  }

  // Calcul du pourcentage de réduction
  getDiscountPercent(): number {
    if (!this.product || !this.hasPromo()) return 0;
    return Math.round(((this.product.prix - this.product.prixPromo!) / this.product.prix) * 100);
  }

  // Gestion de la quantité
  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Sélection d'une variante
  selectVariant(variant: ProductVariant): void {
    this.selectedVariant = variant;
  }


  // Ajout au panier
  addToCart(): void {
    if (!this.product) return;
    
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Veuillez vous connecter pour ajouter au panier', 'Connexion', { duration: 3000 })
        .onAction().subscribe(() => this.router.navigate(['/login']));
      return;
    }

    this.isAddingToCart = true;
    this.cartService.addItem({
      produitId: this.product.id,
      varianteId: this.selectedVariant?.id,
      quantite: this.quantity
    }).subscribe({
      next: () => {
        this.isAddingToCart = false;
        this.snackBar.open('Produit ajouté au panier !', 'Voir le panier', { duration: 3000 })
          .onAction().subscribe(() => this.router.navigate(['/cart']));
      },
      error: () => {
        this.isAddingToCart = false;
        this.snackBar.open('Erreur lors de l\'ajout au panier', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Affichage du prix
  getDisplayPrice(): number {
    return this.getEffectivePrice();
  }

  // Gestion du formulaire d'avis
  openReviewForm(): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Veuillez vous connecter pour laisser un avis', 'Connexion', { duration: 3000 })
        .onAction().subscribe(() => this.router.navigate(['/login']));
      return;
    }
    this.showReviewForm = true;
  }

  setRating(rating: number): void {
    this.reviewRating = rating;
    this.reviewForm.patchValue({ note: rating });
  }

  // Soumission de l'avis
  submitReview(): void {
    if (!this.product || !this.reviewForm.valid) return;
    
    this.submittingReview = true;
    const formValue = this.reviewForm.value;
    
    this.productService.addReview({
      produitId: this.product.id,
      note: formValue.note,
      commentaire: formValue.commentaire?.trim() || ''
    }).subscribe({
      next: (review) => {
        this.reviews = [review, ...this.reviews];
        this.showReviewForm = false;
        this.reviewForm.reset({ note: 5, commentaire: '' });
        this.reviewRating = 5;
        this.submittingReview = false;
        this.hasReviewed = true;
        this.snackBar.open('Avis publié avec succès !', 'Fermer', { duration: 2500 });
      },
      error: () => {
        this.submittingReview = false;
        this.snackBar.open('Erreur lors de la publication de l\'avis', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Génération des étoiles pour l'affichage
  getStars(note: number): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(note) ? 'star-full' : (i < note ? 'star-half' : 'star-empty')
    );
  }
}
