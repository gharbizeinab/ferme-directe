// ============================================================
// FermeDirecte — TypeScript Models
// ============================================================

// --- Auth ---
export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  motDePasse: string;
  role: 'CUSTOMER' | 'SELLER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  role: string;
}

// --- Category ---
export interface Category {
  id: number;
  nom: string;
  description?: string;
  parentId?: number;
  sousCategories?: Category[];
}

export interface CategoryRequest {
  nom: string;
  description?: string;
  parentId?: number;
}

// --- Product ---
export interface ProductVariant {
  id?: number;
  nom: string;
  prix: number;
  stock: number;
}

export interface Product {
  id: number;
  nom: string;
  description?: string;
  prix: number;
  prixPromo?: number;
  stock: number;
  unite?: string;
  imageUrl?: string;
  category?: string;
  categoryId?: number;
  nomVendeur?: string;
  noteMoyenne: number;
  nombreAvis: number;
  actif: boolean;
  variantes?: ProductVariant[];
  dateCreation?: string;
}

export interface ProductRequest {
  nom: string;
  description?: string;
  prix: number;
  prixPromo?: number;
  stock: number;
  unite?: string;
  imageUrl?: string;
  categoryId?: number;
  variantes?: ProductVariant[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// --- Cart ---
export interface CartLine {
  id: number;
  produitId: number;
  nomProduit: string;
  imageUrl?: string;
  infoVariante?: string;
  prixUnitaire: number;
  quantite: number;
  sousTotal: number;
}

export interface Cart {
  id: number;
  lignes: CartLine[];
  sousTotal: number;
  remise: number;
  total: number;
  fraisLivraison?: number;
  codeCoupon?: string;
}

export interface AddToCartRequest {
  produitId: number;
  varianteId?: number;
  quantite: number;
}

// --- Address ---
export interface Address {
  id?: number;
  prenom: string;
  nom: string;
  rue: string;
  codePostal: string;
  ville: string;
  gouvernorat?: string;
  pays: string;
  telephone?: string;
  instructions?: string;
  principale?: boolean;
  principal?: boolean;  // Alias pour compatibilité backend
  sauvegarder?: boolean;
}

// --- Order ---
export interface OrderLine {
  id: number;
  produitId: number;
  nomProduit: string;
  imageUrl?: string;
  infoVariante?: string;
  prixUnitaire: number;
  quantite: number;
  sousTotal: number;
}

export interface Order {
  id: number;
  numeroCommande: string;
  dateCommande: string;
  statut: string;
  statutPaiement?: string;
  adresseLivraison: Address;
  lignes: OrderLine[];
  sousTotal: number;
  remise: number;
  fraisLivraison: number;
  totalTTC: number;
  modePaiement?: string;
  notes?: string;
  nomClient?: string;
  prenomClient?: string;
}

export interface OrderRequest {
  adresse: Address;
  modePaiement: string;
  codeCoupon?: string;
  notes?: string;
}

// --- Review ---
export interface Review {
  id: number;
  note: number;
  commentaire?: string;
  nomAuteur: string;
  dateCreation: string;
}

export interface ReviewRequest {
  produitId: number;
  note: number;
  commentaire?: string;
}

// --- User Profile ---
export interface UserProfile {
  id: number;
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  role: string;
  dateCreation: string;
  adresses: Address[];
}

export interface UserProfileRequest {
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
}

// --- Dashboard ---
export interface AdminDashboard {
  totalUtilisateurs: number;
  totalCommandes: number;
  totalProduits: number;
  chiffreAffairesGlobal: number;
  
  // Croissances (%)
  croissanceUtilisateurs?: number;
  croissanceCommandes?: number;
  croissanceProduits?: number;
  croissanceCA?: number;
  
  commandesRecentes: any[];
  produitsRecents?: any[];
  ventesParCategorie?: { categorie: string; total: number }[];
  topProduits?: any[];
}

export interface SellerDashboard {
  totalProduits: number;
  commandesEnAttente: number;
  revenuTotal: number;
  produitsStockFaible: number;
  stockFaible: Array<{ id: number; nom: string; stock: number; prix: number }>;
  commandesRecentes: Array<{ id: number; numeroCommande: string; statut: string; totalTTC: number; dateCommande: string }>;
  revenusParJour: Array<{ date: string; revenu: number }>;
  statistiquesCommandes: {
    total: number;
    enAttente: number;
    confirmees: number;
    enLivraison: number;
    livrees: number;
    annulees: number;
  };
}

// --- Coupon ---
export * from './coupon.model';
