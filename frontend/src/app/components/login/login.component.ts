import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Propriétés du formulaire
  form!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  hidePassword: boolean = true;

  // Injection de dépendances
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.checkAuthentication();
    this.initializeForm();
  }

  // Vérification de l'authentification
  private checkAuthentication(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/products']);
    }
  }

  // Initialisation du formulaire
  private initializeForm(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      motDePasse: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  // Soumission du formulaire de connexion
  onLogin(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.form.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message ?? 'Email ou mot de passe incorrect';
      }
    });
  }
}
