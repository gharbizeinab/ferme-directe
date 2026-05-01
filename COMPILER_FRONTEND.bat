@echo off
echo ========================================
echo   COMPILATION DU FRONTEND
echo ========================================
echo.

cd frontend

echo [1/2] Nettoyage du cache...
if exist .angular rmdir /s /q .angular
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✓ Cache nettoye

echo.
echo [2/2] Compilation...
call ng build --configuration development

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo   ✓ COMPILATION REUSSIE !
    echo ========================================
) else (
    echo ========================================
    echo   ✗ ERREURS DE COMPILATION
    echo ========================================
)

echo.
pause
