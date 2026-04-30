@echo off
REM ============================================
REM Script pour nettoyer le cache Git
REM ============================================

echo ============================================
echo Nettoyage du cache Git - Fichiers volumineux
echo ============================================

echo.
echo [1/5] Suppression de .angular du cache Git...
git rm -r --cached frontend/.angular 2>nul
if %errorlevel% equ 0 (
    echo   OK - .angular supprime du cache
) else (
    echo   INFO - .angular deja supprime ou inexistant
)

echo.
echo [2/5] Suppression de node_modules du cache Git...
git rm -r --cached frontend/node_modules 2>nul
if %errorlevel% equ 0 (
    echo   OK - node_modules supprime du cache
) else (
    echo   INFO - node_modules deja supprime ou inexistant
)

echo.
echo [3/5] Suppression de dist du cache Git...
git rm -r --cached frontend/dist 2>nul
if %errorlevel% equ 0 (
    echo   OK - dist supprime du cache
) else (
    echo   INFO - dist deja supprime ou inexistant
)

echo.
echo [4/5] Suppression de target du cache Git...
git rm -r --cached backend/target 2>nul
if %errorlevel% equ 0 (
    echo   OK - target supprime du cache
) else (
    echo   INFO - target deja supprime ou inexistant
)

echo.
echo [5/5] Suppression de .idea du cache Git...
git rm -r --cached backend/.idea 2>nul
if %errorlevel% equ 0 (
    echo   OK - .idea supprime du cache
) else (
    echo   INFO - .idea deja supprime ou inexistant
)

echo.
echo ============================================
echo Verification de l'etat Git...
echo ============================================
git status

echo.
echo ============================================
echo IMPORTANT : Prochaines etapes
echo ============================================
echo.
echo 1. Commiter les changements :
echo    git commit -m "Remove large files from Git cache"
echo.
echo 2. Pousser vers GitHub :
echo    git push origin main
echo.
pause
