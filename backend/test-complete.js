// Script de prueba completo para verificar la API de LiveLevelUp
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
    console.log(`   Respuesta: ${JSON.stringify(result.data, null, 2).substring(0, 150)}...`);
  } else {
    console.log(`   Error: ${JSON.stringify(result.data, null, 2)}`);
  }
}

// Función principal de pruebas
async function runTests() {
  console.log('🧪 Iniciando pruebas completas de la API de LiveLevelUp...\n');

  let testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };

  try {
    // 1. Health Check
    console.log('1. 🔍 Verificando health check...');
    const healthCheck = await makeRequest('/health-check');
    printResult('Health Check', healthCheck);
    testResults.total++;
    if (healthCheck.ok) testResults.passed++; else testResults.failed++;

    // 2. Endpoints públicos de Tips
    console.log('\n2. 💡 Probando endpoints de Tips...');
    
    const tips = await makeRequest('/tips?limit=3');
    printResult('Obtener Tips', tips);
    testResults.total++;
    if (tips.ok) testResults.passed++; else testResults.failed++;

    const randomTip = await makeRequest('/tips/random');
    printResult('Tip Aleatorio', randomTip);
    testResults.total++;
    if (randomTip.ok) testResults.passed++; else testResults.failed++;

    const featuredTips = await makeRequest('/tips/featured');
    printResult('Tips Destacados', featuredTips);
    testResults.total++;
    if (featuredTips.ok) testResults.passed++; else testResults.failed++;

    const categories = await makeRequest('/tips/categories');
    printResult('Categorías', categories);
    testResults.total++;
    if (categories.ok) testResults.passed++; else testResults.failed++;

    // 3. Autenticación
    console.log('\n3. 🔐 Probando autenticación...');
    
    const registerData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!'
    };

    const register = await makeRequest('/auth/register', 'POST', registerData);
    printResult('Registro de Usuario', register);
    testResults.total++;
    if (register.ok) testResults.passed++; else testResults.failed++;

    const loginData = {
      email: 'test@example.com',
      password: 'Test123!'
    };

    const login = await makeRequest('/auth/login', 'POST', loginData);
    printResult('Login', login);
    testResults.total++;
    if (login.ok) testResults.passed++; else testResults.failed++;

    // 4. Endpoints de Avatar
    console.log('\n4. 🎨 Probando endpoints de Avatar...');
    
    const avatar = await makeRequest('/avatar');
    printResult('Obtener Avatar', avatar);
    testResults.total++;
    if (avatar.ok) testResults.passed++; else testResults.failed++;

    const clothingItems = await makeRequest('/avatar/clothing-items');
    printResult('Items de Ropa', clothingItems);
    testResults.total++;
    if (clothingItems.ok) testResults.passed++; else testResults.failed++;

    const colors = await makeRequest('/avatar/colors');
    printResult('Colores Disponibles', colors);
    testResults.total++;
    if (colors.ok) testResults.passed++; else testResults.failed++;

    // 5. Endpoints de Salud
    console.log('\n5. 🏥 Probando endpoints de Salud...');
    
    const healthStatus = await makeRequest('/health/status');
    printResult('Estado de Salud', healthStatus);
    testResults.total++;
    if (healthStatus.ok) testResults.passed++; else testResults.failed++;

    const healthStats = await makeRequest('/health/stats');
    printResult('Estadísticas de Salud', healthStats);
    testResults.total++;
    if (healthStats.ok) testResults.passed++; else testResults.failed++;

    // 6. Endpoints de Planeta
    console.log('\n6. 🌍 Probando endpoints de Planeta...');
    
    const planetStatus = await makeRequest('/planet/status');
    printResult('Estado del Planeta', planetStatus);
    testResults.total++;
    if (planetStatus.ok) testResults.passed++; else testResults.failed++;

    const planetStats = await makeRequest('/planet/stats');
    printResult('Estadísticas del Planeta', planetStats);
    testResults.total++;
    if (planetStats.ok) testResults.passed++; else testResults.failed++;

    // 7. Endpoints de Comunidad
    console.log('\n7. 👥 Probando endpoints de Comunidad...');
    
    const communityMessages = await makeRequest('/community/messages?limit=3');
    printResult('Mensajes de Comunidad', communityMessages);
    testResults.total++;
    if (communityMessages.ok) testResults.passed++; else testResults.failed++;

    const popularMessages = await makeRequest('/community/popular');
    printResult('Mensajes Populares', popularMessages);
    testResults.total++;
    if (popularMessages.ok) testResults.passed++; else testResults.failed++;

    // 8. Endpoints de Logros
    console.log('\n8. 🏆 Probando endpoints de Logros...');
    
    const achievements = await makeRequest('/achievements');
    printResult('Obtener Logros', achievements);
    testResults.total++;
    if (achievements.ok) testResults.passed++; else testResults.failed++;

    const achievementDefinitions = await makeRequest('/achievements/definitions');
    printResult('Definiciones de Logros', achievementDefinitions);
    testResults.total++;
    if (achievementDefinitions.ok) testResults.passed++; else testResults.failed++;

    // 9. Endpoints de IA
    console.log('\n9. 🤖 Probando endpoints de IA...');
    
    const dailyMotivation = await makeRequest('/ai/daily-motivation');
    printResult('Motivación Diaria', dailyMotivation);
    testResults.total++;
    if (dailyMotivation.ok) testResults.passed++; else testResults.failed++;

    // 10. Endpoints de Usuarios
    console.log('\n10. 👤 Probando endpoints de Usuarios...');
    
    const userStats = await makeRequest('/users/stats');
    printResult('Estadísticas de Usuario', userStats);
    testResults.total++;
    if (userStats.ok) testResults.passed++; else testResults.failed++;

    const leaderboard = await makeRequest('/users/leaderboard');
    printResult('Ranking de Usuarios', leaderboard);
    testResults.total++;
    if (leaderboard.ok) testResults.passed++; else testResults.failed++;

    // Resumen final
    console.log('\n🎉 Pruebas completadas!');
    console.log('\n📊 Resumen:');
    console.log(`✅ Exitosas: ${testResults.passed}`);
    console.log(`❌ Fallidas: ${testResults.failed}`);
    console.log(`📈 Total: ${testResults.total}`);
    console.log(`📊 Porcentaje de éxito: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed === 0) {
      console.log('\n🚀 ¡TODAS LAS PRUEBAS PASARON! El backend está funcionando perfectamente.');
    } else {
      console.log('\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.');
    }
    
    console.log('\n🔗 La API está disponible en: http://localhost:5000/api');
    console.log('📚 Documentación completa en: backend/README.md');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que el servidor esté corriendo en puerto 5000');
    console.log('2. Verificar que no haya otro proceso usando el puerto');
    console.log('3. Verificar la configuración del servidor');
    console.log('4. Verificar la conexión a MongoDB');
  }
}

// Ejecutar pruebas
runTests(); 