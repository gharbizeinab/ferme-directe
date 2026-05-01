@echo off
echo ========================================
echo   COMPILATION DU BACKEND
echo   (avec corrections graphiques)
echo ========================================
echo.

cd backend

echo [1/2] Nettoyage...
call mvn clean

echo.
echo [2/2] Compilation...
call mvn compile

echo.
if %errorlevel% equ 0 (
    echo ========================================
    echo   ✅ COMPILATION REUSSIE !
    echo ========================================
    echo.
    echo Le backend est pret avec les donnees reelles.
    echo.
    echo Pour demarrer :
    echo   mvn spring-boot:run
    echo.
) else (
    echo ========================================
    echo   ❌ ERREUR DE COMPILATION
    echo ========================================
    echo.
    echo Verifiez les erreurs ci-dessus.
    echo.
)

pause
