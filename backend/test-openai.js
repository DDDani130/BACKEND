// Script para probar la conexión con OpenAI
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Verificar que la API key esté configurada
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY no está configurada en el archivo .env');
  console.log('📝 Por favor, copia el contenido de config.env al archivo .env');
  process.exit(1);
}

console.log('🔑 API Key configurada:', process.env.OPENAI_API_KEY.substring(0, 20) + '...');

// Crear instancia de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Función para probar la conexión
async function testOpenAIConnection() {
  try {
    console.log('🧪 Probando conexión con OpenAI...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres Dr. Miau, un gato mascota sabio y motivador que da consejos sobre salud personal y del planeta. Siempre sé positivo, amigable y usa emojis apropiados."
        },
        {
          role: "user",
          content: "Genera un consejo motivador para un usuario que acaba de empezar a hacer ejercicio."
        }
      ],
      max_tokens: 100,
      temperature: 0.8
    });

    const response = completion.choices[0].message.content;
    
    console.log('✅ Conexión exitosa con OpenAI!');
    console.log('🤖 Respuesta de prueba:');
    console.log('📝', response);
    console.log('\n🎉 ¡La IA está funcionando correctamente!');
    
    return true;
  } catch (error) {
    console.error('❌ Error conectando con OpenAI:', error.message);
    
    if (error.message.includes('401')) {
      console.log('🔧 Posible solución: Verifica que la API key sea correcta');
    } else if (error.message.includes('429')) {
      console.log('🔧 Posible solución: Has excedido el límite de requests');
    } else if (error.message.includes('500')) {
      console.log('🔧 Posible solución: Error del servidor de OpenAI, intenta más tarde');
    }
    
    return false;
  }
}

// Función para probar diferentes tipos de consejos
async function testDifferentAdviceTypes() {
  console.log('\n🧪 Probando diferentes tipos de consejos...');
  
  const testCases = [
    {
      name: 'Consejo de Salud',
      prompt: 'El usuario tiene 25 años, pesa 70kg y acaba de empezar a correr. Da un consejo motivador.'
    },
    {
      name: 'Consejo del Planeta',
      prompt: 'El usuario acaba de cambiar a transporte público. Celebra su acción y da un consejo adicional.'
    },
    {
      name: 'Consejo de Logro',
      prompt: 'El usuario acaba de desbloquear el logro "Primer paso saludable" 🌱. Celebra su logro.'
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n📋 ${testCase.name}:`);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Eres Dr. Miau, un gato mascota sabio y motivador que da consejos sobre salud personal y del planeta. Siempre sé positivo, amigable y usa emojis apropiados. Responde de forma concisa (máximo 2 frases)."
          },
          {
            role: "user",
            content: testCase.prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.8
      });

      const response = completion.choices[0].message.content;
      console.log('✅ Respuesta:', response);
      
    } catch (error) {
      console.log(`❌ Error en ${testCase.name}:`, error.message);
    }
  }
}

// Función principal
async function main() {
  console.log('🚀 Iniciando pruebas de OpenAI para LiveLevelUp...\n');
  
  // Probar conexión básica
  const connectionSuccess = await testOpenAIConnection();
  
  if (connectionSuccess) {
    // Probar diferentes tipos de consejos
    await testDifferentAdviceTypes();
    
    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
    console.log('✅ La IA está lista para usar en LiveLevelUp');
    console.log('🔗 Puedes ejecutar el servidor con: npm run dev');
  } else {
    console.log('\n❌ Las pruebas fallaron. Revisa la configuración.');
  }
}

// Ejecutar pruebas
main().catch(console.error); 