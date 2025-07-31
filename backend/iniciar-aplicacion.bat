@echo off
echo ========================================
echo    INICIANDO LIVELEVELUP
echo ========================================
echo.

echo [1/3] Iniciando MongoDB...
echo MongoDB ya debe estar corriendo en mongodb://localhost:27017
echo.

echo [2/3] Iniciando Backend...
start "Backend LiveLevelUp" cmd /k "cd /d C:\Users\LENOVO\Desktop\BACKEND\backend && node server.js"
timeout /t 3 /nobreak >nul

echo [3/3] Iniciando Frontend...
start "Frontend LiveLevelUp" cmd /k "cd /d C:\Users\LENOVO\Desktop\BACKEND\LiveLevelUpReact && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo    APLICACION INICIADA
echo ========================================
echo.
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:5176/
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause >nul

start http://localhost:5176/
start http://localhost:5000/api

echo.
echo ¡Aplicacion iniciada correctamente!
echo Manten las ventanas de terminal abiertas.
pause 