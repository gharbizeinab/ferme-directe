# 🔄 Modifications du OrderService pour les Coupons Hybrides

## Modifications nécessaires

Le `OrderService` actuel utilise l'ancien système de coupons. Voici les modifications à apporter pour intégrer le nouveau système de coupons hybrides.

## 1. Ajouter la dépendance CouponService

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    // ... autres dépendances
    private final CouponService couponService;  // AJOUTER CETTE LIGNE
}
```

## 2. Modifier la méthode passerCommande

Remplacer la section de gestion du coupon par :

```java
// Calcul sousTotal
BigDecimal sousTotal = cart.getLignes().stream().map(item -> {
    BigDecimal prix = item.getProduit().getPrix();
    if (item.getVariante() != null) {
        prix = prix.add(item.getVariante().getPrixDelta());
    }
    return prix.multiply(BigDecimal.valueOf(item.getQuantite()));
}).reduce(BigDecimal.ZERO, BigDecimal::add);

// Frais de livraison par défaut
BigDecimal fraisLivraison = BigDecimal.valueOf(10.0);  // À adapter selon votre logique

// Gestion du coupon hybride
Coupon coupon = null;
BigDecimal totalTTC = sousTotal.add(fraisLivraison);

if (request.getCodeCoupon() != null && !request.getCodeCoupon().isBlank()) {
    log.debug("Application du coupon: {}", request.getCodeCoupon());
    
    // Récupérer les IDs des catégories des produits du panier
    List<Long> categoryIds = cart.getLignes().stream()
            .map(item -> item.getProduit().getCategorie().getId())
            .distinct()
            .collect(Collectors.toList());
    
    // Valider le coupon
    CouponValidationResponse validation = couponService.validateCoupon(
        request.getCodeCoupon(),
        user.getId(),
        sousTotal,
        fraisLivraison,
        categoryIds
    );
    
    if (!validation.getValide()) {
        throw new BadRequestException(validation.getMessage());
    }
    
    // Récupérer le coupon
    coupon = couponRepository.findByCodeIgnoreCase(request.getCodeCoupon())
            .orElseThrow(() -> new BadRequestException("Coupon invalide"));
    
    // Utiliser les montants calculés par le service
    fraisLivraison = validation.getFraisLivraison();
    totalTTC = validation.getTotalApresCoupon();
    
    log.debug("Coupon appliqué - Économie: {} DT", validation.getReductionTotale());
}

// Créer commande
Order order = Order.builder()
        .client(user)
        .adresseLivraison(adresse)
        .coupon(coupon)
        .numeroCommande("ORD-" + Year.now().getValue() + "-" +
                String.format("%05d", new Random().nextInt(99999)))
        .statut(OrderStatus.PENDING)
        .statutPaiement(PaymentStatus.PENDING)
        .sousTotal(sousTotal)
        .fraisLivraison(fraisLivraison)
        .totalTTC(totalTTC)
        .build();

// ... reste du code (lignes de commande, etc.)

// IMPORTANT: Après la sauvegarde de la commande, enregistrer l'utilisation du coupon
if (coupon != null) {
    couponService.applyCoupon(request.getCodeCoupon(), user.getId(), order);
    log.debug("Utilisation du coupon enregistrée");
}

// Vider le panier
cart.getLignes().clear();
cartRepository.save(cart);

return toResponse(order);
```

## 3. Mettre à jour OrderRequest

Assurez-vous que `OrderRequest` a le champ `codeCoupon` :

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Long adresseId;
    private AddressRequest adresse;
    private String modePaiement;
    private String notes;
    private String codeCoupon;  // AJOUTER SI ABSENT
}
```

## 4. Mettre à jour OrderResponse

Ajouter les informations du coupon dans la réponse :

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private String numeroCommande;
    private OrderStatus statut;
    private PaymentStatus statutPaiement;
    private List<OrderItemResponse> lignes;
    private BigDecimal sousTotal;
    private BigDecimal fraisLivraison;
    private BigDecimal totalTTC;
    private LocalDateTime dateCommande;
    
    // AJOUTER CES CHAMPS
    private String codeCoupon;
    private BigDecimal montantRemise;
}
```

## 5. Mettre à jour la méthode toResponse

```java
private OrderResponse toResponse(Order o) {
    List<OrderItemResponse> lignes = o.getLignes().stream().map(item ->
            OrderItemResponse.builder()
                    .nomProduit(item.getProduit().getNom())
                    .infoVariante(item.getVariante() != null
                            ? item.getVariante().getAttribut() + " : " + item.getVariante().getValeur()
                            : null)
                    .quantite(item.getQuantite())
                    .prixUnitaire(item.getPrixUnitaire())
                    .build()
    ).collect(Collectors.toList());

    // Calculer la remise si un coupon a été appliqué
    BigDecimal montantRemise = BigDecimal.ZERO;
    String codeCoupon = null;
    
    if (o.getCoupon() != null) {
        codeCoupon = o.getCoupon().getCode();
        // Calculer la remise : (sousTotal + fraisLivraison initial) - totalTTC
        // Note: fraisLivraison initial = 10 DT (à adapter selon votre logique)
        BigDecimal totalSansRemise = o.getSousTotal().add(BigDecimal.valueOf(10.0));
        montantRemise = totalSansRemise.subtract(o.getTotalTTC());
    }

    return OrderResponse.builder()
            .id(o.getId())
            .numeroCommande(o.getNumeroCommande())
            .statut(o.getStatut())
            .statutPaiement(o.getStatutPaiement())
            .lignes(lignes)
            .sousTotal(o.getSousTotal())
            .fraisLivraison(o.getFraisLivraison())
            .totalTTC(o.getTotalTTC())
            .dateCommande(o.getDateCommande())
            .codeCoupon(codeCoupon)  // AJOUTER
            .montantRemise(montantRemise)  // AJOUTER
            .build();
}
```

## 6. Mettre à jour la méthode annuler

Ajouter la gestion de l'annulation du coupon :

```java
@Transactional
public OrderResponse annuler(Long id, String email) {
    Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));

    if (order.getStatut() != OrderStatus.PENDING &&
            order.getStatut() != OrderStatus.PAID) {
        throw new BadRequestException("Impossible d'annuler cette commande");
    }

    order.setStatut(OrderStatus.CANCELLED);

    if (order.getStatutPaiement() == PaymentStatus.PAID) {
        order.setStatutPaiement(PaymentStatus.REFUNDED);
    }

    // Remettre le stock
    order.getLignes().forEach(item ->
            item.getProduit().setStock(
                    item.getProduit().getStock() + item.getQuantite()
            )
    );

    // AJOUTER: Décrémenter le compteur d'utilisation du coupon
    if (order.getCoupon() != null) {
        Coupon coupon = order.getCoupon();
        if (coupon.getUsagesActuels() > 0) {
            coupon.setUsagesActuels(coupon.getUsagesActuels() - 1);
            couponRepository.save(coupon);
            log.debug("Compteur du coupon {} décrémenté", coupon.getCode());
        }
    }

    return toResponse(orderRepository.save(order));
}
```

## 7. Supprimer l'ancien code de gestion des coupons

Supprimer cette section obsolète :

```java
// À SUPPRIMER
Coupon coupon = null;
BigDecimal remise = BigDecimal.ZERO;

