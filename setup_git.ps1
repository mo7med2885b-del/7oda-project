# Git Repository Setup Script for Mohamed Hosny Clinic
Write-Host "Initializing Git Repository..." -ForegroundColor Cyan

git init
git branch -M main
git add .
git commit -m "feat: Initial release of Mohamed Hosny Clinic Management & Financial Intelligence Platform"

Write-Host "Git repository initialized successfully on branch 'main'!" -ForegroundColor Green
