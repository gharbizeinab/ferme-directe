@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════════╗
echo ║              GIT PUSH - Ferme Directe                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo 📋 Vérification de l'état Git...
echo.
git status
echo.

echo ═══════════════════════════════════════════════════════════
echo Voulez-vous continuer avec le push ?
echo ═══════════════════════════════════════════════════════════
echo.
set /p continue="Continuer ? (O/N) : "
if /i not "%continue%"=="O" (
    echo.
    echo ❌ Opération annulée.
    pause
    exit /b 0
)

echo.
echo ═══════════════════════════════════════════════════════════
echo ÉTAPE 1 : Ajout des fichiers
echo ═══════════════════════════════════════════════════════════
echo.
git add .
echo ✅ Fichiers ajoutés
echo.

echo ═══════════════════════════════════════════════════════════
echo ÉTAPE 2 : Création du commit
echo ═══════════════════════════════════════════════════════════
echo.
set /p commit_msg="Message du commit : "
if "%commit_msg%"=="" (
    set commit_msg=Update: Corrections et améliorations
)
git commit -m "%commit_msg%"
echo.

echo ═══════════════════════════════════════════════════════════
echo ÉTAPE 3 : Push vers le dépôt distant
echo ═══════════════════════════════════════════════════════════
echo.
git push
if errorlevel 1 (
    echo.
    echo ⚠️  Le push a échoué. Essai avec -u origin main...
    git push -u origin main
)
echo.

if errorlevel 1 (
    echo ❌ Erreur lors du push !
    echo.
    echo Vérifiez :
    echo - Que vous êtes connecté à Internet
    echo - Que vous avez les droits d'accès au dépôt
    echo - Que la branche distante existe
    echo.
) else (
    echo ✅ Push réussi !
    echo.
)

pause
