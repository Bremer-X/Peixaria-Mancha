@echo off
echo ===========================================
echo ATUALIZANDO PEIXARIA MANCHA NO GITHUB
echo ===========================================
echo.
git add .
git commit -m "Atualizacao automatica via assistente"
git push origin master
echo.
echo ===========================================
echo CONCLUIDO! VERIFIQUE O GITHUB/HOSTINGER.
echo ===========================================
pause
