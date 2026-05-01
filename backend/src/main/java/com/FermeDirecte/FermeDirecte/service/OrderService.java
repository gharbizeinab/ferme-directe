package com.FermeDirecte.FermeDirecte.service;

import com.FermeDirecte.FermeDirecte.dto.address.AddressRequest;
import com.FermeDirecte.FermeDirecte.dto.order.*;
import com.FermeDirecte.FermeDirecte.entity.*;
import com.FermeDirecte.FermeDirecte.enums.OrderStatus;
import com.FermeDirecte.FermeDirecte.enums.PaymentStatus;
import com.FermeDirecte.FermeDirecte.exception.BadRequestException;
import com.FermeDirecte.FermeDirecte.exception.ResourceNotFoundException;
import com.FermeDirecte.FermeDirecte.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final AddressRepository addressRepository;

    @Transactional
    public OrderResponse passerCommande(OrderRequest request, String email) {
        log.info("Début de la commande pour l'utilisateur: {}", email);
        log.debug("Requête reçue: {}", request);
        
        User user = getUser(email);
        log.debug("Utilisateur trouvé: ID={}", user.getId());

        Cart cart = cartRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new BadRequestException("Panier vide"));

        if (cart.getLignes().isEmpty()) {
            throw new BadRequestException("Panier vide");
        }
        
        log.debug("Panier trouvé avec {} articles", cart.getLignes().size());

        // Gérer l'adresse : soit existante (adresseId), soit nouvelle (adresse)
        Address adresse;
        
        if (request.getAdresseId() != null) {
            log.debug("Utilisation d'une adresse existante: ID={}", request.getAdresseId());
            // Utiliser une adresse existante
            adresse = user.getAdresses().stream()
                    .filter(a -> a.getId().equals(request.getAdresseId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Adresse introuvable"));
        } else if (request.getAdresse() != null) {
            log.debug("Création d'une nouvelle adresse");
            // Créer une nouvelle adresse
            AddressRequest addrReq = request.getAdresse();
            adresse = Address.builder()
                    .user(user)
                    .prenom(addrReq.getPrenom())
                    .nom(addrReq.getNom())
                    .rue(addrReq.getRue())
                    .ville(addrReq.getVille())
                    .codePostal(addrReq.getCodePostal())
                    .pays(addrReq.getPays())
                    .gouvernorat(addrReq.getGouvernorat())
                    .telephone(addrReq.getTelephone())
                    .instructions(addrReq.getInstructions())
                    .principal(addrReq.getPrincipal() != null ? addrReq.getPrincipal() : false)
                    .build();
            
            log.debug("Sauvegarde de l'adresse en base de données");
            // Sauvegarder l'adresse en base de données AVANT de l'utiliser dans la commande
            adresse = addressRepository.save(adresse);
            log.debug("Adresse sauvegardée avec ID={}", adresse.getId());
        } else {
            throw new BadRequestException("Veuillez fournir une adresse de livraison");
        }

        // Vérification stock
        for (CartItem item : cart.getLignes()) {
            if (item.getProduit().getStock() < item.getQuantite()) {
                throw new BadRequestException(
                        "Stock insuffisant pour : " + item.getProduit().getNom());
            }
        }

        // Calcul sousTotal
        BigDecimal sousTotal = cart.getLignes().stream().map(item -> {
            BigDecimal prix = item.getProduit().getPrix();
            if (item.getVariante() != null) {
                prix = prix.add(item.getVariante().getPrixDelta());
            }
            return prix.multiply(BigDecimal.valueOf(item.getQuantite()));
        }).reduce(BigDecimal.ZERO, BigDecimal::add);

        // Coupon
        Coupon coupon = null;
        BigDecimal remise = BigDecimal.ZERO;

        if (request.getCodeCoupon() != null && !request.getCodeCoupon().isBlank()) {
            coupon = couponRepository.findByCodeIgnoreCase(request.getCodeCoupon())
                    .orElseThrow(() -> new BadRequestException("Coupon invalide"));

            // Vérifier que le coupon est actif et non bloqué
            if (!coupon.getActif() || coupon.getBloque()) {
                throw new BadRequestException("Ce coupon n'est pas disponible");
            }

            // Vérifier la date de validité
            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(coupon.getDateDebut()) || now.isAfter(coupon.getDateExpiration())) {
                throw new BadRequestException("Ce coupon n'est plus valide");
            }

            // Vérifier le montant minimum
            if (coupon.getMontantMinimum() != null && sousTotal.compareTo(coupon.getMontantMinimum()) < 0) {
                throw new BadRequestException("Montant minimum de " + coupon.getMontantMinimum() + " DT requis");
            }

            // Vérifier les usages
            if (coupon.getUsagesActuels() >= coupon.getUsagesMaxGlobal()) {
                throw new BadRequestException("Ce coupon a atteint sa limite d'utilisation");
            }

            // Calculer la réduction (ordre : % -> fixe)
            BigDecimal montantApresReduction = sousTotal;

            // 1. Réduction en pourcentage
            if (coupon.getPourcentageReduction() != null && coupon.getPourcentageReduction().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal reductionPourcentage = sousTotal
                    .multiply(coupon.getPourcentageReduction())
                    .divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
                remise = remise.add(reductionPourcentage);
                montantApresReduction = montantApresReduction.subtract(reductionPourcentage);
            }

            // 2. Réduction montant fixe
            if (coupon.getMontantFixeReduction() != null && coupon.getMontantFixeReduction().compareTo(BigDecimal.ZERO) > 0) {
                remise = remise.add(coupon.getMontantFixeReduction());
                montantApresReduction = montantApresReduction.subtract(coupon.getMontantFixeReduction());
            }

            // Appliquer le plafond de réduction si défini
            if (coupon.getMontantMaximumReduction() != null && remise.compareTo(coupon.getMontantMaximumReduction()) > 0) {
                remise = coupon.getMontantMaximumReduction();
            }

            // Ne pas descendre en dessous de 0
            if (montantApresReduction.compareTo(BigDecimal.ZERO) < 0) {
                remise = sousTotal;
            }

            // Incrémenter le compteur d'utilisations
            coupon.setUsagesActuels(coupon.getUsagesActuels() + 1);
            // Sauvegarder le coupon AVANT de l'associer à la commande
            coupon = couponRepository.save(coupon);
        }

        BigDecimal fraisLivraison = BigDecimal.valueOf(5.0);
        
        // Appliquer la livraison gratuite si le coupon le permet
        if (coupon != null && coupon.getLivraisonGratuite()) {
            fraisLivraison = BigDecimal.ZERO;
        }
        
        BigDecimal totalTTC = sousTotal.subtract(remise).add(fraisLivraison);

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
                .remise(remise)  // Sauvegarder la remise
                .fraisLivraison(fraisLivraison)
                .totalTTC(totalTTC)
                .build();

        // Lignes de commande + décrémenter stock
        List<OrderItem> lignes = cart.getLignes().stream().map(item -> {
            BigDecimal prix = item.getProduit().getPrix();
            if (item.getVariante() != null) {
                prix = prix.add(item.getVariante().getPrixDelta());
            }

            item.getProduit().setStock(
                    item.getProduit().getStock() - item.getQuantite()
            );

            return OrderItem.builder()
                    .commande(order)
                    .produit(item.getProduit())
                    .variante(item.getVariante())
                    .quantite(item.getQuantite())
                    .prixUnitaire(prix)
                    .build();
        }).collect(Collectors.toList());

        order.getLignes().addAll(lignes);
        orderRepository.save(order);

        // Vider le panier
        cart.getLignes().clear();
        cartRepository.save(cart);

        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getById(Long id, String email) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));
        return toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> mesCommandes(String email) {
        User user = getUser(email);
        return orderRepository.findByClient_IdOrderByDateCommandeDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> commandesVendeur(String email) {
        log.info("Récupération des commandes pour le vendeur: {}", email);
        User vendeur = getUser(email);
        log.debug("Vendeur trouvé: ID={}, Email={}", vendeur.getId(), vendeur.getEmail());
        
        // Récupérer toutes les commandes qui contiennent au moins un produit du vendeur
        List<Order> toutesCommandes = orderRepository.findAll();
        log.debug("Nombre total de commandes: {}", toutesCommandes.size());
        
        List<Order> commandesVendeur = toutesCommandes.stream()
                .filter(order -> {
                    boolean hasSellerProduct = order.getLignes().stream()
                            .anyMatch(item -> {
                                if (item.getProduit().getSellerProfile() == null) {
                                    log.warn("Produit {} n'a pas de SellerProfile", item.getProduit().getId());
                                    return false;
                                }
                                boolean isSellerProduct = item.getProduit().getSellerProfile().getUser().getId().equals(vendeur.getId());
                                if (isSellerProduct) {
                                    log.debug("Commande {} contient un produit du vendeur: {}", 
                                            order.getNumeroCommande(), item.getProduit().getNom());
                                }
                                return isSellerProduct;
                            });
                    return hasSellerProduct;
                })
                .collect(Collectors.toList());
        
        log.info("Nombre de commandes trouvées pour le vendeur {}: {}", email, commandesVendeur.size());
        
        return commandesVendeur.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> toutesCommandes() {
        return orderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse mettreAJourStatut(Long id, OrderStatus statut) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));

        order.setStatut(statut);

        if (statut == OrderStatus.PAID) {
            order.setStatutPaiement(PaymentStatus.PAID);
        }

        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse mettreAJourStatut(Long id, OrderStatus statut, String email) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande introuvable"));

        // Vérifier si l'utilisateur est un vendeur et si la commande contient ses produits
        User user = getUser(email);
        boolean isAdmin = user.getRole().name().equals("ADMIN");
        boolean isSeller = user.getRole().name().equals("SELLER");

        if (isSeller && !isAdmin) {
            // Vérifier que la commande contient au moins un produit du vendeur
            boolean hasSellerProduct = order.getLignes().stream()
                    .anyMatch(item -> item.getProduit().getSellerProfile() != null &&
                            item.getProduit().getSellerProfile().getUser().getId().equals(user.getId()));

            if (!hasSellerProduct) {
                throw new BadRequestException("Vous ne pouvez pas modifier cette commande");
            }
        }

        order.setStatut(statut);

        if (statut == OrderStatus.PAID) {
            order.setStatutPaiement(PaymentStatus.PAID);
        }

        return toResponse(orderRepository.save(order));
    }

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

        return toResponse(orderRepository.save(order));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
    }

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

        return OrderResponse.builder()
                .id(o.getId())
                .numeroCommande(o.getNumeroCommande())
                .statut(o.getStatut())
                .statutPaiement(o.getStatutPaiement())
                .lignes(lignes)
                .sousTotal(o.getSousTotal())
                .remise(o.getRemise())
                .fraisLivraison(o.getFraisLivraison())
                .totalTTC(o.getTotalTTC())
                .dateCommande(o.getDateCommande())
                .build();
    }
}