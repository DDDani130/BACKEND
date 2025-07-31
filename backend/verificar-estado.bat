@echo off
echo ========================================
echo    VERIFICANDO ESTADO DE SERVICIOS
echo ========================================
echo.

echo [1/3] Verificando MongoDB...
netstat -an | findstr :27017
if %errorlevel% equ 0 (
    echo ✅ MongoDB: CONECTADO
) else (
    echo ❌ MongoDB: NO CONECTADO
)
echo.

echo [2/3] Verificando Backend...
netstat -an | findstr :5000
if %errorlevel% equ 0 (
    echo ✅ Backend: CONECTADO
) else (
    echo ❌ Backend: NO CONECTADO
)
echo.

echo [3/3] Verificando Frontend...
netstat -an | findstr :5176
if %errorlevel% equ 0 (
    echo ✅ Frontend: CONECTADO
) else (
    echo ❌ Frontend: NO CONECTADO
)
echo.

echo ========================================
echo    ENLACES DE ACCESO
echo ========================================
echo.
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:5176/
echo.
echo Presiona cualquier tecla para abrir...
pause >nul

start http://localhost:5176/
start http://localhost:5000/api

pause 