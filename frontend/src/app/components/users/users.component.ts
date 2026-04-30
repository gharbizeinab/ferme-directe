import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

interface User {
  id: number;
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  role: string;
  actif: boolean;
  dateInscription: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'email', 'telephone', 'role', 'dateInscription', 'actions'];
  dataSource: MatTableDataSource<User>;
  isLoading = true;
  
  // Filtres
  roleFilter: string = 'ALL';
  searchText: string = '';

  // Dialog
  selectedUser: User | null = null;
  showDetailDialog = false;
  isEditMode = false;
  editForm: any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setupFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs', error);
        this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  setupFilters(): void {
    this.dataSource.filterPredicate = (data: User, filter: string): boolean => {
      const searchStr = this.searchText.toLowerCase();
      const matchesSearch = !this.searchText || 
        data.nom.toLowerCase().includes(searchStr) ||
        data.prenom.toLowerCase().includes(searchStr) ||
        data.email.toLowerCase().includes(searchStr);
      
      const matchesRole = this.roleFilter === 'ALL' || data.role === this.roleFilter;
      
      return matchesSearch && matchesRole;
    };
  }

  applyFilter(): void {
    // Trigger filter by updating the filter string
    this.dataSource.filter = Math.random().toString();
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'ADMIN': 'Administrateur',
      'SELLER': 'Vendeur',
      'CUSTOMER': 'Acheteur'
    };
    return labels[role] || role;
  }

  getRoleClass(role: string): string {
    const classes: Record<string, string> = {
      'ADMIN': 'role-admin',
      'SELLER': 'role-seller',
      'CUSTOMER': 'role-customer'
    };
    return classes[role] || '';
  }

  toggleUserStatus(user: User): void {
    this.userService.updateUserStatus(user.id, !user.actif).subscribe({
      next: (updatedUser) => {
        const index = this.dataSource.data.findIndex(u => u.id === user.id);
        if (index > -1) {
          const data = [...this.dataSource.data];
          data[index] = updatedUser;
          this.dataSource.data = data;
        }
        this.snackBar.open(
          `Utilisateur ${updatedUser.actif ? 'activé' : 'désactivé'} avec succès`, 
          'Fermer', 
          { duration: 3000 }
        );
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut', error);
        this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 3000 });
      }
    });
  }

  viewUserDetails(user: User): void {
    this.selectedUser = user;
    this.isEditMode = false;
    this.editForm = {
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      telephone: user.telephone || ''
    };
    this.showDetailDialog = true;
  }

  closeDialog(): void {
    this.showDetailDialog = false;
    this.selectedUser = null;
    this.isEditMode = false;
  }

  enableEditMode(): void {
    this.isEditMode = true;
  }

  cancelEdit(): void {
    if (this.selectedUser) {
      this.editForm = {
        prenom: this.selectedUser.prenom,
        nom: this.selectedUser.nom,
        email: this.selectedUser.email,
        telephone: this.selectedUser.telephone || ''
      };
    }
    this.isEditMode = false;
  }

  saveUserChanges(): void {
    if (!this.selectedUser) return;

    // TODO: Implémenter l'appel API pour mettre à jour l'utilisateur
    // Pour l'instant, on simule la mise à jour
    const updatedUser = {
      ...this.selectedUser,
      ...this.editForm
    };

    const index = this.dataSource.data.findIndex(u => u.id === this.selectedUser!.id);
    if (index > -1) {
      const data = [...this.dataSource.data];
      data[index] = updatedUser;
      this.dataSource.data = data;
    }

    this.selectedUser = updatedUser;
    this.isEditMode = false;
    this.snackBar.open('Utilisateur mis à jour avec succès', 'Fermer', { duration: 3000 });
  }

  getTotalUsers(): number {
    return this.dataSource.data.length;
  }

  getUsersByRole(role: string): number {
    return this.dataSource.data.filter(u => u.role === role).length;
  }
}
