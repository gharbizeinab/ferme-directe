@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo   🚀 FermeDirecte - Démarrage Complet
echo ========================================
echo.
echo Ce script va démarrer :
echo   1. Backend (Spring Boot) - Port 8080
echo   2. Frontend (Angular) - Port 4200
echo.
echo ⚠️  Assurez-vous que XAMPP MySQL est démarré !
echo.
pause

echo.
echo 📦 Démarrage du Backend...
echo.
start "FermeDirecte Backend" cmd /k "cd backend && mvn spring-boot:run"

echo ⏳ Attente de 10 secondes pour le démarrage du backend...
timeout /t 10 /nobreak >nul

echo.
echo 📦 Démarrage du Frontend...
echo.
start "FermeDirecte Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo   ✅ Démarrage en cours...
echo ========================================
echo.
echo 🔧 Backend : http://localhost:8080
echo 🌐 Frontend : http://localhost:4200
echo.
echo 🔐 Credentials Admin :
echo    Email : admin@fermedirecte.com
echo    Mot de passe : Admin123!
echo.
echo ⚠️  Deux fenêtres de terminal vont s'ouvrir.
echo    Ne les fermez pas tant que vous utilisez l'application !
echo.
echo ========================================
pause
