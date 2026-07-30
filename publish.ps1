# Publish the portfolio: build it, save a snapshot, send it to GitHub.
# Netlify sees the push and redeploys the live site automatically.
#
# Usage:  .\publish.ps1 "what you changed"
# Example: .\publish.ps1 "Add new case study on lab feedback"

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Message
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "1/3  Building the site to check for errors..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "BUILD FAILED - nothing was published." -ForegroundColor Red
    Write-Host "The error above says which file has the problem. Fix it and run this again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2/3  Saving a snapshot of your changes..." -ForegroundColor Cyan
git add -A
$pending = git status --porcelain
if ([string]::IsNullOrWhiteSpace($pending)) {
    # Nothing staged. Either there were no edits, or they are already committed.
    $unpushed = git log '@{u}..HEAD' --oneline 2>$null
    if ([string]::IsNullOrWhiteSpace(($unpushed -join ''))) {
        Write-Host "No changes to publish - the live site already matches your files." -ForegroundColor Yellow
        exit 0
    }
    Write-Host "No new edits, but you have unpublished commits. Sending those." -ForegroundColor Yellow
}
else {
    git commit -m $Message
}

Write-Host ""
Write-Host "3/3  Sending to GitHub..." -ForegroundColor Cyan
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "PUSH FAILED - your work is saved locally but did not reach GitHub." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Published. Netlify is rebuilding now - your site updates in a minute or two." -ForegroundColor Green
Write-Host "Watch progress at https://app.netlify.com" -ForegroundColor Green
Write-Host ""
