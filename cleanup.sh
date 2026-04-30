#!/bin/bash

# ============================================
# Script de nettoyage - Ferme Directe
# ============================================

echo "🧹 Nettoyage du projet Ferme Directe..."

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# 1. Supprimer les fichiers volumineux
# ============================================

echo -e "\n${YELLOW}📦 Suppression des dossiers volumineux...${NC}"

# Frontend
if [ -d "frontend/node_modules" ]; then
    echo "  ❌ Suppression de frontend/node_modules/"
    rm -rf frontend/node_modules
fi

if [ -d "frontend/.angular" ]; then
    echo "  ❌ Suppression de frontend/.angular/"
    rm -rf frontend/.angular
fi

if [ -d "frontend/dist" ]; then
    echo "  ❌ Suppression de frontend/dist/"
    rm -rf frontend/dist
fi

# Backend
if [ -d "backend/target" ]; then
    echo "  ❌ Suppression de backend/target/"
    rm -rf backend/target
fi

if [ -d "backend/.idea" ]; then
    echo "  ❌ Suppression de backend/.idea/"
    rm -rf backend/.idea
fi

# ============================================
# 2. Supprimer les fichiers zip
# ============================================

echo -e "\n${YELLOW}🗜️  Suppression des archives...${NC}"

if [ -f "backend.zip" ]; then
    echo "  ❌ Suppression de backend.zip"
    rm backend.zip
fi

if [ -f "../ferme-directe-angular16.zip" ]; then
    echo "  ❌ Suppression de ferme-directe-angular16.zip"
    rm ../ferme-directe-angular16.zip
fi

# ============================================
# 3. Créer le dossier docs et déplacer la documentation
# ============================================

echo -e "\n${YELLOW}📚 Organisation de la documentation...${NC}"

mkdir -p docs

# Liste des fichiers markdown à déplacer
docs_files=(
    "APERCU_RAPIDE.md"
    "API_DASHBOARD_VENDEUR.md"
    "CHECKLIST_FINALE.md"
    "CODES_STATUT_CORRIGES.md"
    "COMMANDES_VENDEUR.md"
    "DASHBOARD_VENDEUR_FIX.md"
    "DEBUG_COMMANDE.md"
    "DEBUG_VENDEUR_COMMANDES.md"
    "FICHIERS_MODIFIES.md"
    "GESTION_CATEGORIES.md"
    "GESTION_COMMANDES_VENDEUR.md"
    "GESTION_PROFIL_UTILISATEUR.md"
    "GUIDE_DEBOGAGE_FINAL.md"
    "GUIDE_DEBOGAGE.md"
    "GUIDE_DEMARRAGE_VENDEUR.md"
    "GUIDE_LANCEMENT.md"
    "GUIDE_SETUP.md"
    "INDEX_DOCUMENTATION.md"
    "INTERFACE_VISUELLE.md"
    "LIRE_MOI_TABLEAU_BORD.md"
    "NAVIGATION_VENDEUR.md"
    "QUICK_START_CATEGORIES.md"
    "README_DASHBOARD_VENDEUR.md"
    "RESUME_IMPLEMENTATION.md"
    "SOLUTION_FINALE.md"
    "SOLUTION_PROFIL_VENDEUR.md"
    "SOLUTION_RAPIDE.md"
    "TABLEAU_BORD_VENDEUR.md"
)

for file in "${docs_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  📄 Déplacement de $file vers docs/"
        mv "$file" docs/
    fi
done

# ============================================
# 4. Créer un dossier sql pour les scripts
# ============================================

echo -e "\n${YELLOW}🗄️  Organisation des scripts SQL...${NC}"

mkdir -p backend/sql

sql_files=(
    "backend/CATEGORIES_TEST_DATA.sql"
    "backend/DEBUG_SELLER_ORDERS.sql"
    "backend/FIX_DASHBOARD_DATA.sql"
    "backend/FIX_ORDER_COLUMNS.sql"
    "backend/FIX_SELLER_PROFILES.sql"
    "backend/SIMPLE_TEST_DATA.sql"
    "backend/TEST_SELLER_DASHBOARD.sql"
    "backend/UPDATE_ADDRESS_TABLE.sql"
)

for file in "${sql_files[@]}"; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "  📄 Déplacement de $filename vers backend/sql/"
        mv "$file" "backend/sql/$filename"
    fi
done

# ============================================
# 5. Résumé
# ============================================

echo -e "\n${GREEN}✅ Nettoyage terminé !${NC}"
echo -e "\n📊 Résumé des actions :"
echo "  ✓ Dossiers volumineux supprimés (node_modules, target, .angular, dist, .idea)"
echo "  ✓ Archives zip supprimées"
echo "  ✓ Documentation déplacée vers docs/"
echo "  ✓ Scripts SQL déplacés vers backend/sql/"
echo ""
echo -e "${YELLOW}⚠️  N'oubliez pas de :${NC}"
echo "  1. Réinstaller les dépendances frontend : cd frontend && npm install"
echo "  2. Recompiler le backend : cd backend && mvn clean install"
echo "  3. Vérifier les .gitignore créés"
echo ""
