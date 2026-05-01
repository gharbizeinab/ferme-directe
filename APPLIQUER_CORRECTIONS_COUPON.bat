@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════════╗
echo ║   APPLIQUER LES CORRECTIONS - Système de Coupons          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo 📋 Ce script va :
echo    1. Vous guider pour exécuter le script SQL
echo    2. Recompiler le backend
echo    3. Redémarrer le backend
echo.

echo ⚠️  IMPORTANT : Avant de continuer, vous devez :
echo    - Avoir exécuté le script SQL dans phpMyAdmin
echo    - Avoir arrêté le backend (Ctrl+C dans son terminal)
echo.

pause

echo.
echo ═══════════════════════════════════════════════════════════
echo ÉTAPE 1 : Vérification du script SQL
echo ═══════════════════════════════════════════════════════════
echo.
echo 📄 Fichier SQL : backend\sql\AJOUTER_COLONNE_REMISE.sql
echo.
echo ❓ Avez-vous exécuté ce script dans phpMyAdmin ?
echo    1. Ouvrir phpMyAdmin
echo    2. Sélectionner la base 'fermedirecte'
echo    3. Onglet SQL
echo    4. Copier/coller le contenu du fichier
echo    5. Cliquer sur Exécuter
echo.

set /p sql_done="Script SQL exécuté ? (O/N) : "
if /i not "%sql_done%"=="O" (
    echo.
    echo ❌ Veuillez d'abord exécuter le script SQL.
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo ÉTAPE 2 : Recompilation du Backend
echo ═══════════════════════════════════════════════════════════
echo.

cd backend

echo 🔨 Nettoyage et compilation...
call mvn clean compile

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors de la compilation !
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Compilation réussie !
echo.

echo ═══════════════════════════════════════════════════════════
echo ÉTAPE 3 : Redémarrage du Backend
echo ═══════════════════════════════════════════════════════════
echo.
echo 🚀 Démarrage du backend...
echo.
echo ⚠️  Le backend va démarrer dans cette fenêtre.
echo    Attendez le message "Started FermeDirecteApplication"
echo    Pour arrêter : Ctrl+C
echo.

pause

call mvn spring-boot:run

cd ..
