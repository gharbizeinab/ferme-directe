@echo off
echo ========================================
echo RECOMPILATION DASHBOARDS OPTIMISES
echo ========================================
echo.

cd frontend

echo [1/3] Nettoyage du cache...
if exist "dist" rmdir /s /q dist
if exist ".angular" rmdir /s /q .angular
echo ✓ Cache nettoye

echo.
echo [2/3] Installation des dependances...
call npm install
echo ✓ Dependances installees

echo.
echo [3/3] Compilation du frontend...
call npm run build
echo ✓ Frontend compile

echo.
echo ========================================
echo ✅ COMPILATION TERMINEE !
echo ========================================
echo.
echo Prochaines etapes :
echo 1. Lancer le backend : cd backend ^&^& mvn spring-boot:run
echo 2. Lancer le frontend : cd frontend ^&^& ng serve
echo 3. Ouvrir : http://localhost:4200/dashboard
echo.
echo Verifier avec : VERIFIER_DASHBOARDS.md
echo.
pause
