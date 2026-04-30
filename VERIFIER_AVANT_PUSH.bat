@echo off
chcp 65001 >nul
echo ========================================
echo   VERIFICATION AVANT PUSH GITHUB
echo ========================================
echo.

set "ERRORS=0"

REM 1. Vérifier que le dossier -p n'existe pas
echo [1/8] Verification dossier -p...
if exist "-p" (
    echo ❌ ERREUR: Le dossier -p existe encore
    echo    Solution: Executer NETTOYER_PROJET.bat
    set /a ERRORS+=1
) else (
    echo ✅ OK
)

REM 2. Vérifier la structure docs/
echo.
echo [2/8] Verification structure docs/...
if not exist "docs\setup" (
    echo ❌ ERREUR: docs\setup n'existe pas
    set /a ERRORS+=1
) else if not exist "docs\guides" (
    echo ❌ ERREUR: docs\guides n'existe pas
    set /a ERRORS+=1
) else (
    echo ✅ OK
)

REM 3. Vérifier la structure scripts/
echo.
echo [3/8] Verification structure scripts/...
if not exist "scripts" (
    echo ❌ ERREUR: scripts\ n'existe pas
    set /a ERRORS+=1
) else (
    echo ✅ OK
)

REM 4. Vérifier .gitignore
echo.
echo [4/8] Verification .gitignore...
if not exist ".gitignore" (
    echo ❌ ERREUR: .gitignore manquant
    set /a ERRORS+=1
) else (
    findstr /C:"node_modules" .gitignore >nul
    if errorlevel 1 (
        echo ⚠️  ATTENTION: node_modules pas dans .gitignore
    )
    findstr /C:"target" .gitignore >nul
    if errorlevel 1 (
        echo ⚠️  ATTENTION: target pas dans .gitignore
    )
    echo ✅ OK
)

REM 5. Vérifier que node_modules n'est pas tracké
echo.
echo [5/8] Verification node_modules...
if exist "frontend\node_modules" (
    git check-ignore frontend\node_modules >nul 2>&1
    if errorlevel 1 (
        echo ❌ ERREUR: node_modules est tracke par Git
        echo    Solution: Ajouter node_modules/ dans .gitignore
        set /a ERRORS+=1
    ) else (
        echo ✅ OK - node_modules ignore
    )
) else (
    echo ✅ OK - node_modules n'existe pas
)

REM 6. Vérifier que target n'est pas tracké
echo.
echo [6/8] Verification target/...
if exist "backend\target" (
    git check-ignore backend\target >nul 2>&1
    if errorlevel 1 (
        echo ❌ ERREUR: target est tracke par Git
        echo    Solution: Ajouter target/ dans .gitignore
        set /a ERRORS+=1
    ) else (
        echo ✅ OK - target ignore
    )
) else (
    echo ✅ OK - target n'existe pas
)

REM 7. Vérifier README.md
echo.
echo [7/8] Verification README.md...
if not exist "README.md" (
    echo ❌ ERREUR: README.md manquant
    set /a ERRORS+=1
) else (
    echo ✅ OK
)

REM 8. Vérifier le statut Git
echo.
echo [8/8] Verification statut Git...
git status >nul 2>&1
if errorlevel 1 (
    echo ❌ ERREUR: Pas un repository Git
    set /a ERRORS+=1
) else (
    echo ✅ OK
)

echo.
echo ========================================
if %ERRORS%==0 (
    echo   ✅ TOUT EST PRET POUR LE PUSH !
    echo ========================================
    echo.
    echo Prochaines etapes :
    echo   1. git status
    echo   2. git add .
    echo   3. git commit -m "chore: reorganisation et nettoyage du projet"
    echo   4. git push origin main
) else (
    echo   ❌ %ERRORS% ERREUR(S) DETECTEE(S)
    echo ========================================
    echo.
    echo Veuillez corriger les erreurs avant de push.
    echo Executez NETTOYER_PROJET.bat pour reorganiser.
)
echo.
pause
