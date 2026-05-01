@echo off
echo ========================================
echo COMPILATION DU BACKEND
echo ========================================
echo.

cd backend

echo [ETAPE 1/2] Nettoyage...
call mvn clean

echo.
echo [ETAPE 2/2] Compilation...
call mvn compile

echo.
echo ========================================
echo.
if %ERRORLEVEL% EQU 0 (
    echo ✅ COMPILATION REUSSIE !
    echo.
    echo Le backend est pret.
    echo Vous pouvez le demarrer avec: mvn spring-boot:run
) else (
    echo ❌ ERREUR DE COMPILATION
    echo.
    echo Verifiez les erreurs ci-dessus.
    echo Consultez CORRECTIONS_BACKEND_APPLIQUEES.md
)
echo.
echo ========================================
pause
