@echo off
REM ============================================
REM Script de nettoyage - Ferme Directe (Windows)
REM ============================================

echo ============================================
echo Nettoyage du projet Ferme Directe
echo ============================================

REM ============================================
REM 1. Supprimer les fichiers volumineux
REM ============================================

echo.
echo [1/5] Suppression des dossiers volumineux...

if exist "frontend\node_modules" (
    echo   Suppression de frontend\node_modules\...
    rmdir /s /q "frontend\node_modules"
)

if exist "frontend\.angular" (
    echo   Suppression de frontend\.angular\...
    rmdir /s /q "frontend\.angular"
)

if exist "frontend\dist" (
    echo   Suppression de frontend\dist\...
    rmdir /s /q "frontend\dist"
)

if exist "backend\target" (
    echo   Suppression de backend\target\...
    rmdir /s /q "backend\target"
)

if exist "backend\.idea" (
    echo   Suppression de backend\.idea\...
    rmdir /s /q "backend\.idea"
)

REM ============================================
REM 2. Supprimer les fichiers zip
REM ============================================

echo.
echo [2/5] Suppression des archives...

if exist "backend.zip" (
    echo   Suppression de backend.zip
    del /q "backend.zip"
)

if exist "..\ferme-directe-angular16.zip" (
    echo   Suppression de ferme-directe-angular16.zip
    del /q "..\ferme-directe-angular16.zip"
)

REM ============================================
REM 3. Créer le dossier docs
REM ============================================

echo.
echo [3/5] Organisation de la documentation...

if not exist "docs" mkdir docs

REM Déplacer les fichiers markdown
for %%f in (
    APERCU_RAPIDE.md
    API_DASHBOARD_VENDEUR.md
    CHECKLIST_FINALE.md
    CODES_STATUT_CORRIGES.md
    COMMANDES_VENDEUR.md
    DASHBOARD_VENDEUR_FIX.md
    DEBUG_COMMANDE.md
    DEBUG_VENDEUR_COMMANDES.md
    FICHIERS_MODIFIES.md
    GESTION_CATEGORIES.md
    GESTION_COMMANDES_VENDEUR.md
    GESTION_PROFIL_UTILISATEUR.md
    GUIDE_DEBOGAGE_FINAL.md
    GUIDE_DEBOGAGE.md
    GUIDE_DEMARRAGE_VENDEUR.md
    GUIDE_LANCEMENT.md
    GUIDE_SETUP.md
    INDEX_DOCUMENTATION.md
    INTERFACE_VISUELLE.md
    LIRE_MOI_TABLEAU_BORD.md
    NAVIGATION_VENDEUR.md
    QUICK_START_CATEGORIES.md
    README_DASHBOARD_VENDEUR.md
    RESUME_IMPLEMENTATION.md
    SOLUTION_FINALE.md
    SOLUTION_PROFIL_VENDEUR.md
    SOLUTION_RAPIDE.md
    TABLEAU_BORD_VENDEUR.md
) do (
    if exist "%%f" (
        echo   Deplacement de %%f vers docs\
        move /y "%%f" "docs\" >nul
    )
)

REM ============================================
REM 4. Créer un dossier sql
REM ============================================

echo.
echo [4/5] Organisation des scripts SQL...

if not exist "backend\sql" mkdir "backend\sql"

for %%f in (
    CATEGORIES_TEST_DATA.sql
    DEBUG_SELLER_ORDERS.sql
    FIX_DASHBOARD_DATA.sql
    FIX_ORDER_COLUMNS.sql
    FIX_SELLER_PROFILES.sql
    SIMPLE_TEST_DATA.sql
    TEST_SELLER_DASHBOARD.sql
    UPDATE_ADDRESS_TABLE.sql
) do (
    if exist "backend\%%f" (
        echo   Deplacement de %%f vers backend\sql\
        move /y "backend\%%f" "backend\sql\" >nul
    )
)

REM ============================================
REM 5. Résumé
REM ============================================

echo.
echo ============================================
echo Nettoyage termine !
echo ============================================
echo.
echo Resume des actions :
echo   - Dossiers volumineux supprimes
echo   - Archives zip supprimees
echo   - Documentation deplacee vers docs\
echo   - Scripts SQL deplaces vers backend\sql\
echo.
echo ATTENTION : N'oubliez pas de :
echo   1. Reinstaller les dependances frontend : cd frontend ^&^& npm install
echo   2. Recompiler le backend : cd backend ^&^& mvn clean install
echo   3. Verifier les .gitignore crees
echo.
pause
