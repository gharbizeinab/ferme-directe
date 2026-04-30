@echo off
REM ============================================
REM Script de push rapide vers GitHub
REM ============================================

echo ============================================
echo PUSH RAPIDE VERS GITHUB
echo ============================================
echo.

REM Verifier l'etat
echo [1/4] Verification de l'etat du depot
git status
echo.

REM Demander le message de commit
set /p MESSAGE="Message de commit : "

if "%MESSAGE%"=="" (
    echo ERREUR : Le message de commit ne peut pas etre vide !
    pause
    exit /b 1
)

REM Ajouter tous les fichiers
echo.
echo [2/4] Ajout des fichiers modifies
git add .
echo OK - Fichiers ajoutes

REM Commit
echo.
echo [3/4] Creation du commit
git commit -m "%MESSAGE%"
if %errorlevel% neq 0 (
    echo ERREUR : Echec du commit
    pause
    exit /b 1
)
echo OK - Commit cree

REM Push
echo.
echo [4/4] Push vers GitHub
git push origin main
if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo SUCCES !
    echo ============================================
    echo.
    echo Vos modifications ont ete poussees vers GitHub.
    echo.
) else (
    echo.
    echo ============================================
    echo ERREUR !
    echo ============================================
    echo.
    echo Le push a echoue. Verifiez :
    echo   - Votre connexion internet
    echo   - Que vous etes a jour : git pull origin main
    echo.
)

pause
