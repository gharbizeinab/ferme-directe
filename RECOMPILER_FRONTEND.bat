@echo off
echo ========================================
echo   RECOMPILATION DU FRONTEND
echo   Pour voir les changements de la charte
echo ========================================
echo.

echo [1/4] Arret du serveur Angular en cours...
echo Appuyez sur Ctrl+C dans le terminal Angular pour l'arreter
echo.
pause

echo.
echo [2/4] Nettoyage du cache Angular...
cd frontend
if exist .angular rmdir /s /q .angular
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✓ Cache nettoye

echo.
echo [3/4] Recompilation avec les nouveaux styles...
echo.
call ng build --configuration development
echo ✓ Compilation terminee

echo.
echo [4/4] Redemarrage du serveur...
echo.
start cmd /k "npm start"

echo.
echo ========================================
echo   TERMINÉ !
echo ========================================
echo.
echo Attendez que la compilation soit terminee
echo Puis ouvrez : http://localhost:4200/products
echo.
echo Faites un "Hard Refresh" dans le navigateur :
echo   - Chrome/Edge : Ctrl + Shift + R
echo   - Ou : Ctrl + F5
echo.
pause
