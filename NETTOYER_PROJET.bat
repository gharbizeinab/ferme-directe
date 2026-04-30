@echo off
echo ========================================
echo   NETTOYAGE DU PROJET FERMEDIRECTE
echo ========================================
echo.

REM 1. Supprimer le dossier vide -p
echo [1/5] Suppression du dossier vide -p...
if exist "-p" rmdir /s /q "-p"
echo OK

REM 2. Créer la structure docs/
echo.
echo [2/5] Creation de la structure docs/...
if not exist "docs\setup" mkdir "docs\setup"
if not exist "docs\guides" mkdir "docs\guides"
if not exist "docs\troubleshooting" mkdir "docs\troubleshooting"
echo OK

REM 3. Créer la structure scripts/
echo.
echo [3/5] Creation de la structure scripts/...
if not exist "scripts" mkdir "scripts"
echo OK

REM 4. Déplacer les fichiers de configuration
echo.
echo [4/5] Deplacement des fichiers de configuration...
if exist "CONFIGURATION_INTELLIJ.md" move "CONFIGURATION_INTELLIJ.md" "docs\setup\" >nul 2>&1
if exist "CONFIGURATION_JDK.md" move "CONFIGURATION_JDK.md" "docs\setup\" >nul 2>&1
if exist "FIX_JDK_INTELLIJ.md" move "FIX_JDK_INTELLIJ.md" "docs\setup\" >nul 2>&1
if exist "FIX_LOMBOK.md" move "FIX_LOMBOK.md" "docs\setup\" >nul 2>&1
if exist "DEMARRAGE_RAPIDE.md" move "DEMARRAGE_RAPIDE.md" "docs\setup\" >nul 2>&1
if exist "FIX_JDK_RAPIDE.md" move "FIX_JDK_RAPIDE.md" "docs\setup\" >nul 2>&1
if exist "FIX_ERREURS_COMPILATION.md" move "FIX_ERREURS_COMPILATION.md" "docs\troubleshooting\" >nul 2>&1

REM Déplacer les guides
if exist "GUIDE_CONNEXION_ADMIN.md" move "GUIDE_CONNEXION_ADMIN.md" "docs\guides\" >nul 2>&1
if exist "GUIDE_REORGANISATION.md" move "GUIDE_REORGANISATION.md" "docs\guides\" >nul 2>&1
if exist "GUIDE_NOUVEAU_REPO.md" move "GUIDE_NOUVEAU_REPO.md" "docs\guides\" >nul 2>&1
if exist "WORKFLOW_QUOTIDIEN.md" move "WORKFLOW_QUOTIDIEN.md" "docs\guides\" >nul 2>&1
if exist "CREER_ADMIN.md" move "CREER_ADMIN.md" "docs\guides\" >nul 2>&1
if exist "SOLUTION_ADMIN.md" move "SOLUTION_ADMIN.md" "docs\guides\" >nul 2>&1
if exist "LISEZ_MOI_DABORD.md" move "LISEZ_MOI_DABORD.md" "docs\guides\" >nul 2>&1
if exist "README_WORKFLOW.md" move "README_WORKFLOW.md" "docs\guides\" >nul 2>&1

REM Déplacer les documentations de features
if exist "DASHBOARD_ADMIN_AMELIORE.md" move "DASHBOARD_ADMIN_AMELIORE.md" "docs\" >nul 2>&1
if exist "NOUVEAU_DESIGN_DASHBOARD.md" move "NOUVEAU_DESIGN_DASHBOARD.md" "docs\" >nul 2>&1
if exist "NETTOYAGE_SIDEBAR.md" move "NETTOYAGE_SIDEBAR.md" "docs\" >nul 2>&1
if exist "PAGE_UTILISATEURS_CREEE.md" move "PAGE_UTILISATEURS_CREEE.md" "docs\" >nul 2>&1
if exist "UNIFICATION_LOGO.md" move "UNIFICATION_LOGO.md" "docs\" >nul 2>&1
if exist "INDEX_DOCUMENTATION.md" move "INDEX_DOCUMENTATION.md" "docs\" >nul 2>&1

REM Déplacer les scripts
if exist "DEMARRER_BACKEND.bat" move "DEMARRER_BACKEND.bat" "scripts\" >nul 2>&1
if exist "DEMARRER_FRONTEND.bat" move "DEMARRER_FRONTEND.bat" "scripts\" >nul 2>&1
if exist "DEMARRER_TOUT.bat" move "DEMARRER_TOUT.bat" "scripts\" >nul 2>&1
if exist "NOUVEAU_REPO_GITHUB.bat" move "NOUVEAU_REPO_GITHUB.bat" "scripts\" >nul 2>&1
if exist "PUSH_PROPRE.bat" move "PUSH_PROPRE.bat" "scripts\" >nul 2>&1
if exist "PUSH_RAPIDE.bat" move "PUSH_RAPIDE.bat" "scripts\" >nul 2>&1
if exist "cleanup.bat" move "cleanup.bat" "scripts\" >nul 2>&1
if exist "cleanup.sh" move "cleanup.sh" "scripts\" >nul 2>&1
if exist "fix-git-cache.bat" move "fix-git-cache.bat" "scripts\" >nul 2>&1
echo OK

REM 5. Supprimer les fichiers obsolètes
echo.
echo [5/5] Suppression des fichiers obsoletes...
if exist "COMMANDES_GIT_QUOTIDIENNES.txt" del /q "COMMANDES_GIT_QUOTIDIENNES.txt"
if exist "COMMANDES_MANUELLES.txt" del /q "COMMANDES_MANUELLES.txt"
if exist "COMMANDES_URGENTES.txt" del /q "COMMANDES_URGENTES.txt"
if exist "COMMANDES_RAPIDES.md" del /q "COMMANDES_RAPIDES.md"
if exist "LIRE_MOI_URGENT.txt" del /q "LIRE_MOI_URGENT.txt"
if exist "SOLUTION_URGENTE.md" del /q "SOLUTION_URGENTE.md"
if exist "SOLUTION_RAPIDE.md" del /q "SOLUTION_RAPIDE.md"
if exist "SOLUTION_DEFINITIVE.bat" del /q "SOLUTION_DEFINITIVE.bat"
if exist "NOUVEAU_DEPOT.bat" del /q "NOUVEAU_DEPOT.bat"
echo OK

echo.
echo ========================================
echo   NETTOYAGE TERMINE !
echo ========================================
echo.
echo Structure du projet reorganisee :
echo   - docs/setup/       : Guides d'installation
echo   - docs/guides/      : Guides utilisateur
echo   - docs/troubleshooting/ : Solutions aux problemes
echo   - scripts/          : Scripts utilitaires
echo.
echo Prochaines etapes :
echo   1. Verifier : git status
echo   2. Ajouter : git add .
echo   3. Commit : git commit -m "chore: reorganisation du projet"
echo   4. Push : git push origin main
echo.
pause
