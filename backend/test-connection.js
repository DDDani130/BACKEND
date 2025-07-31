// Script de prueba simple para verificar la conexión con el servidor
import http from 'http';

console.log('🧪 Probando conexión con el servidor...\n');

// Función para hacer una petición HTTP simple
function testConnection() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/health-check',
      method: 'GET',
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
          const data = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: data
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: { raw: body }
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout: El servidor no respondió en 5 segundos'));
    });

    req.end();
  });
}

// Ejecutar prueba
async function runTest() {
  try {
    console.log('1. Probando health check...');
    const result = await testConnection();
    
    if (result.status === 200) {
      console.log('✅ Conexión exitosa!');
      console.log(`   Status: ${result.status}`);
      console.log(`   Respuesta: ${JSON.stringify(result.data, null, 2)}`);
      
      console.log('\n2. Probando endpoint de tips...');
      const tipsResult = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/tips?limit=2',
          method: 'GET',
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
              const data = JSON.parse(body);
              resolve({
                status: res.statusCode,
                data: data
              });
            } catch (error) {
              resolve({
                status: res.statusCode,
                data: { raw: body }
              });
            }
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.setTimeout(5000, () => {
          req.destroy();
          reject(new Error('Timeout'));
        });

        req.end();
      });

      if (tipsResult.status === 200) {
        console.log('✅ Tips obtenidos correctamente!');
        console.log(`   Status: ${tipsResult.status}`);
        console.log(`   Tips encontrados: ${tipsResult.data.tips?.length || 0}`);
      } else {
        console.log('❌ Error obteniendo tips');
        console.log(`   Status: ${tipsResult.status}`);
      }

      console.log('\n🎉 ¡El backend está funcionando correctamente!');
      console.log('📊 API disponible en: http://localhost:5000/api');
      
    } else {
      console.log('❌ Error en la conexión');
      console.log(`   Status: ${result.status}`);
      console.log(`   Respuesta: ${JSON.stringify(result.data, null, 2)}`);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que el servidor esté corriendo en puerto 5000');
    console.log('2. Verificar que no haya otro proceso usando el puerto');
    console.log('3. Verificar la configuración del servidor');
  }
}

runTest(); 