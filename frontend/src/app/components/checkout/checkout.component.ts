import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { Address, Cart } from '../../models';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  // Référence au stepper Material
  @ViewChild('stepper') stepper!: MatStepper;

  // Formulaires
  addressForm!: FormGroup;
  paymentForm!: FormGroup;

  // Propriétés du panier et adresses
  cart: Cart | null = null;
  savedAddresses: Address[] = [];
  selectedAddress: Address | null = null;

  // États de chargement et de soumission
  isPlacing: boolean = false;
  isPlacingOrder: boolean = false;
  orderSuccess: boolean = false;
  orderPlaced: boolean = false;
  orderNumber: string = '';
  checkoutError: string = '';

  // Injection de dépendances
  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.initializeForms();
    this.loadCart();
    this.loadSavedAddresses();
  }

  // Initialisation des formulaires
  private initializeForms(): void {
    this.addressForm = new FormGroup({
      prenom: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      rue: new FormControl('', [Validators.required]),
      codePostal: new FormControl('', [Validators.required]),
      ville: new FormControl('', [Validators.required]),
      gouvernorat: new FormControl(''),
      pays: new FormControl('Tunisie', [Validators.required]),
      telephone: new FormControl(''),
      instructions: new FormControl(''),
      sauvegarder: new FormControl(false)
    });

    this.paymentForm = new FormGroup({
      modePaiement: new FormControl('ESPECES', [Validators.required]),
      notes: new FormControl('')
    });
  }

  // Chargement du panier
  private loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement du panier', 'Fermer', { duration: 2500 });
      }
    });
  }

  // Chargement des adresses sauvegardées
  private loadSavedAddresses(): void {
    this.orderService.getMyAddresses().subscribe({
      next: (addresses) => {
        this.savedAddresses = addresses;
      },
      error: () => {
        console.error('Erreur lors du chargement des adresses');
      }
    });
  }


  // Sélection d'une adresse sauvegardée
  selectSavedAddress(address: Address): void {
    this.selectedAddress = address;
    this.addressForm.patchValue(address);
  }

  // Passage de la commande
  placeOrder(): void {
    if (this.addressForm.invalid || this.paymentForm.invalid) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', { duration: 2500 });
      return;
    }

    this.isPlacing = true;
    this.isPlacingOrder = true;
    this.checkoutError = '';

    this.orderService.createOrder({
      adresse: this.addressForm.value,
      modePaiement: this.paymentForm.value.modePaiement,
      notes: this.paymentForm.value.notes
    }).subscribe({
      next: (order) => {
        this.isPlacing = false;
        this.isPlacingOrder = false;
        this.orderSuccess = true;
        this.orderPlaced = true;
        this.orderNumber = order.numeroCommande;
        this.cartService.resetCount();
        this.snackBar.open('Commande passée avec succès !', 'Fermer', { duration: 3000 });
      },
      error: (err) => {
        this.isPlacing = false;
        this.isPlacingOrder = false;
        this.checkoutError = err.error?.message ?? 'Erreur lors de la commande';
        this.snackBar.open(this.checkoutError, 'Fermer', { duration: 3000 });
      }
    });
  }

  // Récupération de l'adresse de livraison
  getDeliveryAddress(): Address | null {
    if (this.selectedAddress) {
      return this.selectedAddress;
    }
    if (this.addressForm.valid) {
      return this.addressForm.value;
    }
    return null;
  }

  // Libellé du mode de paiement
  getPaymentLabel(): string {
    const mode = this.paymentForm.get('modePaiement')?.value;
    const labels: Record<string, string> = {
      CARTE: 'Carte bancaire',
      ESPECES: 'Paiement à la livraison',
      VIREMENT: 'Virement bancaire',
      CASH_ON_DELIVERY: 'Paiement à la livraison'
    };
    return labels[mode] ?? mode;
  }

  // Navigation vers les commandes
  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  // Getters pour le template
  get cartTotal(): number {
    return this.cart?.total ?? 0;
  }

  get cartLines(): number {
    return this.cart?.lignes?.length ?? 0;
  }
}
