import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart, AddToCartRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  // URL de base de l'API
  private base: string = `${environment.apiUrl}/cart`;

  // Observable pour le nombre d'articles dans le panier
  private cartCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // Injection de dépendances
  constructor(private http: HttpClient) {}

  // Récupération du panier
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.base).pipe(
      tap(cart => this.cartCount$.next(cart.lignes?.length ?? 0))
    );
  }

  // Ajout d'un article au panier
  addItem(req: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.base}/items`, req).pipe(
      tap(cart => this.cartCount$.next(cart.lignes?.length ?? 0))
    );
  }

  // Mise à jour de la quantité d'un article
  updateItem(lineId: number, quantite: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.base}/items/${lineId}`, { quantite }).pipe(
      tap(cart => this.cartCount$.next(cart.lignes?.length ?? 0))
    );
  }

  // Suppression d'un article du panier
  removeItem(lineId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.base}/items/${lineId}`).pipe(
      tap(cart => this.cartCount$.next(cart.lignes?.length ?? 0))
    );
  }

  // Vidage du panier
  clearCart(): Observable<void> {
    return this.http.delete<void>(this.base).pipe(
      tap(() => this.cartCount$.next(0))
    );
  }

  // Application d'un code promo
  applyCoupon(code: string): Observable<Cart> {
    return this.http.post<Cart>(`${this.base}/coupon`, { code }).pipe(
      tap(cart => this.cartCount$.next(cart.lignes?.length ?? 0))
    );
  }

  // Retrait du code promo
  removeCoupon(): Observable<Cart> {
    return this.http.delete<Cart>(`${this.base}/coupon`).pipe(
      tap(cart => this.cartCount$.next(cart.lignes?.length ?? 0))
    );
  }

  // Observable du nombre d'articles dans le panier
  getCartCount$(): Observable<number> {
    return this.cartCount$.asObservable();
  }

  // Réinitialisation du compteur
  resetCount(): void {
    this.cartCount$.next(0);
  }
}
