import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { Product, Category } from '../../models';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit {
  // Référence au tri Material
  @ViewChild(MatSort) sort!: MatSort;

  // Propriétés de la table
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  displayedColumns: string[] = ['nom', 'vendeur', 'prix', 'stock', 'actif', 'actions'];
  isLoading: boolean = true;
  isAdmin: boolean = false;

  // Propriétés des catégories
  categories: Category[] = [];
  availableCategories: Category[] = [];

  // Propriétés du formulaire
  showForm: boolean = false;
  editingProduct: Product | null = null;
  form!: FormGroup;
  productForm!: FormGroup;
  saving: boolean = false;
  isSaving: boolean = false;

  // Injection de dépendances
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    // Ajuster les colonnes selon le rôle
    if (!this.isAdmin) {
      this.displayedColumns = ['nom', 'prix', 'stock', 'actif', 'actions'];
    }
    this.initializeForm();
    this.loadProducts();
    this.loadCategories();
    
    // Vérifier si on doit ouvrir le formulaire d'ajout
    this.route.url.subscribe(segments => {
      if (segments.some(segment => segment.path === 'new')) {
        // Ouvrir le formulaire après un court délai pour laisser le temps au composant de se charger
        setTimeout(() => this.openCreateDialog(), 100);
      }
    });
  }

  // Initialisation du formulaire
  private initializeForm(): void {
    this.form = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      prix: new FormControl(0, [Validators.required, Validators.min(0)]),
      prixPromo: new FormControl(null),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
      unite: new FormControl('KG'),
      imageUrl: new FormControl(''),
      categoryId: new FormControl(null)
    });
    this.productForm = this.form;
  }

  // Chargement des produits
  private loadProducts(): void {
    this.isLoading = true;
    
    if (this.isAdmin) {
      // Pour admin : récupérer TOUS les produits (actifs ET inactifs)
      this.productService.getAllProducts({ page: 0, size: 1000 }).subscribe({
        next: (page) => {
          this.dataSource.data = page.content;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 2500 });
        }
      });
    } else {
      // Pour vendeur : seulement ses produits
      this.productService.getMyProducts().subscribe({
        next: (products) => {
          this.dataSource.data = products;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 2500 });
        }
      });
    }
  }

  // Chargement des catégories
  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.availableCategories = categories;
      },
      error: () => {
        console.error('Erreur lors du chargement des catégories');
      }
    });
  }

  // Application du filtre de recherche
  applyFilter(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  // Ouverture du formulaire de création
  openCreateDialog(): void {
    this.editingProduct = null;
    this.form.reset({ unite: 'KG', prix: 0, stock: 0 });
    this.showForm = true;
  }

  // Ouverture du formulaire d'édition
  openEditDialog(product: Product): void {
    this.editingProduct = product;
    this.form.patchValue(product);
    this.showForm = true;
  }

  // Sauvegarde du produit
  saveProduct(): void {
    if (this.form.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', { duration: 2500 });
      return;
    }

    this.saving = true;
    this.isSaving = true;
    const request = this.form.value;

    const operation = this.editingProduct
      ? this.productService.updateProduct(this.editingProduct.id, request)
      : this.productService.createProduct(request);

    operation.subscribe({
      next: () => {
        this.saving = false;
        this.isSaving = false;
        this.showForm = false;
        this.snackBar.open('Produit enregistré avec succès !', 'Fermer', { duration: 2500 });
        this.loadProducts();
      },
      error: (err) => {
        this.saving = false;
        this.isSaving = false;
        this.snackBar.open(err.error?.message ?? 'Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
      }
    });
  }

  // Confirmation de suppression
  confirmDelete(product: Product): void {
    this.deleteProduct(product);
  }

  // Activation/désactivation d'un produit
  toggleProduct(product: Product): void {
    this.productService.toggleProduct(product.id).subscribe({
      next: (updated) => {
        const idx: number = this.dataSource.data.findIndex(p => p.id === product.id);
        if (idx > -1) {
          const data: Product[] = [...this.dataSource.data];
          data[idx] = updated;
          this.dataSource.data = data;
        }
        this.snackBar.open('Statut du produit mis à jour', 'Fermer', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Suppression d'un produit
  deleteProduct(product: Product): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer le produit',
        message: `Voulez-vous vraiment supprimer "${product.nom}" ?`,
        type: 'danger',
        confirmLabel: 'Supprimer'
      }
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.snackBar.open('Produit supprimé avec succès', 'Fermer', { duration: 2500 });
          this.loadProducts();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression du produit', 'Fermer', { duration: 2500 });
        }
      });
    });
  }

  // Annulation du formulaire
  cancelForm(): void {
    this.showForm = false;
    this.form.reset();
  }
}
