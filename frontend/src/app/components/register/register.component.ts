import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
    this.initializeForm();
  }

  // Initialisation du formulaire
  private initializeForm(): void {
    this.form = new FormGroup({
      prenom: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl(''),
      motDePasse: new FormControl('', [Validators.required, Validators.minLength(8)]),
      role: new FormControl('CUSTOMER', [Validators.required])
    });
  }

  // Soumission du formulaire d'inscription
  onRegister(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message ?? 'Une erreur est survenue lors de l\'inscription';
      }
    });
  }
}
