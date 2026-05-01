// Angular core imports
import { Component, OnInit } from '@angular/core';

// Chart.js imports
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

// Services
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';

// Models
import { AdminDashboard, SellerDashboard } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Public properties
  isLoading: boolean = true;
  adminData: AdminDashboard | null = null;
  sellerData: SellerDashboard | null = null;

  // Admin Charts
  adminRevenueChartData!: ChartConfiguration<'line'>['data'];
  adminRevenueChartOptions!: ChartConfiguration<'line'>['options'];
  
  adminOrdersChartData!: ChartData<'pie'>;
  adminOrdersChartOptions!: ChartConfiguration<'pie'>['options'];
  
  adminUsersChartData!: ChartData<'doughnut'>;
  adminUsersChartOptions!: ChartConfiguration<'doughnut'>['options'];

  // Seller Charts
  sellerRevenueChartData!: ChartConfiguration<'line'>['data'];
  sellerRevenueChartOptions!: ChartConfiguration<'line'>['options'];
  
  sellerOrdersChartData!: ChartData<'pie'>;
  sellerOrdersChartOptions!: ChartConfiguration<'pie'>['options'];

  // Constructor
  constructor(
    private dashService: DashboardService,
    public authService: AuthService
  ) {}

  // Lifecycle hooks
  ngOnInit(): void {
    this.loadDashboard();
  }

  // Public methods
  getStatusClass(statut: string): string {
    const map: Record<string, string> = {
      PENDING: 'status-pending',
      PAID: 'status-confirmed',
      PROCESSING: 'status-processing',
      SHIPPED: 'status-shipping',
      DELIVERED: 'status-delivered',
      CANCELLED: 'status-cancelled',
      EN_ATTENTE: 'status-pending',
      CONFIRME: 'status-confirmed',
      EN_LIVRAISON: 'status-shipping',
      LIVRE: 'status-delivered',
      ANNULE: 'status-cancelled'
    };
    return map[statut] ?? '';
  }

  getStatusLabel(statut: string): string {
    const map: Record<string, string> = {
      'PENDING': 'En attente',
      'PAID': 'Confirmé',
      'PROCESSING': 'En préparation',
      'SHIPPED': 'En livraison',
      'DELIVERED': 'Livré',
      'CANCELLED': 'Annulé'
    };
    return map[statut] ?? statut;
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-out';
    if (stock < 10) return 'stock-low';
    if (stock < 20) return 'stock-medium';
    return 'stock-good';
  }

  // Private methods
  private loadDashboard(): void {
    if (this.authService.isAdmin()) {
      this.loadAdminDashboard();
    } else {
      this.loadSellerDashboard();
    }
  }

  private loadAdminDashboard(): void {
    this.isLoading = true;
    this.dashService.getAdminDashboard().subscribe({
      next: (data) => {
        this.adminData = data;
        this.initializeAdminCharts(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error('Erreur lors du chargement du tableau de bord administrateur');
      }
    });
  }

  private loadSellerDashboard(): void {
    this.isLoading = true;
    this.dashService.getSellerDashboard().subscribe({
      next: (data) => {
        this.sellerData = data;
        this.initializeSellerCharts(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error('Erreur lors du chargement du tableau de bord vendeur');
      }
    });
  }

  private initializeAdminCharts(data: AdminDashboard): void {
    // Line Chart - Évolution du CA mensuel (VRAIES DONNÉES)
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const revenueLabels = data.revenusParMois?.map(r => {
      const monthIndex = this.getMonthIndex(r.mois);
      return monthNames[monthIndex];
    }) || monthNames;
    
    const revenueData = data.revenusParMois?.map(r => r.revenu) || [];

    this.adminRevenueChartData = {
      labels: revenueLabels,
      datasets: [{
        label: 'Chiffre d\'affaires (DT)',
        data: revenueData,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };

    this.adminRevenueChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} DT`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value} DT`
          }
        }
      }
    };

    // Pie Chart - Commandes par statut (PLUS LISIBLE)
    const commandesStats = data.commandesParStatut || { EN_ATTENTE: 0, EN_COURS: 0, LIVRE: 0, ANNULE: 0 };
    
    this.adminOrdersChartData = {
      labels: ['En attente', 'En cours', 'Livré', 'Annulé'],
      datasets: [{
        data: [
          commandesStats.EN_ATTENTE || 0,
          commandesStats.EN_COURS || 0,
          commandesStats.LIVRE || 0,
          commandesStats.ANNULE || 0
        ],
        backgroundColor: [
          '#FF9800',
          '#2196F3',
          '#4CAF50',
          '#F44336'
        ],
        borderColor: '#fff',
        borderWidth: 3
      }]
    };

    this.adminOrdersChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed;
              const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
              return `${label}: ${Math.round(value)} (${percentage}%)`;
            }
          }
        }
      }
    };

    // Donut Chart - Utilisateurs par rôle (VRAIES DONNÉES)
    const usersStats = data.utilisateursParRole || { CUSTOMER: 0, SELLER: 0, ADMIN: 0 };
    
    this.adminUsersChartData = {
      labels: ['Clients', 'Vendeurs', 'Admins'],
      datasets: [{
        data: [
          usersStats.CUSTOMER || 0,
          usersStats.SELLER || 0,
          usersStats.ADMIN || 0
        ],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FF9800'
        ],
        borderColor: '#fff',
        borderWidth: 3
      }]
    };

    this.adminUsersChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
              return `${label}: ${Math.round(value)} (${percentage}%)`;
            }
          }
        }
      }
    };
  }

  // Méthode utilitaire pour convertir le nom du mois en index
  private getMonthIndex(monthName: string): number {
    const months: Record<string, number> = {
      'JANUARY': 0, 'FEBRUARY': 1, 'MARCH': 2, 'APRIL': 3,
      'MAY': 4, 'JUNE': 5, 'JULY': 6, 'AUGUST': 7,
      'SEPTEMBER': 8, 'OCTOBER': 9, 'NOVEMBER': 10, 'DECEMBER': 11
    };
    return months[monthName.toUpperCase()] || 0;
  }

  private initializeSellerCharts(data: SellerDashboard): void {
    // Line Chart - Revenus du vendeur
    const labels = data.revenusParJour?.map(r => {
      const date = new Date(r.date);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    }) || [];

    const revenues = data.revenusParJour?.map(r => r.revenu) || [];

    this.sellerRevenueChartData = {
      labels: labels,
      datasets: [{
        label: 'Revenus (DT)',
        data: revenues,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };

    this.sellerRevenueChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} DT`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value} DT`
          }
        }
      }
    };

    // Pie Chart - Commandes par statut (vendeur) - PLUS LISIBLE
    const stats = data.statistiquesCommandes;
    this.sellerOrdersChartData = {
      labels: ['En attente', 'Confirmées', 'En livraison', 'Livrées', 'Annulées'],
      datasets: [{
        data: [
          stats?.enAttente || 0,
          stats?.confirmees || 0,
          stats?.enLivraison || 0,
          stats?.livrees || 0,
          stats?.annulees || 0
        ],
        backgroundColor: [
          '#FF9800',
          '#2196F3',
          '#9C27B0',
          '#4CAF50',
          '#F44336'
        ],
        borderColor: '#fff',
        borderWidth: 3
      }]
    };

    this.sellerOrdersChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed;
              const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
              return `${label}: ${Math.round(value)} (${percentage}%)`;
            }
          }
        }
      }
    };
  }

}
