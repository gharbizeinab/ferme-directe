@echo off
echo ========================================
echo   VOIR LES GRAPHIQUES DU DASHBOARD
echo ========================================
echo.

echo Les graphiques statistiques ont ete crees !
echo.
echo Graphiques disponibles :
echo   - Line Chart (evolution CA/revenus)
echo   - Bar Chart (commandes par statut)
echo   - Donut Chart (utilisateurs par role)
echo   - Horizontal Bar Chart (top produits)
echo.

echo [1/2] Redemarrage du frontend...
echo.
echo Appuyez sur Ctrl+C dans le terminal Angular pour l'arreter
pause

cd frontend
echo Nettoyage du cache...
if exist .angular rmdir /s /q .angular
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo.
echo Redemarrage avec les nouveaux packages...
start cmd /k "npm start"

timeout /t 3 /nobreak > nul

echo.
echo [2/2] Instructions :
echo.
echo 1. Attendez que la compilation soit terminee
echo 2. Ouvrez : http://localhost:4200/login
echo 3. Connectez-vous (Admin ou Seller)
echo 4. Allez sur : http://localhost:4200/dashboard
echo.
echo Vous verrez :
echo   - 4 KPI cards avec icones colorees
echo   - Graphiques interactifs (Line, Bar, Donut)
echo   - Tableaux avec indicateurs de stock
echo.

pause

start http://localhost:4200/dashboard

echo.
echo ========================================
echo   Bon visionnage des graphiques !
echo ========================================
pause
