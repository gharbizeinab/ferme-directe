@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 FermeDirecte - Démarrage Backend
echo ========================================
echo.

cd backend

echo 📦 Compilation du projet...
echo.
call mvn clean install -DskipTests

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Erreur lors de la compilation !
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Compilation réussie !
echo.
echo 🔧 Démarrage du serveur Spring Boot...
echo.
echo ⚠️  Attendez le message de création de l'admin...
echo.

call mvn spring-boot:run

pause
