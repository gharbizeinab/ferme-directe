@echo off
REM ============================================
REM Créer un nouveau dépôt Git propre
REM ============================================

echo ============================================
echo Creation d'un nouveau depot Git propre
echo ============================================
echo.
echo ATTENTION : Cette operation va :
echo   1. Sauvegarder l'ancien depot dans .git.backup
echo   2. Creer un nouveau depot sans historique
echo   3. Ajouter tous les fichiers (sauf ceux dans .gitignore)
echo   4. Pousser vers GitHub avec --force
echo.
pause

echo.
echo [1/7] Sauvegarde de l'ancien depot...
if exist .git (
    if exist .git.backup (
        echo   Suppression de l'ancienne sauvegarde...
        rmdir /s /q .git.backup
    )
    echo   Deplacement de .git vers .git.backup...
    move .git .git.backup
    echo   OK - Ancien depot sauvegarde
) else (
    echo   INFO - Pas de depot .git existant
)

echo.
echo [2/7] Initialisation d'un nouveau depot...
git init
echo   OK - Nouveau depot initialise

echo.
echo [3/7] Configuration du depot...
git config core.autocrlf false
echo   OK - Configuration appliquee

echo.
echo [4/7] Ajout de tous les fichiers...
echo   (Le .gitignore va ignorer les gros fichiers)
git add .
echo   OK - Fichiers ajoutes

echo.
echo [5/7] Verification des fichiers ajoutes...
git status
echo.
pause

echo.
echo [6/7] Commit initial...
git commit -m "Initial commit - Clean repository without large files"
echo   OK - Commit cree

echo.
echo [7/7] Configuration du remote et push...
git remote add origin https://github.com/gharbizeinab/firmedirecte1.git
echo   Remote ajoute

echo.
echo Pushing vers GitHub (force)...
git push --force origin main

echo.
echo ============================================
echo Termine !
echo ============================================
echo.
echo Le nouveau depot a ete pousse vers GitHub.
echo L'ancien depot est sauvegarde dans .git.backup
echo.
echo Si tout fonctionne bien, vous pouvez supprimer .git.backup :
echo   rmdir /s /q .git.backup
echo.
pause
