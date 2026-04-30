import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Clés de stockage local
  private readonly TOKEN_KEY: string = 'fd_token';
  private readonly USER_KEY: string = 'fd_user';

  // Observable pour l'état de connexion
  private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());

  // Injection de dépendances
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // ---- Appels HTTP ----

  // Connexion de l'utilisateur
  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, req).pipe(
      tap(res => this.saveSession(res))
    );
  }

  // Inscription d'un nouvel utilisateur
  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, req).pipe(
      tap(res => this.saveSession(res))
    );
  }

  // ---- Gestion de session ----

  // Sauvegarde de la session utilisateur
  private saveSession(res: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    this.loggedIn$.next(true);
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.loggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  // Récupération du token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Vérification de la présence du token
  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // Récupération des informations utilisateur
  getUser(): AuthResponse | null {
    const raw: string | null = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  // ---- Guards et vérifications de rôle ----

  // Vérification de la connexion
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // Observable de l'état de connexion
  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  // Récupération du rôle utilisateur
  getRole(): string {
    return this.getUser()?.role ?? '';
  }

  // Vérification du rôle administrateur
  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  // Vérification du rôle vendeur
  isSeller(): boolean {
    return this.getRole() === 'SELLER';
  }

  // Vérification du rôle client
  isCustomer(): boolean {
    return this.getRole() === 'CUSTOMER';
  }
}
