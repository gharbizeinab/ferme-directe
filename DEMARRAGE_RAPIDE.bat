@echo off
echo ========================================
echo   FERME DIRECTE - Voir les Changements
echo ========================================
echo.

echo [1/3] Verification du port 4200...
netstat -ano | findstr :4200 > nul
if %errorlevel% equ 0 (
    echo ✓ L'application semble deja lancee sur le port 4200
    echo.
    echo Ouvrez votre navigateur a l'adresse:
    echo   http://localhost:4200/products
    echo.
    echo Pour voir les changements visuels:
    echo   - Nouvelle couleur verte lumineuse
    echo   - Effets hover sur les cartes
    echo   - Badges redesignes
    echo   - Animations fluides
    echo.
    pause
    start http://localhost:4200/products
    exit /b 0
)

echo Port 4200 libre, demarrage du frontend...
echo.

echo [2/3] Installation des dependances...
cd frontend
call npm install

echo.
echo [3/3] Demarrage du serveur Angular...
echo.
echo Une fois compile, ouvrez: http://localhost:4200/products
echo.
start cmd /k "npm start"

timeout /t 5 /nobreak > nul
start http://localhost:4200/products

echo.
echo ========================================
echo   Application en cours de demarrage
echo ========================================
pause
