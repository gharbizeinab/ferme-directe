@echo off
echo ========================================
echo   GRAPHIQUES AVEC DONNEES REELLES
echo ========================================
echo.

echo Les graphiques utilisent maintenant les VRAIES donnees
echo de votre base de donnees !
echo.

echo Ce qui sera affiche :
echo   - Revenus reels des 12 derniers mois
echo   - Nombre reel de commandes par statut
echo   - Nombre reel d'utilisateurs par role
echo   - Vrais produits les plus vendus
echo   - Evolution reelle des revenus
echo.

echo ========================================
echo   REDEMARRAGE DU BACKEND
echo ========================================
echo.

echo [1/3] Compilation du backend...
cd backend
call mvn clean compile

echo.
echo [2/3] Demarrage du backend...
start cmd /k "mvn spring-boot:run"

echo.
echo Attendez que le backend demarre...
echo (Vous verrez "Started FermeDirecteApplication")
timeout /t 10 /nobreak > nul

echo.
echo ========================================
echo   REDEMARRAGE DU FRONTEND
echo ========================================
echo.

echo [3/3] Demarrage du frontend...
cd ..\frontend
start cmd /k "npm start"

echo.
echo Attendez que le frontend compile...
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo   INSTRUCTIONS
echo ========================================
echo.
echo 1. Attendez que la compilation soit terminee
echo 2. Ouvrez : http://localhost:4200/login
echo 3. Connectez-vous (Admin ou Seller)
echo 4. Allez sur : http://localhost:4200/dashboard
echo.
echo VERIFICATION :
echo   - Ouvrez les DevTools (F12)
echo   - Onglet Network
echo   - Rechargez la page
echo   - Cliquez sur la requete "admin" ou "seller"
echo   - Regardez la Response : vous verrez les vraies donnees JSON
echo.
echo Si les graphiques sont vides :
echo   - C'est normal si vous n'avez pas encore de donnees
echo   - Creez des commandes, produits, utilisateurs
echo   - Les graphiques se mettront a jour automatiquement
echo.

pause

start http://localhost:4200/dashboard

echo.
echo ========================================
echo   Bon visionnage des donnees reelles !
echo ========================================
pause
