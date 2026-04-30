import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductRequest, Page, Review, ReviewRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // URL de base de l'API
  private base: string = `${environment.apiUrl}/products`;

  // Injection de dépendances
  constructor(private http: HttpClient) {}

  // Récupération de la liste des produits avec pagination et filtres
  getProducts(params: {
    page?: number;
    size?: number;
    search?: string;
    categoryId?: number | string;
    sortBy?: string;
    sortDir?: string;
  } = {}): Observable<Page<Product>> {
    let p: HttpParams = new HttpParams()
      .set('page', params.page ?? 0)
      .set('size', params.size ?? 12)
      .set('sortBy', params.sortBy ?? 'dateCreation')
      .set('sortDir', params.sortDir ?? 'desc');

    if (params.search) {
      p = p.set('search', params.search);
    }
    if (params.categoryId) {
      p = p.set('categoryId', params.categoryId);
    }

    return this.http.get<Page<Product>>(this.base, { params: p });
  }

  // Récupération de TOUS les produits (admin uniquement)
  getAllProducts(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}): Observable<Page<Product>> {
    let p: HttpParams = new HttpParams()
      .set('page', params.page ?? 0)
      .set('size', params.size ?? 1000)
      .set('sortBy', params.sortBy ?? 'dateCreation')
      .set('sortDir', params.sortDir ?? 'desc');

    return this.http.get<Page<Product>>(`${this.base}/all`, { params: p });
  }

  // Récupération d'un produit par son ID
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  // Récupération des produits du vendeur connecté
  getMyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base}/seller/my-products`);
  }

  // Création d'un nouveau produit
  createProduct(req: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.base, req);
  }

  // Mise à jour d'un produit existant
  updateProduct(id: number, req: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.base}/${id}`, req);
  }

  // Suppression d'un produit
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  // Activation/désactivation d'un produit
  toggleProduct(id: number): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/${id}/toggle`, {});
  }

  // Récupération des avis d'un produit
  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/reviews/product/${productId}`);
  }

  // Ajout d'un avis sur un produit
  addReview(req: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${environment.apiUrl}/reviews`, req);
  }
}
