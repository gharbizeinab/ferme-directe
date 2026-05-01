// src/app/components/admin-coupons/admin-coupons.component.ts
import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../services/coupon.service';
import { Coupon, CouponScope, Seller } from '../../models/coupon.model';

@Component({
  selector: 'app-admin-coupons',
  templateUrl: './admin-coupons.component.html',
  styleUrls: ['./admin-coupons.component.css']
})
export class AdminCouponsComponent implements OnInit {
  coupons: Coupon[] = [];
  filteredCoupons: Coupon[] = [];
  sellers: Seller[] = [];
  loading = false;
  showForm = false;
  selectedCoupon: Coupon | null = null;
  
  // Filtres
  filterScope: string = 'ALL';
  filterStatus: string = 'ALL';
  searchTerm: string = '';
  sortOrder: string = 'DESC'; // DESC = plus récent d'abord, ASC = plus ancien d'abord

  constructor(private couponService: CouponService) {}

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

  loadCoupons(): void {
    this.loading = true;
    this.couponService.getAllCoupons().subscribe({
      next: (data) => {
        this.coupons = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des coupons', error);
        this.loading = false;
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

      const matchStatus = this.filterStatus === 'ALL' ||
        (this.filterStatus === 'ACTIVE' && coupon.actif && !coupon.bloque) ||
        (this.filterStatus === 'BLOCKED' && coupon.bloque);
      
      // Recherche par code, description OU nom du vendeur
      const matchSearch = !this.searchTerm ||
        coupon.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (coupon.vendeurNom && coupon.vendeurNom.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      return matchScope && matchStatus && matchSearch;
    });

    // Tri par date de création
    this.filteredCoupons.sort((a, b) => {
      const dateA = new Date(a.dateCreation).getTime();
      const dateB = new Date(b.dateCreation).getTime();
      return this.sortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
    });
  }

  openCreateForm(): void {
    this.selectedCoupon = null;
    this.showForm = true;
  }

  openEditForm(coupon: Coupon): void {
    this.selectedCoupon = coupon;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedCoupon = null;
  }

  onCouponSaved(): void {
    this.closeForm();
    this.loadCoupons();
  }

  blockCoupon(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir bloquer ce coupon ?')) {
      this.couponService.blockCoupon(id).subscribe({
        next: () => {
          this.loadCoupons();
        },
        error: (error) => {
          console.error('Erreur lors du blocage du coupon', error);
          alert('Erreur lors du blocage du coupon');
        }
      });
    }
  }

  unblockCoupon(id: number): void {
    this.couponService.unblockCoupon(id).subscribe({
      next: () => {
        this.loadCoupons();
      },
      error: (error) => {
        console.error('Erreur lors du déblocage du coupon', error);
        alert('Erreur lors du déblocage du coupon');
      }
    });
  }

  deleteCoupon(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce coupon ? Cette action est irréversible.')) {
      this.couponService.deleteCoupon(id).subscribe({
        next: () => {
          this.loadCoupons();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du coupon', error);
          alert(error.error?.message || 'Erreur lors de la suppression du coupon');
        }
      });
    }
  }

  getReductionText(coupon: Coupon): string {
    const parts: string[] = [];
    
    if (coupon.pourcentageReduction && coupon.pourcentageReduction > 0) {
      parts.push(`-${coupon.pourcentageReduction}%`);
    }
    
    if (coupon.montantFixeReduction && coupon.montantFixeReduction > 0) {
      parts.push(`-${coupon.montantFixeReduction} DT`);
    }
    
    if (coupon.livraisonGratuite) {
      parts.push('Livraison offerte');
    }
    
    return parts.join(' + ') || 'Aucune réduction';
  }

  getStatusClass(coupon: Coupon): string {
    if (coupon.bloque) return 'status-blocked';
    if (!coupon.actif) return 'status-inactive';
    if (coupon.valide) return 'status-active';
    return 'status-expired';
  }

  getStatusText(coupon: Coupon): string {
    if (coupon.bloque) return 'Bloqué';
    if (!coupon.actif) return 'Inactif';
    if (coupon.valide) return 'Actif';
    return 'Expiré';
  }

  isExpired(coupon: Coupon): boolean {
    return new Date(coupon.dateExpiration) < new Date();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
