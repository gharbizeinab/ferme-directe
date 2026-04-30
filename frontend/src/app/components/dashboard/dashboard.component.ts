import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { AdminDashboard, SellerDashboard } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Propriétés de chargement et données
  isLoading: boolean = true;
  adminData: AdminDashboard | null = null;
  sellerData: SellerDashboard | null = null;

  // Colonnes affichées pour les tables
  displayedColumnsAdmin: string[] = ['numeroCommande', 'dateCommande', 'nomClient', 'total', 'statut'];
  displayedColumnsSeller: string[] = ['numeroCommande', 'dateCommande', 'total', 'statut'];
  adminColumns: string[] = ['numeroCommande', 'client', 'montant', 'statut', 'date'];
  sellerColumns: string[] = ['numeroCommande', 'montant', 'statut', 'date'];

  // Options de statut
  statusOptions: Array<{ value: string; label: string }> = [
    { value: 'PENDING',    label: 'En attente' },
    { value: 'PAID',       label: 'Confirmé' },
    { value: 'PROCESSING', label: 'En préparation' },
    { value: 'SHIPPED',    label: 'En livraison' },
    { value: 'DELIVERED',  label: 'Livré' },
    { value: 'CANCELLED',  label: 'Annulé' }
  ];

  // Injection de dépendances
  constructor(
    private dashService: DashboardService,
    public authService: AuthService
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.loadDashboard();
  }

  // Chargement du tableau de bord selon le rôle
  private loadDashboard(): void {
    if (this.authService.isAdmin()) {
      this.loadAdminDashboard();
    } else {
      this.loadSellerDashboard();
    }
  }

  // Chargement du tableau de bord administrateur
  private loadAdminDashboard(): void {
    this.isLoading = true;
    this.dashService.getAdminDashboard().subscribe({
      next: (data) => {
        this.adminData = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error('Erreur lors du chargement du tableau de bord administrateur');
      }
    });
  }

  // Chargement du tableau de bord vendeur
  private loadSellerDashboard(): void {
    this.isLoading = true;
    this.dashService.getSellerDashboard().subscribe({
      next: (data) => {
        console.log('Données du dashboard vendeur:', data);
        this.sellerData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur lors du chargement du tableau de bord vendeur', err);
      }
    });
  }

  // Obtenir la classe CSS du statut
  getStatusClass(statut: string): string {
    const map: Record<string, string> = {
      EN_ATTENTE:   'status-pending',
      CONFIRME:     'status-confirmed',
      EN_LIVRAISON: 'status-shipping',
      LIVRE:        'status-delivered',
      ANNULE:       'status-cancelled'
    };
    return map[statut] ?? '';
  }

  // Obtenir le libellé du statut
  getStatusLabel(statut: string): string {
    return this.statusOptions.find(s => s.value === statut)?.label ?? statut;
  }

  // Calculer la hauteur de la barre pour le graphique
  getBarHeight(revenu: number): number {
    if (!this.sellerData || !this.sellerData.revenusParJour) return 0;
    const maxRevenu = Math.max(...this.sellerData.revenusParJour.map(j => j.revenu), 1);
    return (revenu / maxRevenu) * 100;
  }

  // Formater la date pour l'affichage
  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[date.getDay()];
  }

  // Générer les points pour la courbe SVG
  getChartPoints(): Array<{x: number, y: number}> {
    if (!this.sellerData || !this.sellerData.revenusParJour) return [];
    
    const data = this.sellerData.revenusParJour;
    const maxRevenu = Math.max(...data.map(j => j.revenu), 1);
    const width = 500;
    const height = 160;
    const padding = 20;
    
    return data.map((jour, index) => ({
      x: padding + (index * (width - 2 * padding) / (data.length - 1)),
      y: height - padding - ((jour.revenu / maxRevenu) * (height - 2 * padding))
    }));
  }

  // Générer le chemin SVG pour la courbe
  getCurvePath(): string {
    const points = this.getChartPoints();
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` Q ${cpx} ${prev.y}, ${cpx} ${(prev.y + curr.y) / 2}`;
      path += ` Q ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    
    return path;
  }

  // Générer le chemin SVG pour l'aire sous la courbe
  getAreaPath(): string {
    const points = this.getChartPoints();
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} 180`;
    path += ` L ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` Q ${cpx} ${prev.y}, ${cpx} ${(prev.y + curr.y) / 2}`;
      path += ` Q ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    
    path += ` L ${points[points.length - 1].x} 180 Z`;
    return path;
  }
}
