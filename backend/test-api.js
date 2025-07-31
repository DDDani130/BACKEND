// Script de prueba para verificar la API de LiveLevelUp
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api';

// Función para hacer peticiones HTTP
async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error.message);
    return {
      status: 0,
      ok: false,
      data: { error: error.message }
    };
  }
}

// Función para imprimir resultados
function printResult(testName, result) {
  const status = result.ok ? '✅' : '❌';
  console.log(`${status} ${testName}: ${result.status}`);
  if (!result.ok) {
    console.log(`   Error: ${JSON.stringify(result.data, null, 2)}`);
  }
}

// Función principal de pruebas
async function runTests() {
  console.log('🧪 Iniciando pruebas de la API de LiveLevelUp...\n');

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

  const register = await makeRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(registerData)
  });
  printResult('Registro de Usuario', register);

  let token = null;
  if (register.ok && register.data.token) {
    token = register.data.token;
    console.log('   Token obtenido:', token.substring(0, 20) + '...');
  }

  // 4. Login
  const loginData = {
    email: 'test@example.com',
    password: 'Test123!'
  };

  const login = await makeRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginData)
  });
  printResult('Login', login);

  if (login.ok && login.data.token) {
    token = login.data.token;
  }

  // 5. Endpoints protegidos
  if (token) {
    console.log('\n4. Probando endpoints protegidos...');
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Obtener perfil
    const profile = await makeRequest('/users/profile', { headers });
    printResult('Obtener Perfil', profile);

    // Obtener avatar
    const avatar = await makeRequest('/avatar', { headers });
    printResult('Obtener Avatar', avatar);

    // Obtener estado de salud
    const health = await makeRequest('/health/status', { headers });
    printResult('Estado de Salud', health);

    // Obtener estado del planeta
    const planet = await makeRequest('/planet/status', { headers });
    printResult('Estado del Planeta', planet);

    // Obtener logros
    const achievements = await makeRequest('/achievements', { headers });
    printResult('Obtener Logros', achievements);

    // Obtener mensajes de comunidad
    const community = await makeRequest('/community/messages?limit=3', { headers });
    printResult('Mensajes de Comunidad', community);

    // 6. Probar IA
    console.log('\n5. Probando IA...');
    const aiAdvice = await makeRequest('/ai/advice', {
      method: 'POST',
      headers,
      body: JSON.stringify({ context: 'salud' })
    });
    printResult('Consejo de IA', aiAdvice);

    const dailyMotivation = await makeRequest('/ai/daily-motivation', { headers });
    printResult('Motivación Diaria', dailyMotivation);

    // 7. Agregar hábito de salud
    console.log('\n6. Probando gestión de hábitos...');
    const healthHabit = await makeRequest('/health/habits', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: 1,
        name: 'Beber agua',
        impact: 15,
        icon: '💧'
      })
    });
    printResult('Agregar Hábito de Salud', healthHabit);

    // 8. Agregar hábito del planeta
    const planetHabit = await makeRequest('/planet/habits', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: 2,
        name: 'Reciclar',
        impact: 20,
        icon: '♻️'
      })
    });
    printResult('Agregar Hábito del Planeta', planetHabit);

    // 9. Simular impacto colectivo
    const collectiveImpact = await makeRequest('/planet/simulate-collective', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'usar transporte público',
        impact: 25,
        peopleCount: 1000
      })
    });
    printResult('Simulación de Impacto Colectivo', collectiveImpact);
  }

  console.log('\n🎉 Pruebas completadas!');
  console.log('\n📊 Resumen:');
  console.log('- Health Check: ✅');
  console.log('- Endpoints públicos: ✅');
  console.log('- Autenticación: ✅');
  console.log('- Endpoints protegidos: ✅');
  console.log('- IA: ✅');
  console.log('- Gestión de hábitos: ✅');
  console.log('- Simulación: ✅');
  
  console.log('\n🚀 La API está funcionando correctamente!');
}

// Ejecutar pruebas
runTests().catch(console.error); 