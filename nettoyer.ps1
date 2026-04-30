# Script de nettoyage du projet FermeDirecte
Write-Host "========================================" -ForegroundColor Green
Write-Host "  NETTOYAGE DU PROJET FERMEDIRECTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# 1. Supprimer le dossier -p
Write-Host "[1/5] Suppression du dossier -p..." -ForegroundColor Yellow
if (Test-Path "-p") {
    Remove-Item "-p" -Recurse -Force
    Write-Host "OK - Dossier -p supprime" -ForegroundColor Green
} else {
    Write-Host "OK - Dossier -p n'existe pas" -ForegroundColor Green
}

# 2. Créer la structure docs/
Write-Host ""
Write-Host "[2/5] Creation de la structure docs/..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "docs\setup" -Force | Out-Null
New-Item -ItemType Directory -Path "docs\guides" -Force | Out-Null
New-Item -ItemType Directory -Path "docs\troubleshooting" -Force | Out-Null
Write-Host "OK - Structure docs/ creee" -ForegroundColor Green

# 3. Créer la structure scripts/
Write-Host ""
Write-Host "[3/5] Creation de la structure scripts/..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "scripts" -Force | Out-Null
Write-Host "OK - Structure scripts/ creee" -ForegroundColor Green

# 4. Déplacer les fichiers
Write-Host ""
Write-Host "[4/5] Deplacement des fichiers..." -ForegroundColor Yellow

# Configuration files
$setupFiles = @(
    "CONFIGURATION_INTELLIJ.md",
    "CONFIGURATION_JDK.md",
    "FIX_JDK_INTELLIJ.md",
    "FIX_LOMBOK.md",
    "DEMARRAGE_RAPIDE.md",
    "FIX_JDK_RAPIDE.md",
    "FIX_ERREURS_COMPILATION.md"
)

foreach ($file in $setupFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs\setup\" -Force
    }
}

# Guide files
$guideFiles = @(
    "GUIDE_CONNEXION_ADMIN.md",
    "GUIDE_REORGANISATION.md",
    "GUIDE_NOUVEAU_REPO.md",
    "WORKFLOW_QUOTIDIEN.md",
    "CREER_ADMIN.md",
    "SOLUTION_ADMIN.md",
    "LISEZ_MOI_DABORD.md",
    "README_WORKFLOW.md"
)

foreach ($file in $guideFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs\guides\" -Force
    }
}

# Feature documentation
$docFiles = @(
    "DASHBOARD_ADMIN_AMELIORE.md",
    "NOUVEAU_DESIGN_DASHBOARD.md",
    "NETTOYAGE_SIDEBAR.md",
    "PAGE_UTILISATEURS_CREEE.md",
    "UNIFICATION_LOGO.md",
    "INDEX_DOCUMENTATION.md"
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Move-Item $file "docs\" -Force
    }
}

# Scripts
$scriptFiles = @(
    "DEMARRER_BACKEND.bat",
    "DEMARRER_FRONTEND.bat",
    "DEMARRER_TOUT.bat",
    "NOUVEAU_REPO_GITHUB.bat",
    "PUSH_PROPRE.bat",
    "PUSH_RAPIDE.bat",
    "cleanup.bat",
    "cleanup.sh",
    "fix-git-cache.bat"
)

foreach ($file in $scriptFiles) {
    if (Test-Path $file) {
        Move-Item $file "scripts\" -Force
    }
}

Write-Host "OK - Fichiers deplaces" -ForegroundColor Green

# 5. Supprimer les fichiers obsolètes
Write-Host ""
Write-Host "[5/5] Suppression des fichiers obsoletes..." -ForegroundColor Yellow

$obsoleteFiles = @(
    "COMMANDES_GIT_QUOTIDIENNES.txt",
    "COMMANDES_MANUELLES.txt",
    "COMMANDES_URGENTES.txt",
    "COMMANDES_RAPIDES.md",
    "LIRE_MOI_URGENT.txt",
    "SOLUTION_URGENTE.md",
    "SOLUTION_RAPIDE.md",
    "SOLUTION_DEFINITIVE.bat",
    "NOUVEAU_DEPOT.bat"
)

foreach ($file in $obsoleteFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
    }
}

Write-Host "OK - Fichiers obsoletes supprimes" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  NETTOYAGE TERMINE !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Structure du projet reorganisee :" -ForegroundColor Cyan
Write-Host "  - docs/setup/       : Guides d'installation" -ForegroundColor White
Write-Host "  - docs/guides/      : Guides utilisateur" -ForegroundColor White
Write-Host "  - docs/troubleshooting/ : Solutions aux problemes" -ForegroundColor White
Write-Host "  - scripts/          : Scripts utilitaires" -ForegroundColor White
Write-Host ""
Write-Host "Prochaines etapes :" -ForegroundColor Cyan
Write-Host "  1. git status" -ForegroundColor White
Write-Host "  2. git add ." -ForegroundColor White
Write-Host "  3. git commit -m 'chore: reorganisation du projet'" -ForegroundColor White
Write-Host "  4. git push origin main" -ForegroundColor White
Write-Host ""
Read-Host "Appuyez sur Entree pour continuer"
