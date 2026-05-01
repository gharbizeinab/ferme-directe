// src/app/components/coupon-form/coupon-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CouponService } from '../../services/coupon.service';
import { CategoryService } from '../../services/category.service';
import { Coupon, CouponRequest, CouponScope, Seller } from '../../models/coupon.model';
import { Category } from '../../models';

@Component({
  selector: 'app-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.css']
})
export class CouponFormComponent implements OnInit {
  @Input() coupon: Coupon | null = null;
  @Input() isAdmin: boolean = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  couponForm!: FormGroup;
  categories: any[] = [];
  sellers: Seller[] = [];
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService,
    private categoryService: CategoryService
  ) {}

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

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    });
  }

  initForm(): void {
    const now = new Date();
    const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    this.couponForm = this.fb.group({
      code: [this.coupon?.code || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [this.coupon?.description || '', [Validators.required, Validators.maxLength(500)]],
      pourcentageReduction: [this.coupon?.pourcentageReduction || null, [Validators.min(0), Validators.max(100)]],
      montantFixeReduction: [this.coupon?.montantFixeReduction || null, [Validators.min(0)]],
      livraisonGratuite: [this.coupon?.livraisonGratuite || false, Validators.required],
      montantMinimum: [this.coupon?.montantMinimum || null, [Validators.min(0)]],
      montantMaximumReduction: [this.coupon?.montantMaximumReduction || null, [Validators.min(0)]],
      categoriesApplicables: [this.coupon?.categoriesApplicables || []],
      scope: [this.isAdmin ? (this.coupon?.scope || CouponScope.GLOBAL) : CouponScope.SELLER, Validators.required],
      usagesMaxGlobal: [this.coupon?.usagesMaxGlobal || null, [Validators.min(1)]],
      usagesMaxParUtilisateur: [this.coupon?.usagesMaxParUtilisateur || 1, [Validators.required, Validators.min(1)]],
      dateDebut: [this.coupon?.dateDebut ? this.formatDateForInput(this.coupon.dateDebut) : this.formatDateForInput(now.toISOString()), Validators.required],
      dateExpiration: [this.coupon?.dateExpiration ? this.formatDateForInput(this.coupon.dateExpiration) : this.formatDateForInput(oneMonthLater.toISOString()), Validators.required]
    });

    // Désactiver le code en mode édition
    if (this.isEditMode) {
      this.couponForm.get('code')?.disable();
    }
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    if (this.couponForm.invalid) {
      Object.keys(this.couponForm.controls).forEach(key => {
        this.couponForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Validation : au moins une réduction doit être définie
    const formValue = this.couponForm.getRawValue();
    if ((!formValue.pourcentageReduction || formValue.pourcentageReduction === 0) &&
        (!formValue.montantFixeReduction || formValue.montantFixeReduction === 0) &&
        !formValue.livraisonGratuite) {
      alert('Vous devez définir au moins une réduction (pourcentage, montant fixe ou livraison gratuite)');
      return;
    }

    // Validation des dates
    const dateDebut = new Date(formValue.dateDebut);
    const dateExpiration = new Date(formValue.dateExpiration);
    if (dateExpiration <= dateDebut) {
      alert('La date d\'expiration doit être après la date de début');
      return;
    }

    // Déterminer le scope : si c'est un nombre, c'est un ID de vendeur, sinon c'est GLOBAL
    const scopeValue = formValue.scope;
    const isGlobal = scopeValue === 'GLOBAL';
    const sellerId = isGlobal ? null : parseInt(scopeValue);

    const request: CouponRequest = {
      code: formValue.code.toUpperCase(),
      description: formValue.description,
      pourcentageReduction: formValue.pourcentageReduction || null,
      montantFixeReduction: formValue.montantFixeReduction || null,
      livraisonGratuite: formValue.livraisonGratuite,
      montantMinimum: formValue.montantMinimum || null,
      montantMaximumReduction: formValue.montantMaximumReduction || null,
      categoriesApplicables: formValue.categoriesApplicables || [],
      scope: isGlobal ? CouponScope.GLOBAL : CouponScope.SELLER,
      sellerId: sellerId,
      usagesMaxGlobal: formValue.usagesMaxGlobal || 999999,
      usagesMaxParUtilisateur: formValue.usagesMaxParUtilisateur,
      dateDebut: new Date(formValue.dateDebut).toISOString(),
      dateExpiration: new Date(formValue.dateExpiration).toISOString()
    };

    this.loading = true;

    const operation = this.isEditMode
      ? (this.isAdmin 
          ? this.couponService.updateCoupon(this.coupon!.id, request)
          : this.couponService.updateMyCoupon(this.coupon!.id, request))
      : (this.isAdmin
          ? this.couponService.createGlobalCoupon(request)
          : this.couponService.createSellerCoupon(request));

    operation.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde', error);
        alert(error.error?.message || 'Erreur lors de la sauvegarde du coupon');
        this.loading = false;
      }
    });
  }

  onScopeChange(): void {
    // Méthode appelée quand la portée change
    // Peut être utilisée pour des validations supplémentaires si nécessaire
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.couponForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getReductionPreview(): string {
    const formValue = this.couponForm.value;
    const parts: string[] = [];

    if (formValue.pourcentageReduction && formValue.pourcentageReduction > 0) {
      parts.push(`-${formValue.pourcentageReduction}%`);
    }

    if (formValue.montantFixeReduction && formValue.montantFixeReduction > 0) {
      parts.push(`-${formValue.montantFixeReduction} DT`);
    }

    if (formValue.livraisonGratuite) {
      parts.push('Livraison offerte');
    }

    return parts.length > 0 ? parts.join(' + ') : 'Aucune réduction définie';
  }
}
