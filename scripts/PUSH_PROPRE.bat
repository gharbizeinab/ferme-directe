@echo off
REM ============================================
REM Script simplifie - Push propre vers GitHub
REM ============================================

echo ============================================
echo PUSH PROPRE VERS NOUVEAU DEPOT GITHUB
echo ============================================
echo.
pause

REM ============================================
REM Etape 1 : Supprimer les gros dossiers
REM ============================================

echo.
echo [Etape 1/5] Suppression des gros dossiers
echo.

if exist "frontend\.angular" (
    echo Suppression de frontend\.angular
    rmdir /s /q "frontend\.angular"
)

if exist "frontend\node_modules" (
    echo Suppression de frontend\node_modules (peut prendre du temps)
    rmdir /s /q "frontend\node_modules"
)

if exist "frontend\dist" (
    echo Suppression de frontend\dist
    rmdir /s /q "frontend\dist"
)

if exist "backend\target" (
    echo Suppression de backend\target
    rmdir /s /q "backend\target"
)

if exist "backend\.idea" (
    echo Suppression de backend\.idea
    rmdir /s /q "backend\.idea"
)

echo OK - Gros dossiers supprimes

REM ============================================
REM Etape 2 : Supprimer l'ancien .git
REM ============================================

echo.
echo [Etape 2/5] Suppression de l'ancien depot Git
echo.

if exist .git (
    rmdir /s /q .git
    echo OK - Ancien depot supprime
) else (
    echo INFO - Pas de depot existant
)

REM ============================================
REM Etape 3 : Creer un nouveau depot local
REM ============================================

echo.
echo [Etape 3/5] Creation du nouveau depot local
echo.

git init
git branch -M main
git add .
echo.
echo Verification des fichiers ajoutes :
git status
echo.
echo IMPORTANT : Verifiez que .angular, node_modules, dist, target ne sont PAS listes !
echo.
pause

git commit -m "Initial commit - Ferme Directe project"
echo OK - Depot local cree

REM ============================================
REM Etape 4 : Creer le depot sur GitHub
REM ============================================

echo.
echo [Etape 4/5] Creation du depot sur GitHub
echo.
echo Allez sur : https://github.com/new
echo.
echo Remplissez :
echo   - Repository name : ferme-directe
echo   - Description : Plateforme e-commerce Ferme Directe
echo   - Visibility : Private ou Public
echo   - NE PAS cocher "Initialize with README"
echo.
echo Cliquez sur "Create repository"
echo.
echo GitHub va vous donner une URL comme :
echo   https://github.com/gharbizeinab/ferme-directe.git
echo.
pause

REM ============================================
REM Etape 5 : Push vers GitHub
REM ============================================

echo.
echo [Etape 5/5] Push vers GitHub
echo.
set /p REPO_URL="Collez l'URL du depot GitHub : "

echo.
echo Configuration du remote
git remote add origin %REPO_URL%

echo.
echo Push vers GitHub
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo SUCCES !
    echo ============================================
    echo.
    echo Votre projet est sur GitHub : %REPO_URL%
    echo.
    echo Prochaines etapes :
    echo   1. Verifier sur GitHub
    echo   2. Reinstaller les dependances :
    echo      cd frontend ^&^& npm install
    echo      cd backend ^&^& mvn clean install
    echo.
) else (
    echo.
    echo ERREUR - Le push a echoue
    echo Verifiez l'URL et votre connexion
    echo.
)

pause
