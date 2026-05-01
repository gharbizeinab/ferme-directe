// src/app/models/coupon.model.ts

export enum CouponScope {
  GLOBAL = 'GLOBAL',
  SELLER = 'SELLER'
}

export interface Seller {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  nomComplet: string;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  
  // Réductions
  pourcentageReduction?: number;
  montantFixeReduction?: number;
  livraisonGratuite: boolean;
  
  // Conditions
  montantMinimum?: number;
  montantMaximumReduction?: number;
  categoriesApplicables: number[];
  
  // Portée
  scope: CouponScope;
  vendeurId?: number;
  vendeurNom?: string;
  
  // Limites
  usagesMaxGlobal: number;
  usagesActuels: number;
  usagesMaxParUtilisateur: number;
  
  // Dates
  dateDebut: string;
  dateExpiration: string;
  dateCreation: string;
  
  // Statut
  actif: boolean;
  bloque: boolean;
  valide: boolean;
  
  // Statistiques
  montantTotalEconomise?: number;
}

export interface CouponRequest {
  code: string;
  description: string;
  pourcentageReduction?: number;
  montantFixeReduction?: number;
  livraisonGratuite: boolean;
  montantMinimum?: number;
  montantMaximumReduction?: number;
  categoriesApplicables?: number[];
  scope: CouponScope;
  sellerId?: number | null;
  usagesMaxGlobal: number;
  usagesMaxParUtilisateur: number;
  dateDebut: string;
  dateExpiration: string;
}

export interface CouponValidation {
  valide: boolean;
  message: string;
  reductionPourcentage?: number;
  reductionMontantFixe?: number;
  reductionLivraison?: number;
  reductionTotale?: number;
  sousTotal?: number;
  fraisLivraison?: number;
  totalAvantCoupon?: number;
  totalApresCoupon?: number;
  codeApplique?: string;
}

export interface CouponStats {
  couponId: number;
  code: string;
  nombreUtilisations: number;
  montantTotalEconomise: number;
  tauxUtilisation: number;
  nombreUtilisateursUniques: number;
}
