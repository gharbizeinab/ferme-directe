@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 FermeDirecte - Démarrage Frontend
echo ========================================
echo.

cd frontend

echo 📦 Vérification des dépendances...
echo.

if not exist "node_modules" (
    echo ⚠️  node_modules introuvable, installation des dépendances...
    echo.
    call npm install
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ Erreur lors de l'installation des dépendances !
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ✅ Dépendances OK !
echo.
echo 🔧 Démarrage du serveur Angular...
echo.
echo 🌐 L'application sera disponible sur : http://localhost:4200
echo.

call npm start

pause
