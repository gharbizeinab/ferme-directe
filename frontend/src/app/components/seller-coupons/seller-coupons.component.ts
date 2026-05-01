// src/app/components/seller-coupons/seller-coupons.component.ts
import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../services/coupon.service';
import { Coupon, CouponStats } from '../../models/coupon.model';

@Component({
  selector: 'app-seller-coupons',
  templateUrl: './seller-coupons.component.html',
  styleUrls: ['./seller-coupons.component.css']
})
export class SellerCouponsComponent implements OnInit {
  coupons: Coupon[] = [];
  filteredCoupons: Coupon[] = [];
  loading = false;
  showForm = false;
  selectedCoupon: Coupon | null = null;
  selectedCouponStats: CouponStats | null = null;
  showStatsModal = false;
  sortOrder: string = 'DESC'; // DESC = plus récent d'abord, ASC = plus ancien d'abord

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.loadMyCoupons();
  }

  loadMyCoupons(): void {
    this.loading = true;
    this.couponService.getMyCoupons().subscribe({
      next: (data) => {
        this.coupons = data;
        this.applySorting();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des coupons', error);
        this.loading = false;
      }
    });
  }

  applySorting(): void {
    this.filteredCoupons = [...this.coupons];
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
    this.loadMyCoupons();
  }

  toggleStatus(id: number): void {
    this.couponService.toggleMyCouponStatus(id).subscribe({
      next: () => {
        this.loadMyCoupons();
      },
      error: (error) => {
        console.error('Erreur lors du changement de statut', error);
        alert('Erreur lors du changement de statut');
      }
    });
  }

  deleteCoupon(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce coupon ?')) {
      this.couponService.deleteMyCoupon(id).subscribe({
        next: () => {
          this.loadMyCoupons();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          alert(error.error?.message || 'Erreur lors de la suppression');
        }
      });
    }
  }

  viewStats(id: number): void {
    this.couponService.getMyCouponStats(id).subscribe({
      next: (stats) => {
        this.selectedCouponStats = stats;
        this.showStatsModal = true;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques', error);
      }
    });
  }

  closeStatsModal(): void {
    this.showStatsModal = false;
    this.selectedCouponStats = null;
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
    if (!coupon.actif) return 'status-inactive';
    if (coupon.valide) return 'status-active';
    return 'status-expired';
  }

  getStatusText(coupon: Coupon): string {
    if (!coupon.actif) return 'Inactif';
    if (coupon.valide) return 'Actif';
    return 'Expiré';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  getUsagePercentage(coupon: Coupon): number {
    return (coupon.usagesActuels / coupon.usagesMaxGlobal) * 100;
  }
}
