import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category, CategoryRequest } from '../../models';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss']
})
export class ManageCategoriesComponent implements OnInit {
  // Propriétés des catégories
  categories: Category[] = [];
  flatCategories: Category[] = [];
  isLoading: boolean = false;

  // Propriétés du formulaire
  categoryForm!: FormGroup;
  isEditing: boolean = false;
  editingId: number | null = null;

  // Colonnes affichées dans le tableau
  displayedColumns: string[] = ['nom', 'description', 'parent', 'sousCategories', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  // Initialisation du formulaire
  private initializeForm(): void {
    this.categoryForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl(''),
      parentId: new FormControl(null)
    });
  }

  // Chargement des catégories
  private loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.flatCategories = this.flattenCategories(categories);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.showError('Erreur lors du chargement des catégories');
        console.error(err);
      }
    });
  }

  // Aplatir l'arbre de catégories pour l'affichage dans le tableau
  private flattenCategories(categories: Category[], level: number = 0): Category[] {
    let result: Category[] = [];
    for (const cat of categories) {
      result.push({ ...cat, level } as any);
      if (cat.sousCategories && cat.sousCategories.length > 0) {
        result = result.concat(this.flattenCategories(cat.sousCategories, level + 1));
      }
    }
    return result;
  }

  // Obtenir toutes les catégories parentes possibles (exclut la catégorie en cours d'édition et ses enfants)
  getAvailableParents(): Category[] {
    if (!this.isEditing || !this.editingId) {
      return this.flatCategories;
    }
    // Exclure la catégorie en cours d'édition et ses descendants
    const excludedIds = this.getDescendantIds(this.editingId);
    return this.flatCategories.filter(cat => !excludedIds.includes(cat.id));
  }

  // Obtenir les IDs de tous les descendants d'une catégorie
  private getDescendantIds(categoryId: number): number[] {
    const category = this.flatCategories.find(c => c.id === categoryId);
    if (!category || !category.sousCategories) {
      return [categoryId];
    }
    let ids = [categoryId];
    for (const child of category.sousCategories) {
      ids = ids.concat(this.getDescendantIds(child.id));
    }
    return ids;
  }

  // Obtenir le nom de la catégorie parente
  getParentName(parentId?: number): string {
    if (!parentId) return '-';
    const parent = this.flatCategories.find(c => c.id === parentId);
    return parent ? parent.nom : '-';
  }

  // Obtenir le nombre de sous-catégories
  getSubCategoriesCount(category: Category): number {
    return category.sousCategories?.length || 0;
  }

  // Soumettre le formulaire (création ou modification)
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const request: CategoryRequest = this.categoryForm.value;

    if (this.isEditing && this.editingId) {
      this.updateCategory(this.editingId, request);
    } else {
      this.createCategory(request);
    }
  }

  // Créer une nouvelle catégorie
  private createCategory(request: CategoryRequest): void {
    this.categoryService.create(request).subscribe({
      next: () => {
        this.showSuccess('Catégorie créée avec succès');
        this.resetForm();
        this.loadCategories();
      },
      error: (err) => {
        this.showError('Erreur lors de la création de la catégorie');
        console.error(err);
      }
    });
  }

  // Modifier une catégorie existante
  private updateCategory(id: number, request: CategoryRequest): void {
    this.categoryService.update(id, request).subscribe({
      next: () => {
        this.showSuccess('Catégorie modifiée avec succès');
        this.resetForm();
        this.loadCategories();
      },
      error: (err) => {
        this.showError('Erreur lors de la modification de la catégorie');
        console.error(err);
      }
    });
  }

  // Préparer l'édition d'une catégorie
  onEdit(category: Category): void {
    this.isEditing = true;
    this.editingId = category.id;
    this.categoryForm.patchValue({
      nom: category.nom,
      description: category.description || '',
      parentId: category.parentId || null
    });
    // Scroll vers le formulaire
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Supprimer une catégorie
  onDelete(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer la catégorie "${category.nom}" ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.deleteCategory(category.id);
      }
    });
  }

  // Supprimer une catégorie (appel API)
  private deleteCategory(id: number): void {
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.showSuccess('Catégorie supprimée avec succès');
        this.loadCategories();
      },
      error: (err) => {
        this.showError('Erreur lors de la suppression de la catégorie');
        console.error(err);
      }
    });
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.categoryForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }

  // Afficher un message de succès
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  // Afficher un message d'erreur
  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // Obtenir l'indentation pour l'affichage hiérarchique
  getIndentation(category: any): string {
    const level = category.level || 0;
    return `${level * 20}px`;
  }
}
