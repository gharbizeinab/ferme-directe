// Angular core imports
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

// RxJS imports
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

// Material imports
import { MatSnackBar } from '@angular/material/snack-bar';

// Services
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

// Models
import { Product, Category } from '../../models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  // Public properties - Products and categories
  products: Product[] = [];
  categories: Category[] = [];
  isLoading: boolean = false;

  // Form controls for filters
  searchControl: FormControl = new FormControl('');
  categoryControl: FormControl = new FormControl('');

  // Pagination properties
  page: number = 0;
  pageSize: number = 12;
  totalElements: number = 0;
  totalPages: number = 0;

  // Private properties
  private destroy$: Subject<void> = new Subject<void>();

  // Constructor with dependency injection
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // Lifecycle hooks
  ngOnInit(): void {
    this.initializeFilters();
    this.loadCategories();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public methods
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

  viewProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

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

  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
  }

  hasPromo(product: Product): boolean {
    return !!product.prixPromo && product.prixPromo < product.prix;
  }

  getEffectivePrice(product: Product): number {
    return this.hasPromo(product) ? product.prixPromo! : product.prix;
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  // Private methods
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
}
