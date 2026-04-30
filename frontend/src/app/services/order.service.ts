import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, OrderRequest, Address } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  // URLs de base de l'API
  private base: string = `${environment.apiUrl}/orders`;
  private addrBase: string = `${environment.apiUrl}/addresses`;

  // Injection de dépendances
  constructor(private http: HttpClient) {}

  // Récupération des commandes de l'utilisateur connecté
  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/my-orders`);
  }

  // Récupération des commandes du vendeur
  getSellerOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.base}/seller-orders`);
  }

  // Récupération de toutes les commandes (admin)
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.base);
  }

  // Récupération d'une commande par son ID
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.base}/${id}`);
  }

  // Création d'une nouvelle commande
  createOrder(req: OrderRequest): Observable<Order> {
    return this.http.post<Order>(this.base, req);
  }

  // Mise à jour du statut d'une commande
  updateStatus(id: number, statut: string): Observable<Order> {
    return this.http.patch<Order>(`${this.base}/${id}/status`, { statut });
  }

  // Récupération des adresses de l'utilisateur
  getMyAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.addrBase);
  }

  // Sauvegarde d'une nouvelle adresse
  saveAddress(addr: Address): Observable<Address> {
    return this.http.post<Address>(this.addrBase, addr);
  }
}
