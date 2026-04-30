# 📦 Gestion des Commandes par le Vendeur

## ✅ Fonctionnalité Implémentée

Le vendeur peut maintenant **gérer ses commandes** directement depuis l'interface :
- ✅ Voir toutes les commandes contenant ses produits
- ✅ Accepter/Confirmer les commandes en attente
- ✅ Marquer les commandes comme expédiées
- ✅ Marquer les commandes comme livrées
- ✅ Modifier le statut de n'importe quelle commande

---

## 🎯 Interface Vendeur

### Page des Commandes (`/orders`)

Lorsqu'un vendeur se connecte et accède à la page des commandes, il voit :

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 Commandes de mes produits                                   │
│  Gérez les commandes contenant vos produits                    │
├─────────────────────────────────────────────────────────────────┤
│  N° Commande │ Date │ Client │ Montant │ Paiement │ Statut │ Actions │
├──────────────┼──────┼────────┼─────────┼──────────┼────────┼─────────┤
│  CMD-001     │ 30/04│ Martin │  55 DT  │ En att.  │ 🟠 En  │ ✓ ⋮    │
│              │      │        │         │          │ attente│         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔘 Boutons d'Action

### 1. Bouton "Accepter" (✓)
- **Visible quand** : Statut = "En attente"
- **Action** : Change le statut à "Confirmé"
- **Icône** : ✓ (check_circle)
- **Couleur** : Primaire (vert)

### 2. Bouton "Expédier" (🚚)
- **Visible quand** : Statut = "Confirmé"
- **Action** : Change le statut à "En livraison"
- **Icône** : 🚚 (local_shipping)
- **Couleur** : Accent (orange)

### 3. Bouton "Livrer" (✓✓)
- **Visible quand** : Statut = "En livraison"
- **Action** : Change le statut à "Livré"
- **Icône** : ✓✓ (done_all)
- **Couleur** : Primaire (vert)

### 4. Menu "Plus d'options" (⋮)
- **Toujours visible**
- **Contenu** : Tous les statuts possibles
  - ⏰ En attente
  - ✓ Confirmé
  - 🚚 En livraison
  - ✓✓ Livré
  - ✗ Annulé

---

## 🔄 Flux de Travail Typique

### Scénario 1 : Commande Normale

```
1. Client passe commande
   └─> Statut : 🟠 En attente

2. Vendeur clique sur ✓ "Accepter"
   └─> Statut : 🔵 Confirmé

3. Vendeur prépare et expédie
   └─> Clique sur 🚚 "Expédier"
   └─> Statut : 🟣 En livraison

4. Commande arrive chez le client
   └─> Vendeur clique sur ✓✓ "Livrer"
   └─> Statut : 🟢 Livré
```

### Scénario 2 : Commande Annulée

```
1. Client passe commande
   └─> Statut : 🟠 En attente

2. Problème (rupture de stock, etc.)
   └─> Vendeur clique sur ⋮ > ✗ Annulé
   └─> Statut : 🔴 Annulé
```

---

## 🔐 Sécurité

### Contrôles d'Accès

✅ **Le vendeur peut uniquement** :
- Voir les commandes contenant SES produits
- Modifier le statut de SES commandes

❌ **Le vendeur ne peut PAS** :
- Voir les commandes d'autres vendeurs
- Modifier les commandes ne contenant pas ses produits

### Vérifications Backend

```java
// Vérification automatique dans le service
boolean hasSellerProduct = order.getLignes().stream()
    .anyMatch(item -> item.getProduit()
        .getSellerProfile()
        .getUser()
        .getId()
        .equals(vendeur.getId()));

if (!hasSellerProduct) {
    throw new BadRequestException("Vous ne pouvez pas modifier cette commande");
}
```

---

## 📊 Statuts Disponibles

| Statut | Code | Icône | Couleur | Description |
|--------|------|-------|---------|-------------|
| En attente | `EN_ATTENTE` | ⏰ | Orange | Commande reçue, en attente de confirmation |
| Confirmé | `CONFIRME` | ✓ | Bleu | Commande acceptée par le vendeur |
| En livraison | `EN_LIVRAISON` | 🚚 | Violet | Commande expédiée |
| Livré | `LIVRE` | ✓✓ | Vert | Commande livrée au client |
| Annulé | `ANNULE` | ✗ | Rouge | Commande annulée |

---

## 🎨 Interface Utilisateur

### Boutons d'Action Rapide

Les boutons changent dynamiquement selon le statut :

