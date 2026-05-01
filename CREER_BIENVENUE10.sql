-- Créer le coupon BIENVENUE10 pour les tests
INSERT INTO coupons (
    code,
    description,
    pourcentage_reduction,
    montant_fixe_reduction,
    livraison_gratuite,
    montant_minimum,
    montant_maximum_reduction,
    scope,
    vendeur_id,
    usages_max_global,
    usages_actuels,
    usages_max_par_utilisateur,
    date_debut,
    date_expiration,
    date_creation,
    actif,
    bloque
) VALUES (
    'BIENVENUE10',
    'Réduction de 10% pour tous les nouveaux clients',
    10.0,
    NULL,
    0,
    0.0,
    NULL,
    'GLOBAL',
    NULL,
    1000,
    0,
    10,
    '2026-01-01 00:00:00',
    '2026-12-31 23:59:59',
    NOW(),
    1,
    0
);

-- Vérifier que le coupon a été créé
SELECT 
    id,
    code,
    description,
    pourcentage_reduction,
    actif,
    bloque,
    DATE_FORMAT(date_debut, '%Y-%m-%d') as debut,
    DATE_FORMAT(date_expiration, '%Y-%m-%d') as expiration
FROM coupons 
WHERE code = 'BIENVENUE10';
