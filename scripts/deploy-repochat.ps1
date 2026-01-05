<#
Deploy Supabase Edge Function 'repoChat' and set GEMINI_API_KEY.

Usage:
  powershell -ExecutionPolicy Bypass -File .\scripts\deploy-repochat.ps1

Notes:
- Requires Supabase CLI installed and `supabase login` performed.
- This script will prompt for your project ref and GEMINI API key.
- The GEMINI key is set as a Supabase secret (not committed). You will be
  prompted to paste the function URL after deployment; the script will write
  it into `client/.env` as `VITE_REPOCHAT_URL`.
#>

param(
  [string]$ProjectRef,
  [string]$FunctionName = "repoChat",
  [string]$GeminiApiKey
)

Write-Host "Preparing to deploy Supabase Edge Function '$FunctionName' and set GEMINI_API_KEY..."

if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
  Write-Error "Supabase CLI not found. Install it: https://supabase.com/docs/guides/cli"
  exit 1
}

if (-not $ProjectRef) {
  $ProjectRef = Read-Host "Enter your Supabase project ref (found in Supabase dashboard)"
}

if (-not $GeminiApiKey) {
  $secureKey = Read-Host "Enter GEMINI_API_KEY (input hidden)" -AsSecureString
  $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
  $geminiKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
} else {
  $geminiKey = $GeminiApiKey
}

Write-Host "Deploying function..."
supabase functions deploy $FunctionName --project-ref $ProjectRef
if ($LASTEXITCODE -ne 0) {
  Write-Error "Function deployment failed. Check supabase CLI output above."
  exit 1
}

Write-Host "Setting GEMINI_API_KEY secret (scoped to project)..."
supabase secrets set GEMINI_API_KEY="$geminiKey" --project-ref $ProjectRef
if ($LASTEXITCODE -ne 0) {
  Write-Error "Failed to set secret."
  exit 1
}

Write-Host "Deployment and secret set. When deploying, Supabase may print the function URL.
If not, construct it as: https://<project>.functions.supabase.co/$FunctionName"

$functionUrl = Read-Host "Paste the full function URL (or press Enter to skip)"
if ($functionUrl) {
  $envPath = Join-Path -Path (Get-Location) -ChildPath "client/.env"
  if (Test-Path $envPath) {
    # Remove any existing VITE_REPOCHAT_URL lines
    (Get-Content $envPath) | Where-Object { $_ -notmatch '^VITE_REPOCHAT_URL=' } | Set-Content $envPath
  } else {
    New-Item -Path $envPath -ItemType File -Force | Out-Null
  }
  Add-Content -Path $envPath -Value "VITE_REPOCHAT_URL=$functionUrl"
  Write-Host "Wrote VITE_REPOCHAT_URL to client/.env"
}

Write-Host "All done. Restart Vite (npm run dev) to pick up the new function URL."
