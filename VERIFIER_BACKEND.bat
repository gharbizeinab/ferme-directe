@echo off
echo ========================================
echo VERIFICATION DU BACKEND
echo ========================================
echo.

cd backend

echo [1/2] Compilation du projet...
echo.
call mvn clean compile

echo.
echo ========================================
echo.
echo [2/2] Verification terminee !
echo.
echo Si aucune erreur n'apparait ci-dessus :
echo   - Le backend est pret
echo   - Vous pouvez demarrer avec: mvn spring-boot:run
echo.
echo Si des erreurs apparaissent :
echo   - Lisez le fichier CORRECTIONS_BACKEND_APPLIQUEES.md
echo   - Verifiez les imports dans CouponController.java
echo.
echo ========================================
pause
