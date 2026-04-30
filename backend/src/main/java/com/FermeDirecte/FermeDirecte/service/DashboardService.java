// src/main/java/com/FermeDirecte/FermeDirecte/service/DashboardService.java
package com.FermeDirecte.FermeDirecte.service;

import com.FermeDirecte.FermeDirecte.dto.dashboard.*;
import com.FermeDirecte.FermeDirecte.entity.Order;
import com.FermeDirecte.FermeDirecte.enums.OrderStatus;
import com.FermeDirecte.FermeDirecte.exception.ResourceNotFoundException;
import com.FermeDirecte.FermeDirecte.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final SellerProfileRepository sellerProfileRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {

        List<Order> commandes = orderRepository.findAll();

        BigDecimal ca = commandes.stream()
                .filter(o -> o.getStatut() != OrderStatus.CANCELLED)
                .map(Order::getTotalTTC)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> commandesRecentes = commandes.stream()
                .sorted(Comparator.comparing(
                        Order::getDateCommande,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(5)
                .map(o -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", o.getId());
                    m.put("numeroCommande", o.getNumeroCommande());
                    m.put("statut", o.getStatut());
                    m.put("totalTTC", o.getTotalTTC());
                    return m;
                })
                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .totalUtilisateurs(userRepository.count())
                .totalCommandes((long) commandes.size())
                .totalProduits(productRepository.count())
                .chiffreAffairesGlobal(ca)
                .topProduits(Collections.emptyList())
                .commandesRecentes(commandesRecentes)
                .build();
    }

    @Transactional(readOnly = true)
    public SellerDashboardResponse getSellerDashboard(String email) {

        var profile = sellerProfileRepository.findByUser_Email(email)
                .orElseThrow(() -> new ResourceNotFoundException("SellerProfile", 0L));

        long totalProduits = profile.getProduits().size();

        // Compter les commandes en attente
        long commandesEnAttente = orderRepository.findAll().stream()
                .filter(o -> o.getStatut() == OrderStatus.PENDING)
                .flatMap(o -> o.getLignes().stream())
                .filter(item -> item.getProduit()
                        .getSellerProfile()
                        .getId()
                        .equals(profile.getId()))
                .map(item -> item.getCommande().getId())
                .distinct()
                .count();

        // Calculer le revenu total
        BigDecimal revenu = orderRepository.findAll().stream()
                .filter(o -> o.getStatut() != OrderStatus.CANCELLED)
                .flatMap(o -> o.getLignes().stream())
                .filter(item -> item.getProduit()
                        .getSellerProfile()
                        .getId()
                        .equals(profile.getId()))
                .map(item -> item.getPrixUnitaire()
                        .multiply(BigDecimal.valueOf(item.getQuantite())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Produits avec stock faible (< 10)
        List<Map<String, Object>> stockFaible = profile.getProduits().stream()
                .filter(p -> p.getStock() < 10)
                .sorted(Comparator.comparing(p -> p.getStock()))
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", p.getId());
                    m.put("nom", p.getNom());
                    m.put("stock", p.getStock());
                    m.put("prix", p.getPrix());
                    return m;
                })
                .collect(Collectors.toList());

        long produitsStockFaible = stockFaible.size();

        // Récupérer les commandes récentes contenant les produits du vendeur
        List<Map<String, Object>> commandesRecentes = orderRepository.findAll().stream()
                .filter(order -> order.getLignes().stream()
                        .anyMatch(item -> item.getProduit()
                                .getSellerProfile()
                                .getId()
                                .equals(profile.getId())))
                .sorted(Comparator.comparing(
                        Order::getDateCommande,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(5)
                .map(o -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", o.getId());
                    m.put("numeroCommande", o.getNumeroCommande());
                    m.put("statut", o.getStatut());
                    m.put("totalTTC", o.getTotalTTC());
                    m.put("dateCommande", o.getDateCommande());
                    return m;
                })
                .collect(Collectors.toList());

        // Statistiques des commandes par statut
        Map<String, Object> statistiquesCommandes = new HashMap<>();
        List<Order> toutesCommandes = orderRepository.findAll().stream()
                .filter(order -> order.getLignes().stream()
                        .anyMatch(item -> item.getProduit()
                                .getSellerProfile()
                                .getId()
                                .equals(profile.getId())))
                .collect(Collectors.toList());

        statistiquesCommandes.put("total", (long) toutesCommandes.size());
        statistiquesCommandes.put("enAttente", toutesCommandes.stream()
                .filter(o -> o.getStatut() == OrderStatus.PENDING).count());
        statistiquesCommandes.put("confirmees", toutesCommandes.stream()
                .filter(o -> o.getStatut() == OrderStatus.PAID).count());
        statistiquesCommandes.put("enLivraison", toutesCommandes.stream()
                .filter(o -> o.getStatut() == OrderStatus.SHIPPED).count());
        statistiquesCommandes.put("livrees", toutesCommandes.stream()
                .filter(o -> o.getStatut() == OrderStatus.DELIVERED).count());
        statistiquesCommandes.put("annulees", toutesCommandes.stream()
                .filter(o -> o.getStatut() == OrderStatus.CANCELLED).count());

        // Revenus par jour (7 derniers jours)
        List<Map<String, Object>> revenusParJour = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            java.time.LocalDate date = java.time.LocalDate.now().minusDays(i);
            BigDecimal revenuJour = orderRepository.findAll().stream()
                    .filter(o -> o.getStatut() != OrderStatus.CANCELLED)
                    .filter(o -> o.getDateCommande() != null && 
                            o.getDateCommande().toLocalDate().equals(date))
                    .flatMap(o -> o.getLignes().stream())
                    .filter(item -> item.getProduit()
                            .getSellerProfile()
                            .getId()
                            .equals(profile.getId()))
                    .map(item -> item.getPrixUnitaire()
                            .multiply(BigDecimal.valueOf(item.getQuantite())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> jour = new HashMap<>();
            jour.put("date", date.toString());
            jour.put("revenu", revenuJour);
            revenusParJour.add(jour);
        }

        return SellerDashboardResponse.builder()
                .totalProduits(totalProduits)
                .commandesEnAttente(commandesEnAttente)
                .revenuTotal(revenu)
                .produitsStockFaible(produitsStockFaible)
                .stockFaible(stockFaible != null ? stockFaible : new ArrayList<>())
                .commandesRecentes(commandesRecentes != null ? commandesRecentes : new ArrayList<>())
                .revenusParJour(revenusParJour != null ? revenusParJour : new ArrayList<>())
                .statistiquesCommandes(statistiquesCommandes != null ? statistiquesCommandes : new HashMap<>())
                .build();
    }
}