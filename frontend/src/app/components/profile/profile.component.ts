import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userProfile: UserProfile | null = null;
  isLoading = false;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.maxLength(20)]]
    });
  }

  private loadProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.profileForm.patchValue({
          prenom: profile.prenom,
          nom: profile.nom,
          email: profile.email,
          telephone: profile.telephone || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        this.snackBar.open('Erreur lors du chargement du profil', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
        this.isSaving = false;
        this.snackBar.open('Profil mis à jour avec succès', 'Fermer', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        // Mettre à jour le token si l'email a changé
        if (this.authService.getUser()?.email !== updatedProfile.email) {
          // Recharger la page pour mettre à jour le token
          window.location.reload();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        const message = error.error?.message || 'Erreur lors de la mise à jour du profil';
        this.snackBar.open(message, 'Fermer', { 
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        this.isSaving = false;
      }
    });
  }

  resetForm(): void {
    if (this.userProfile) {
      this.profileForm.patchValue({
        prenom: this.userProfile.prenom,
        nom: this.userProfile.nom,
        email: this.userProfile.email,
        telephone: this.userProfile.telephone || ''
      });
    }
  }

  get roleLabel(): string {
    const roleLabels: Record<string, string> = {
      ADMIN: 'Administrateur',
      SELLER: 'Vendeur',
      CUSTOMER: 'Acheteur'
    };
    return roleLabels[this.userProfile?.role || ''] || this.userProfile?.role || '';
  }
}
