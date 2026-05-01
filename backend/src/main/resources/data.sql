-- Données de test pour les coupons
-- Ce fichier sera exécuté automatiquement par Spring Boot au démarrage

-- Insérer les coupons de test
INSERT INTO coupons (code, description, pourcentage_reduction, montant_fixe_reduction, livraison_gratuite, montant_minimum, montant_maximum_reduction, scope, seller_id, usages_max_global, usages_actuels, usages_max_par_utilisateur, date_debut, date_expiration, date_creation, actif, bloque) 
VALUES 
('BIENVENUE2024', 'Coupon de bienvenue : -20% + -5 DT + livraison offerte', 20.00, 5.00, TRUE, 50.00, NULL, 'GLOBAL', NULL, 100, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30' DAY, CURRENT_TIMESTAMP, TRUE, FALSE),
('PROMO15', 'Promotion : -15% sur tout le site', 15.00, NULL, FALSE, 30.00, NULL, 'GLOBAL', NULL, 200, 0, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '60' DAY, CURRENT_TIMESTAMP, TRUE, FALSE),
('REDUC10', 'Réduction de 10 DT sur votre commande', NULL, 10.00, FALSE, 40.00, NULL, 'GLOBAL', NULL, 150, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '45' DAY, CURRENT_TIMESTAMP, TRUE, FALSE),
('LIVRAISONGRATUITE', 'Livraison offerte sans minimum', NULL, NULL, TRUE, NULL, NULL, 'GLOBAL', NULL, 500, 0, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90' DAY, CURRENT_TIMESTAMP, TRUE, FALSE),
('MEGA50', 'Méga promo : -50% (max 30 DT de réduction)', 50.00, NULL, FALSE, 100.00, 30.00, 'GLOBAL', NULL, 50, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '15' DAY, CURRENT_TIMESTAMP, TRUE, FALSE)
ON CONFLICT (code) DO NOTHING;
