import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../models';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, AfterViewInit {
  // Référence au tri Material
  @ViewChild(MatSort) sort!: MatSort;

  // Propriétés de la table
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>();
  displayedColumns: string[] = ['numeroCommande', 'dateCommande', 'montantTotal', 'statut'];
  isLoading: boolean = true;

  // Propriétés de filtrage et sélection
  selectedStatus: string = '';
  expandedOrder: Order | null = null;
  selectedOrder: Order | null = null;

  // Options de statut disponibles
  availableStatuses: Array<{ value: string; label: string }> = [
    { value: 'PENDING',    label: 'En attente' },
    { value: 'PAID',       label: 'Confirmé' },
    { value: 'PROCESSING', label: 'En préparation' },
    { value: 'SHIPPED',    label: 'En livraison' },
    { value: 'DELIVERED',  label: 'Livré' },
    { value: 'CANCELLED',  label: 'Annulé' }
  ];

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
    private orderService: OrderService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.initializeColumns();
    this.loadOrders();
    this.setupFilter();
  }

  // Configuration du filtre personnalisé
  private setupFilter(): void {
    this.dataSource.filterPredicate = (order: Order, filter: string): boolean => {
      // Filtre par statut
      const matchesStatus = !this.selectedStatus || order.statut === this.selectedStatus;
      
      // Filtre par recherche textuelle
      const searchText = filter.toLowerCase();
      const matchesSearch = !searchText || 
        order.numeroCommande.toLowerCase().includes(searchText) ||
        this.getStatusLabel(order.statut).toLowerCase().includes(searchText) ||
        (order.prenomClient ? order.prenomClient.toLowerCase().includes(searchText) : false) ||
        (order.nomClient ? order.nomClient.toLowerCase().includes(searchText) : false);
      
      return matchesStatus && matchesSearch;
    };
  }

  // Initialisation après la vue
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  // Initialisation des colonnes selon le rôle
  private initializeColumns(): void {
    if (this.authService.isAdmin() || this.authService.isSeller()) {
      this.displayedColumns = ['numeroCommande', 'dateCommande', 'client', 'montantTotal', 'statutPaiement', 'statut', 'actions'];
    }
  }

  // Chargement des commandes
  private loadOrders(): void {
    this.isLoading = true;
    
    let operation;
    if (this.authService.isAdmin()) {
      operation = this.orderService.getAllOrders();
    } else if (this.authService.isSeller()) {
      operation = this.orderService.getSellerOrders();
    } else {
      operation = this.orderService.getMyOrders();
    }

    operation.subscribe({
      next: (orders) => {
        this.dataSource.data = orders;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erreur lors du chargement des commandes', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Application du filtre de recherche
  applyFilter(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  // Filtrage par statut
  filterByStatus(): void {
    // Trigger le filtre en changeant la valeur
    this.dataSource.filter = this.dataSource.filter || ' ';
  }

  // Mise à jour du statut d'une commande
  updateStatus(order: Order, statut: string): void {
    this.orderService.updateStatus(order.id, statut).subscribe({
      next: (updated) => {
        const idx: number = this.dataSource.data.findIndex(o => o.id === order.id);
        if (idx > -1) {
          const data: Order[] = [...this.dataSource.data];
          data[idx] = updated;
          this.dataSource.data = data;
        }
        this.snackBar.open('Statut mis à jour avec succès', 'Fermer', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Basculer l'expansion d'une commande
  toggleExpand(order: Order): void {
    this.expandedOrder = this.expandedOrder?.id === order.id ? null : order;
  }

  // Obtenir la classe CSS du statut
  getStatusClass(statut: string): string {
    const map: Record<string, string> = {
      PENDING:    'status-pending',
      PAID:       'status-confirmed',
      PROCESSING: 'status-processing',
      SHIPPED:    'status-shipping',
      DELIVERED:  'status-delivered',
      CANCELLED:  'status-cancelled'
    };
    return map[statut] ?? '';
  }

  // Obtenir le libellé du statut
  getStatusLabel(statut: string): string {
    return this.statusOptions.find(s => s.value === statut)?.label ?? statut;
  }

  // Obtenir la classe CSS du statut de paiement
  getPaymentClass(statutPaiement?: string): string {
    const map: Record<string, string> = {
      EN_ATTENTE: 'payment-pending',
      PAYE:       'payment-paid',
      ECHOUE:     'payment-failed'
    };
    return map[statutPaiement ?? 'EN_ATTENTE'] ?? '';
  }

  // Obtenir le libellé du statut de paiement
  getPaymentLabel(statutPaiement?: string): string {
    const map: Record<string, string> = {
      EN_ATTENTE: 'En attente',
      PAYE:       'Payé',
      ECHOUE:     'Échoué'
    };
    return map[statutPaiement ?? 'EN_ATTENTE'] ?? 'En attente';
  }

  // Obtenir l'icône du statut
  getStatusIcon(statut: string): string {
    const map: Record<string, string> = {
      PENDING:    'schedule',
      PAID:       'check_circle',
      PROCESSING: 'settings',
      SHIPPED:    'local_shipping',
      DELIVERED:  'done_all',
      CANCELLED:  'cancel'
    };
    return map[statut] ?? 'help';
  }

  // Afficher les détails d'une commande
  viewOrder(order: Order): void {
    this.selectedOrder = order;
    // Ouvrir un dialog ou naviguer vers les détails
  }

  // Ouvrir le menu de changement de statut
  openStatusMenu(event: Event, order: Order): void {
    event.stopPropagation();
    this.selectedOrder = order;
    // Ouvrir un menu contextuel pour changer le statut
  }
}
