@echo off
echo ========================================
echo TESTER LES GRAPHIQUES ADMIN - FERME DIRECTE
echo ========================================
echo.

echo [ETAPE 1] Verifier que le backend est demarre
echo.
echo Si le backend n'est pas demarre, ouvrez un autre terminal et executez :
echo   cd backend
echo   mvn spring-boot:run
echo.
pause

echo.
echo [ETAPE 2] Recompiler le frontend avec les nouvelles modifications
echo.
cd frontend
call npm run build
echo.

echo [ETAPE 3] Demarrer le frontend
echo.
echo Le frontend va demarrer sur http://localhost:4200
echo.
echo INSTRUCTIONS DE TEST :
echo 1. Connectez-vous en tant qu'Admin
echo 2. Allez sur /admin/dashboard
echo 3. Verifiez que les 4 graphiques affichent des donnees reelles :
echo    - Line Chart : CA mensuel (12 mois)
echo    - Bar Chart : Commandes par statut
echo    - Donut Chart : Utilisateurs par role
echo    - Horizontal Bar : Top 5 produits
echo.
echo Si la base est vide, les graphiques afficheront 0 (comportement normal)
echo.
pause

start http://localhost:4200/admin/dashboard
call npm start

pause
