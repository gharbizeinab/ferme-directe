import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  // Propriétés du composant
  cartCount: number = 0;
  isMobile: boolean = false;

  // Injection de dépendances
  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.checkMobile();
    this.initializeCart();
  }

  // Initialisation du panier
  private initializeCart(): void {
    if (this.authService.isLoggedIn()) {
      this.cartService.getCartCount$().subscribe(count => {
        this.cartCount = count;
      });
      this.cartService.getCart().subscribe();
    }
  }

  // Détection du mode mobile
  @HostListener('window:resize')
  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    this.cartService.resetCount();
    this.authService.logout();
  }

  // Récupération de l'email de l'utilisateur
  get userEmail(): string {
    return this.authService.getUser()?.email ?? '';
  }

  // Récupération du rôle de l'utilisateur avec libellé
  get userRole(): string {
    const role: string = this.authService.getRole();
    const roleLabels: Record<string, string> = {
      ADMIN: 'Admin',
      SELLER: 'Vendeur',
      CUSTOMER: 'Acheteur'
    };
    return roleLabels[role] ?? role;
  }
}
