#!/usr/bin/env pwsh
# Script para generar contraseñas para Jitsi Meet en Windows

function Generate-HexPassword {
    # Genera una contraseña hexadecimal de 32 caracteres (equivalente a openssl rand -hex 16)
    $hexChars = '0123456789abcdef'
    $password = ''
    for ($i = 0; $i -lt 32; $i++) {
        $password += $hexChars[(Get-Random -Maximum $hexChars.Length)]
    }
    return $password
}

$envFile = Join-Path $PSScriptRoot ".env"

# Si no existe .env, copiar desde env.example
if (-not (Test-Path $envFile)) {
    $exampleFile = Join-Path $PSScriptRoot "env.example"
    if (Test-Path $exampleFile) {
        Copy-Item $exampleFile $envFile
        Write-Host "Archivo .env creado desde env.example"
    } else {
        Write-Error "No se encontró env.example"
        exit 1
    }
}

# Leer el contenido del archivo
$content = Get-Content $envFile -Raw

# Generar y reemplazar cada contraseña
Write-Host "Generando contraseñas..."

$jicofoPassword = Generate-HexPassword
$jvbPassword = Generate-HexPassword
$jigasiXmppPassword = Generate-HexPassword
$jibriRecorderPassword = Generate-HexPassword
$jibriXmppPassword = Generate-HexPassword
$jigasiTranscriberPassword = Generate-HexPassword

$content = $content -replace "JICOFO_AUTH_PASSWORD=.*", "JICOFO_AUTH_PASSWORD=$jicofoPassword"
$content = $content -replace "JVB_AUTH_PASSWORD=.*", "JVB_AUTH_PASSWORD=$jvbPassword"
$content = $content -replace "JIGASI_XMPP_PASSWORD=.*", "JIGASI_XMPP_PASSWORD=$jigasiXmppPassword"
$content = $content -replace "JIBRI_RECORDER_PASSWORD=.*", "JIBRI_RECORDER_PASSWORD=$jibriRecorderPassword"
$content = $content -replace "JIBRI_XMPP_PASSWORD=.*", "JIBRI_XMPP_PASSWORD=$jibriXmppPassword"
$content = $content -replace "JIGASI_TRANSCRIBER_PASSWORD=.*", "JIGASI_TRANSCRIBER_PASSWORD=$jigasiTranscriberPassword"

# Guardar el archivo
Set-Content -Path $envFile -Value $content -NoNewline

Write-Host "✓ Contraseñas generadas y actualizadas en .env"
Write-Host ""
Write-Host "Contraseñas generadas:"
Write-Host "  JICOFO_AUTH_PASSWORD: $jicofoPassword"
Write-Host "  JVB_AUTH_PASSWORD: $jvbPassword"
Write-Host "  JIGASI_XMPP_PASSWORD: $jigasiXmppPassword"
Write-Host "  JIBRI_RECORDER_PASSWORD: $jibriRecorderPassword"
Write-Host "  JIBRI_XMPP_PASSWORD: $jibriXmppPassword"
Write-Host "  JIGASI_TRANSCRIBER_PASSWORD: $jigasiTranscriberPassword"

