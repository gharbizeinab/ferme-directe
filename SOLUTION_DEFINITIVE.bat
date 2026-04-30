@echo off
REM ============================================
REM SOLUTION DEFINITIVE - Supprimer les gros fichiers PUIS créer le dépôt
REM ============================================

echo ============================================
echo SOLUTION DEFINITIVE
echo ============================================
echo.
echo Cette operation va :
echo   1. SUPPRIMER physiquement les gros dossiers
echo   2. Sauvegarder l'ancien depot Git
echo   3. Creer un nouveau depot propre
echo   4. Pousser vers GitHub
echo.
echo ATTENTION : Les dossiers suivants seront SUPPRIMES :
echo   - frontend\.angular\
echo   - frontend\node_modules\
echo   - frontend\dist\
echo   - backend\target\
echo   - backend\.idea\
echo.
echo Vous pourrez les recreer avec :
echo   - cd frontend ^&^& npm install
echo   - cd backend ^&^& mvn clean install
echo.
pause

echo.
echo ============================================
echo ETAPE 1 : Suppression des gros dossiers
echo ============================================

echo.
echo [1/5] Suppression de frontend\.angular\...
if exist "frontend\.angular" (
    rmdir /s /q "frontend\.angular"
    echo   OK - frontend\.angular\ supprime
) else (
    echo   INFO - frontend\.angular\ n'existe pas
)

echo.
echo [2/5] Suppression de frontend\node_modules\...
if exist "frontend\node_modules" (
    echo   Suppression en cours (peut prendre du temps)...
    rmdir /s /q "frontend\node_modules"
    echo   OK - frontend\node_modules\ supprime
) else (
    echo   INFO - frontend\node_modules\ n'existe pas
)

echo.
echo [3/5] Suppression de frontend\dist\...
if exist "frontend\dist" (
    rmdir /s /q "frontend\dist"
    echo   OK - frontend\dist\ supprime
) else (
    echo   INFO - frontend\dist\ n'existe pas
)

echo.
echo [4/5] Suppression de backend\target\...
if exist "backend\target" (
    rmdir /s /q "backend\target"
    echo   OK - backend\target\ supprime
) else (
    echo   INFO - backend\target\ n'existe pas
)

echo.
echo [5/5] Suppression de backend\.idea\...
if exist "backend\.idea" (
    rmdir /s /q "backend\.idea"
    echo   OK - backend\.idea\ supprime
) else (
    echo   INFO - backend\.idea\ n'existe pas
)

echo.
echo ============================================
echo ETAPE 2 : Sauvegarde de l'ancien depot Git
echo ============================================

if exist .git (
    if exist .git.backup (
        echo   Suppression de l'ancienne sauvegarde...
        rmdir /s /q .git.backup
    )
    echo   Deplacement de .git vers .git.backup...
    move .git .git.backup >nul 2>&1
    echo   OK - Ancien depot sauvegarde
) else (
    echo   INFO - Pas de depot .git existant
)

echo.
echo ============================================
echo ETAPE 3 : Creation du nouveau depot
echo ============================================

echo.
echo [1/4] Initialisation...
git init
echo   OK - Depot initialise

echo.
echo [2/4] Ajout des fichiers...
git add .
echo   OK - Fichiers ajoutes

echo.
echo [3/4] Verification...
echo.
git status
echo.
echo VERIFIEZ que .angular, node_modules, dist, target ne sont PAS listes !
echo.
pause

echo.
echo [4/4] Commit...
git commit -m "Initial commit - Clean repository without large files"
echo   OK - Commit cree

echo.
echo ============================================
echo ETAPE 4 : Push vers GitHub
echo ============================================

echo.
echo Configuration du remote...
git remote add origin https://github.com/gharbizeinab/firmedirecte1.git 2>nul
if %errorlevel% neq 0 (
    echo   Remote deja configure
) else (
    echo   OK - Remote ajoute
)

echo.
echo Push vers GitHub (force)...
git push --force origin main

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo SUCCES !
    echo ============================================
    echo.
    echo Le depot a ete pousse vers GitHub sans les gros fichiers.
    echo.
    echo PROCHAINES ETAPES :
    echo   1. Verifier sur GitHub que tout est OK
    echo   2. Reinstaller les dependances :
    echo      cd frontend ^&^& npm install
    echo      cd backend ^&^& mvn clean install
    echo   3. Supprimer la sauvegarde :
    echo      rmdir /s /q .git.backup
    echo.
) else (
    echo.
    echo ============================================
    echo ERREUR !
    echo ============================================
    echo.
    echo Le push a echoue. Verifiez les messages d'erreur ci-dessus.
    echo.
)

pause
