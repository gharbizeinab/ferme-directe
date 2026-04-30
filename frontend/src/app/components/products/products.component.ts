import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product, Category } from '../../models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  // Propriétés des produits et catégories
  products: Product[] = [];
  categories: Category[] = [];
  isLoading: boolean = false;

  // Contrôles de formulaire pour les filtres
  searchControl: FormControl = new FormControl('');
  categoryControl: FormControl = new FormControl('');

  // Propriétés de pagination
  page: number = 0;
  pageSize: number = 12;
  totalElements: number = 0;
  totalPages: number = 0;

  // Subject pour la gestion des souscriptions
  private destroy$: Subject<void> = new Subject<void>();

  // Injection de dépendances
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.initializeFilters();
    this.loadCategories();
    this.loadProducts();
  }

  // Nettoyage lors de la destruction du composant
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Initialisation des filtres avec observables
  private initializeFilters(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 0;
      this.loadProducts();
    });

    this.categoryControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 0;
      this.loadProducts();
    });
  }

  // Chargement des catégories
  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: () => {
        console.error('Erreur lors du chargement des catégories');
      }
    });
  }

  // Chargement des produits avec filtres et pagination
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts({
      page: this.page,
      size: this.pageSize,
      search: this.searchControl.value ?? undefined,
      categoryId: this.categoryControl.value ?? undefined
    }).subscribe({
      next: (page) => {
        this.products = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Navigation vers les détails d'un produit
  viewProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  // Ajout d'un produit au panier
  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Veuillez vous connecter pour ajouter au panier', 'Connexion', { duration: 3000 })
        .onAction().subscribe(() => this.router.navigate(['/login']));
      return;
    }

    this.cartService.addItem({ 
      produitId: product.id, 
      quantite: 1 
    }).subscribe({
      next: () => {
        this.snackBar.open('Produit ajouté au panier !', 'Voir le panier', { duration: 3000 })
          .onAction().subscribe(() => this.router.navigate(['/cart']));
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'ajout au panier', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Réinitialisation des filtres
  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
  }

  // Vérification de la promotion
  hasPromo(product: Product): boolean {
    return !!product.prixPromo && product.prixPromo < product.prix;
  }

  // Calcul du prix effectif
  getEffectivePrice(product: Product): number {
    return this.hasPromo(product) ? product.prixPromo! : product.prix;
  }

  // Gestion du changement de page
  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  // Génération du tableau des pages
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
