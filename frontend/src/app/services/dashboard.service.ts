import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminDashboard, SellerDashboard } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // URL de base de l'API
  private base: string = `${environment.apiUrl}/dashboard`;

  // Injection de dépendances
  constructor(private http: HttpClient) {}

  // Récupération du tableau de bord administrateur
  getAdminDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.base}/admin`);
  }

  // Récupération du tableau de bord vendeur
  getSellerDashboard(): Observable<SellerDashboard> {
    return this.http.get<SellerDashboard>(`${this.base}/seller`);
  }
}
