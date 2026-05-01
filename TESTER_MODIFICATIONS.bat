@echo off
echo ========================================
echo TESTER LES MODIFICATIONS - FERME DIRECTE
echo ========================================
echo.

echo [INFO] Modifications effectuees :
echo   1. Ajout du graphique "Top 5 Produits" pour le dashboard vendeur
echo   2. Verification de la langue francaise du projet
echo.
pause

echo.
echo [ETAPE 1] Verifier que le backend est demarre
echo.
echo Si le backend n'est pas demarre, ouvrez un autre terminal et executez :
echo   cd backend
echo   mvn spring-boot:run
echo.
pause

echo.
echo [ETAPE 2] Verifier l'API backend
echo.
echo Ouvrez dans votre navigateur :
echo   http://localhost:8080/dashboard/seller
echo.
echo Verifiez que la reponse JSON contient le champ "topProduits"
echo.
pause

echo.
echo [ETAPE 3] Recompiler le frontend
echo.
cd frontend
call npm run build
echo.

echo [ETAPE 4] Demarrer le frontend
echo.
echo Le frontend va demarrer sur http://localhost:4200
echo.
echo INSTRUCTIONS DE TEST :
echo.
echo TEST 1 - Dashboard Admin :
echo   1. Connectez-vous en tant qu'Admin
echo   2. Allez sur /admin/dashboard
echo   3. Verifiez que les 4 graphiques affichent des donnees reelles
echo.
echo TEST 2 - Dashboard Vendeur (NOUVEAU) :
echo   1. Connectez-vous en tant que Vendeur
echo   2. Allez sur /seller/dashboard
echo   3. Verifiez que les 3 graphiques s'affichent :
echo      - Line Chart : Revenus (7 jours)
echo      - Bar Chart : Commandes par statut
echo      - Horizontal Bar : Mes Top 5 Produits (NOUVEAU)
echo.
echo TEST 3 - Langue Francaise :
echo   1. Parcourez toutes les pages de l'application
echo   2. Verifiez que tous les textes sont en francais
echo   3. Verifiez les messages d'erreur (si applicable)
echo.
pause

start http://localhost:4200/seller/dashboard
call npm start

pause
