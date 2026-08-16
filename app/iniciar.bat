@echo off
title Paris - App de Viagem
cd /d "%~dp0"
echo.
echo  ========================================
echo   APP PARIS - Roteiro de Viagem
echo  ========================================
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  set IP=%%a
  goto :found
)
:found
set IP=%IP: =%
echo  No celular (mesmo Wi-Fi), abra:
echo.
echo    http://%IP%:8080
echo.
echo  Depois: Adicionar a Tela de Inicio
echo  Pressione Ctrl+C para parar
echo.
python -m http.server 8080