if (request.getCodeCoupon() != null && !request.getCodeCoupon().isBlank()) {
    coupon = couponRepository.findByCodeAndActifTrue(request.getCodeCoupon())
            .orElseThrow(() -> new BadRequestException("Coupon invalide"));

    switch (coupon.getType()) {
        case PERCENT -> remise = sousTotal.multiply(coupon.getValeur())
                .divide(BigDecimal.valueOf(100));
        case FIXED -> remise = coupon.getValeur();
    }

    coupon.setUsagesActuels(coupon.getUsagesActuels() + 1);
}
```

## 8. Imports nécessaires

Ajouter ces imports :

```java
import com.FermeDirecte.FermeDirecte.dto.coupon.CouponValidationResponse;
import com.FermeDirecte.FermeDirecte.service.CouponService;
```

## Résumé des changements

### ✅ Avantages du nouveau système

1. **Validation complète** : Le `CouponService` gère toutes les validations
2. **Calcul hybride** : Support des réductions multiples
3. **Tracking précis** : Enregistrement dans `coupon_usages`
4. **Gestion des limites** : Vérification automatique des limites par utilisateur
5. **Catégories** : Support des coupons par catégorie
6. **Plafonds** : Respect des plafonds de réduction

### 🔄 Flux de traitement

1. Client soumet la commande avec un code coupon
2. `OrderService` appelle `CouponService.validateCoupon()`
3. `CouponService` vérifie toutes les conditions
4. `CouponService` calcule les réductions hybrides
5. `OrderService` utilise les montants calculés
6. Commande créée avec le coupon
7. `CouponService.applyCoupon()` enregistre l'utilisation

### 📊 Données trackées

- Qui a utilisé le coupon
- Quand il a été utilisé
- Sur quelle commande
- Montant économisé

## Test de l'intégration

### 1. Test avec Postman

```http
POST http://localhost:8080/api/orders
Authorization: Bearer <client_token>
Content-Type: application/json

{
  "adresseId": 1,
  "modePaiement": "ESPECES",
  "notes": "Test avec coupon",
  "codeCoupon": "BIENVENUE2024"
}
```

### 2. Vérifier dans la base de données

```sql
-- Vérifier la commande
SELECT * FROM orders WHERE numero_commande = 'ORD-2024-XXXXX';

-- Vérifier l'utilisation du coupon
SELECT * FROM coupon_usages WHERE order_id = <order_id>;

-- Vérifier le compteur du coupon
SELECT code, usages_actuels, usages_max_global 
FROM coupons 
WHERE code = 'BIENVENUE2024';
```

### 3. Vérifier les logs

```
DEBUG - Application du coupon: BIENVENUE2024
DEBUG - Coupon appliqué - Économie: 35.00 DT
DEBUG - Utilisation du coupon enregistrée
```

## Notes importantes

1. **Frais de livraison** : Adapter la valeur par défaut (actuellement 10 DT) selon votre logique métier
2. **Catégories** : S'assurer que tous les produits ont une catégorie définie
3. **Transactions** : Toutes les opérations sont dans une transaction pour garantir la cohérence
4. **Logs** : Ajouter des logs pour faciliter le débogage
5. **Gestion d'erreurs** : Les exceptions sont gérées par le `CouponService`

## Prochaines étapes

1. ✅ Appliquer les modifications au `OrderService`
2. ✅ Tester la création de commande avec coupon
3. ✅ Tester l'annulation de commande avec coupon
4. ✅ Vérifier les statistiques des coupons
5. ✅ Tester les différents scénarios (montant minimum, catégories, limites)

---

**Important** : Après avoir appliqué ces modifications, redémarrer le backend et tester avec différents scénarios de coupons.
