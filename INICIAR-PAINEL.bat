@echo off
title Servidor Painel & Delivery - Peixaria Mancha
echo =========================================================
echo   INICIANDO SERVIDOR NODE.JS + MONGODB (PEIXARIA MANCHA)
echo =========================================================
echo.
cd /d "%~dp0backend"
node server.js
pause
