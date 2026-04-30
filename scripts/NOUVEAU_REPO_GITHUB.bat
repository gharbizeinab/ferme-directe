@echo off
REM ============================================
REM Créer un dépôt GitHub propre depuis zéro
REM ============================================

echo ============================================
echo NOUVEAU DEPOT GITHUB - Solution propre
echo ============================================
echo.
echo Cette solution est la PLUS SIMPLE et PLUS RAPIDE !
echo.
echo ETAPES :
echo   1. Supprimer les gros dossiers localement
echo   2. Supprimer l'ancien .git
echo   3. Creer un nouveau depot Git local
echo   4. Vous allez creer un NOUVEAU depot sur GitHub
echo   5. Pousser vers le nouveau depot
echo.
pause

echo.
echo ============================================
echo ETAPE 1 : Suppression des gros dossiers
echo ============================================

echo.
echo [1/5] Suppression de frontend\.angular\
if exist "frontend\.angular" (
    echo   Suppression en cours
    rmdir /s /q "frontend\.angular"
    echo   OK - Supprime
) else (
    echo   INFO - N'existe pas
)

echo.
echo [2/5] Suppression de frontend\node_modules\
if exist "frontend\node_modules" (
    echo   Suppression en cours (peut prendre 1-2 minutes)
    rmdir /s /q "frontend\node_modules"
    echo   OK - Supprime
) else (
    echo   INFO - N'existe pas
)

echo.
echo [3/5] Suppression de frontend\dist\
if exist "frontend\dist" (
    rmdir /s /q "frontend\dist"
    echo   OK - Supprime
) else (
    echo   INFO - N'existe pas
)

echo.
echo [4/5] Suppression de backend\target\
if exist "backend\target" (
    rmdir /s /q "backend\target"
    echo   OK - Supprime
) else (
    echo   INFO - N'existe pas
)

echo.
echo [5/5] Suppression de backend\.idea\
if exist "backend\.idea" (
    rmdir /s /q "backend\.idea"
    echo   OK - Supprime
) else (
    echo   INFO - N'existe pas
)

echo.
echo ============================================
echo ETAPE 2 : Suppression de l'ancien .git
echo ============================================

if exist .git (
    echo   Suppression de .git
    rmdir /s /q .git
    echo   OK - Ancien depot supprime
) else (
    echo   INFO - Pas de .git existant
)

echo.
echo ============================================
echo ETAPE 3 : Creation du nouveau depot local
echo ============================================

echo.
echo Initialisation
git init
git branch -M main
echo   OK - Depot local cree

echo.
echo Ajout des fichiers
git add .
echo   OK - Fichiers ajoutes

echo.
echo Verification
git status
echo.
echo VERIFIEZ que .angular, node_modules, dist, target ne sont PAS listes !
echo.
pause

echo.
echo Commit initial
git commit -m "Initial commit - Ferme Directe project"
echo   OK - Commit cree

echo.
echo ============================================
echo ETAPE 4 : CREER UN NOUVEAU DEPOT SUR GITHUB
echo ============================================
echo.
echo MAINTENANT, allez sur GitHub :
echo.
echo   1. Allez sur : https://github.com/new
echo   2. Nom du depot : ferme-directe
echo   3. Description : Plateforme e-commerce Ferme Directe
echo   4. Visibilite : Private (ou Public)
echo   5. NE PAS cocher "Initialize with README"
echo   6. Cliquez sur "Create repository"
echo.
echo   7. GitHub va vous donner une URL comme :
echo      https://github.com/gharbizeinab/ferme-directe.git
echo.
echo   8. COPIEZ cette URL
echo.
pause

echo.
echo ============================================
echo ETAPE 5 : Entrez l'URL du nouveau depot
echo ============================================
echo.
set /p REPO_URL="Collez l'URL du depot GitHub (ex: https://github.com/gharbizeinab/ferme-directe.git) : "

echo.
echo Configuration du remote
git remote add origin %REPO_URL%
echo   OK - Remote configure

echo.
echo Push vers GitHub
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo SUCCES ! 🎉
    echo ============================================
    echo.
    echo Votre projet est maintenant sur GitHub !
    echo URL : %REPO_URL%
    echo.
    echo PROCHAINES ETAPES :
    echo   1. Verifier sur GitHub que tout est OK
    echo   2. Reinstaller les dependances :
    echo      cd frontend ^&^& npm install
    echo      cd backend ^&^& mvn clean install
    echo.
    echo ANCIEN DEPOT :
    echo   Vous pouvez supprimer ou archiver l'ancien depot :
    echo   https://github.com/gharbizeinab/firmedirecte1.git
    echo.
) else (
    echo.
    echo ============================================
    echo ERREUR !
    echo ============================================
    echo.
    echo Le push a echoue. Verifiez :
    echo   - L'URL du depot est correcte
    echo   - Vous avez les droits d'acces
    echo   - Votre connexion internet fonctionne
    echo.
)

pause
