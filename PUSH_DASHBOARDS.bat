@echo off
echo ========================================
echo PUSH DASHBOARDS OPTIMISES
echo ========================================
echo.

cd ferme-directe-complete

echo [1/5] Verification du statut Git...
git status
echo.

echo [2/5] Ajout des fichiers modifies...
git add frontend/src/app/components/dashboard/dashboard.component.html
git add frontend/src/app/components/dashboard/dashboard.component.ts
git add frontend/src/app/components/dashboard/dashboard.component.scss
echo ✓ Fichiers code source ajoutes

echo.
echo [3/5] Ajout de la documentation...
git add *DASHBOARD*.txt
git add *DASHBOARD*.md
git add *DASHBOARD*.html
git add *DASHBOARD*.bat
echo ✓ Documentation ajoutee

echo.
echo [4/5] Commit des modifications...
git commit -F COMMIT_MESSAGE_DASHBOARDS.txt
echo ✓ Commit effectue

echo.
echo [5/5] Push vers le repository distant...
git push origin main
echo ✓ Push effectue

echo.
echo ========================================
echo ✅ PUSH TERMINE !
echo ========================================
echo.
echo Les dashboards optimises sont maintenant sur le repository distant.
echo.
pause