```html
<!-- Si EN_ATTENTE -->
<button mat-icon-button color="primary" matTooltip="Accepter la commande">
  <mat-icon>check_circle</mat-icon>
</button>

<!-- Si CONFIRME -->
<button mat-icon-button color="accent" matTooltip="Marquer comme expédiée">
  <mat-icon>local_shipping</mat-icon>
</button>

<!-- Si EN_LIVRAISON -->
<button mat-icon-button color="primary" matTooltip="Marquer comme livrée">
  <mat-icon>done_all</mat-icon>
</button>
```

### Menu Contextuel

```
┌─────────────────────────┐
│ ⏰ En attente          │
│ ✓ Confirmé             │
│ 🚚 En livraison        │
│ ✓✓ Livré               │
│ ✗ Annulé               │
└─────────────────────────┘
```

---

## 🔧 Implémentation Technique

### Backend

#### Endpoint API

```
PATCH /api/orders/{id}/status
Authorization: Bearer <token>
Roles: ADMIN, SELLER

Body:
{
  "statut": "CONFIRME"
}

Response:
{
  "id": 1,
  "numeroCommande": "CMD-001",
  "statut": "CONFIRME",
  ...
}
```

#### Service

```java
@Transactional
public OrderResponse mettreAJourStatut(Long id, OrderStatus statut, String email) {
    // 1. Récupérer la commande
    Order order = orderRepository.findById(id)...;
    
    // 2. Vérifier les droits du vendeur
    if (isSeller && !isAdmin) {
        boolean hasSellerProduct = ...;
        if (!hasSellerProduct) {
            throw new BadRequestException("...");
        }
    }
    
    // 3. Mettre à jour le statut
    order.setStatut(statut);
    
    // 4. Sauvegarder
    return toResponse(orderRepository.save(order));
}
```

### Frontend

#### Service

```typescript
updateStatus(id: number, statut: string): Observable<Order> {
  return this.http.patch<Order>(`${this.base}/${id}/status`, { statut });
}
```

#### Composant

```typescript
updateStatus(order: Order, statut: string): void {
  this.orderService.updateStatus(order.id, statut).subscribe({
    next: (updated) => {
      // Mettre à jour la liste
      const idx = this.dataSource.data.findIndex(o => o.id === order.id);
      if (idx > -1) {
        const data = [...this.dataSource.data];
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
```

---

## ✅ Fichiers Modifiés

### Backend (2 fichiers)

1. **`OrderController.java`**
   - Modification de l'endpoint `updateStatus`
   - Ajout de `@PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")`
   - Changement du body de `@RequestParam` à `@RequestBody`

2. **`OrderService.java`**
   - Ajout de la méthode `mettreAJourStatut(Long id, OrderStatus statut, String email)`
   - Vérification des droits du vendeur

### Frontend (3 fichiers)

3. **`orders.component.html`**
   - Ajout de la colonne "Actions"
   - Ajout des boutons d'action rapide
   - Ajout du menu contextuel

4. **`orders.component.ts`**
   - Ajout de la colonne "actions" dans `displayedColumns`
   - Ajout de la méthode `getStatusIcon()`

5. **`orders.component.scss`**
   - Ajout des styles pour `.action-buttons`

---

## 🧪 Tests

### Test 1 : Accepter une Commande

1. Connectez-vous en tant que vendeur
2. Allez sur `/orders`
3. Trouvez une commande "En attente"
4. Cliquez sur le bouton ✓ "Accepter"
5. ✅ Le statut passe à "Confirmé"

### Test 2 : Expédier une Commande

1. Trouvez une commande "Confirmé"
2. Cliquez sur le bouton 🚚 "Expédier"
3. ✅ Le statut passe à "En livraison"

### Test 3 : Livrer une Commande

1. Trouvez une commande "En livraison"
2. Cliquez sur le bouton ✓✓ "Livrer"
3. ✅ Le statut passe à "Livré"

### Test 4 : Annuler une Commande

1. Trouvez une commande
2. Cliquez sur ⋮ > ✗ Annulé
3. ✅ Le statut passe à "Annulé"

### Test 5 : Sécurité

1. Essayez de modifier une commande d'un autre vendeur
2. ✅ Erreur : "Vous ne pouvez pas modifier cette commande"

---

## 📱 Responsive

Sur mobile, les boutons s'adaptent :
- Les boutons d'action rapide restent visibles
- Le menu ⋮ est toujours accessible
- Les tooltips s'affichent au toucher

---

## 🎉 Résultat

Le vendeur peut maintenant **gérer complètement ses commandes** :
- ✅ Voir ses commandes
- ✅ Accepter les nouvelles commandes
- ✅ Suivre le processus de livraison
- ✅ Marquer les commandes comme livrées
- ✅ Annuler si nécessaire

**Interface intuitive avec boutons d'action rapide ! 🚀**

---

**Date** : 30 avril 2026  
**Version** : 1.0.0  
**Statut** : ✅ Fonctionnel
