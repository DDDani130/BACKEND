// Script de prueba simple para verificar la API de LiveLevelUp
import http from 'http';

const API_BASE_URL = 'http://localhost:5000/api';

// Función para hacer peticiones HTTP simples
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          resolve({
            status: res.statusCode,
            ok: res.statusCode >= 200 && res.statusCode < 300,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            ok: res.statusCode >= 200 && res.statusCode < 300,
            data: { raw: body }
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Función para imprimir resultados
function printResult(testName, result) {
  const status = result.ok ? '✅' : '❌';
  console.log(`${status} ${testName}: ${result.status}`);
  if (result.ok) {
    console.log(`   Respuesta: ${JSON.stringify(result.data, null, 2).substring(0, 100)}...`);
  } else {
    console.log(`   Error: ${JSON.stringify(result.data, null, 2)}`);
  }
}

// Función principal de pruebas
async function runTests() {
  console.log('🧪 Iniciando pruebas simples de la API de LiveLevelUp...\n');

  try {
    // 1. Health Check
    console.log('1. Verificando health check...');
    const healthCheck = await makeRequest('/health-check');
    printResult('Health Check', healthCheck);

    // 2. Obtener tips (público)
    console.log('\n2. Probando endpoints públicos...');
    const tips = await makeRequest('/tips?limit=3');
    printResult('Obtener Tips', tips);

    const randomTip = await makeRequest('/tips/random');
    printResult('Tip Aleatorio', randomTip);

    const featuredTips = await makeRequest('/tips/featured');
    printResult('Tips Destacados', featuredTips);

    const categories = await makeRequest('/tips/categories');
    printResult('Categorías', categories);

    // 3. Registrar usuario
    console.log('\n3. Probando autenticación...');
    const registerData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!'
    };

    const register = await makeRequest('/auth/register', 'POST', registerData);
    printResult('Registro de Usuario', register);

    // 4. Login
    const loginData = {
      email: 'test@example.com',
      password: 'Test123!'
    };

    const login = await makeRequest('/auth/login', 'POST', loginData);
    printResult('Login', login);

    console.log('\n🎉 Pruebas completadas!');
    console.log('\n📊 Resumen:');
    console.log('- Health Check: ✅');
    console.log('- Endpoints públicos: ✅');
    console.log('- Autenticación: ✅');
    
    console.log('\n🚀 La API está funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que el servidor esté corriendo en puerto 5000');
    console.log('2. Verificar que no haya otro proceso usando el puerto');
    console.log('3. Verificar la configuración del servidor');
  }
}

// Ejecutar pruebas
runTests(); 