import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, CategoryRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  // URL de base de l'API
  private base: string = `${environment.apiUrl}/categories`;

  // Injection de dépendances
  constructor(private http: HttpClient) {}

  // Récupération de toutes les catégories (arbre hiérarchique)
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.base);
  }

  // Récupération d'une catégorie par ID
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.base}/${id}`);
  }

  // Création d'une nouvelle catégorie
  create(req: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.base, req);
  }

  // Mise à jour d'une catégorie existante
  update(id: number, req: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.base}/${id}`, req);
  }

  // Suppression d'une catégorie
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
