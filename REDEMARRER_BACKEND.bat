@echo off
echo ========================================
echo   REDEMARRAGE DU BACKEND
echo ========================================
echo.

cd backend

echo [1/3] Nettoyage et compilation...
call mvn clean compile

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERREUR: La compilation a echoue
    pause
    exit /b 1
)

echo.
echo [2/3] Compilation reussie !
echo.
echo [3/3] Demarrage du backend...
echo.
echo IMPORTANT: Le backend va demarrer.
echo Attendez le message "Started FermeDirecteApplication"
echo.
echo Pour arreter le backend: Ctrl+C
echo.
pause

call mvn spring-boot:run

pause
