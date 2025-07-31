// Configuración de la API
const API_CONFIG = {
  // URL base de la API - Conectada al backend
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  
  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: 10000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Endpoints de la API - Todos conectados al backend
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      VERIFY: '/auth/verify',
      UPDATE_PASSWORD: '/auth/updatepassword'
    },
    
    // Usuarios
    USERS: {
      PROFILE: '/users/profile',
      PREFERENCES: '/users/preferences',
      PROGRESS: '/users/progress',
      ACHIEVEMENTS: '/users/achievements',
      STATS: '/users/stats',
      LEADERBOARD: '/users/leaderboard'
    },
    
    // Avatar
    AVATAR: {
      GET: '/avatar',
      CLOTHING: '/avatar/clothing',
      CUSTOMIZATIONS: '/avatar/customizations',
      CLOTHING_ITEMS: '/avatar/clothing-items',
      COLORS: '/avatar/colors',
      RESET: '/avatar/reset',
      FULL: '/avatar/full'
    },
    
    // Salud
    HEALTH: {
      STATUS: '/health/status',
      HABITS: '/health/habits',
      ACTIONS: '/health/actions',
      PROFILE: '/health/profile',
      STATS: '/health/stats'
    },
    
    // Planeta
    PLANET: {
      STATUS: '/planet/status',
      HABITS: '/planet/habits',
      ACTIONS: '/planet/actions',
      SIMULATE_COLLECTIVE: '/planet/simulate-collective',
      STATS: '/planet/stats',
      LEADERBOARD: '/planet/leaderboard'
    },
    
    // IA
    AI: {
      ADVICE: '/ai/advice',
      ACTION_ADVICE: '/ai/action-advice',
      DAILY_MOTIVATION: '/ai/daily-motivation',
      ACHIEVEMENT_ADVICE: '/ai/achievement-advice'
    },
    
    // Comunidad
    COMMUNITY: {
      MESSAGES: '/community/messages',
      SEARCH: '/community/search',
      POPULAR: '/community/popular',
      STATS: '/community/stats'
    },
    
    // Logros
    ACHIEVEMENTS: {
      GET: '/achievements',
      CHECK: '/achievements/check',
      DEFINITIONS: '/achievements/definitions'
    },
    
    // Tips
    TIPS: {
      GET: '/tips',
      RANDOM: '/tips/random',
      FEATURED: '/tips/featured',
      SEARCH: '/tips/search',
      CATEGORIES: '/tips/categories',
      STATS: '/tips/stats',
      RATE: (id) => `/tips/${id}/rate`
    }
  }
};

// Clase para manejar las peticiones HTTP
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Guardar token en localStorage
  setToken(token) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Obtener headers con autenticación
  getHeaders() {
    const token = this.getToken();
    return {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Función genérica para hacer peticiones HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      timeout: this.timeout,
      ...options
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Si la respuesta no es exitosa, lanzar error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Si la respuesta es exitosa, retornar los datos
      const data = await response.json();
      return data;
    } catch (error) {
      // Si es un error de timeout
      if (error.name === 'AbortError') {
        throw new Error('La petición tardó demasiado tiempo');
      }
      
      // Si es un error de red
      if (error.name === 'TypeError') {
        throw new Error('Error de conexión. Verifica que el backend esté corriendo en http://localhost:5000');
      }
      
      throw error;
    }
  }

  // Métodos HTTP
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Métodos específicos para autenticación
  async register(userData) {
    const response = await this.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    try {
      await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } finally {
      this.setToken(null);
    }
  }

  async verifyToken() {
    return this.get(API_CONFIG.ENDPOINTS.AUTH.VERIFY);
  }

  // Métodos para gestión de hábitos
  async addHealthHabit(habitData) {
    return this.post(API_CONFIG.ENDPOINTS.HEALTH.HABITS, habitData);
  }

  async removeHealthHabit(habitId) {
    return this.delete(`${API_CONFIG.ENDPOINTS.HEALTH.HABITS}/${habitId}`);
  }

  async addHealthAction(actionData) {
    return this.post(API_CONFIG.ENDPOINTS.HEALTH.ACTIONS, actionData);
  }

  async removeHealthAction(actionId) {
    return this.delete(`${API_CONFIG.ENDPOINTS.HEALTH.ACTIONS}/${actionId}`);
  }

  async addPlanetHabit(habitData) {
    return this.post(API_CONFIG.ENDPOINTS.PLANET.HABITS, habitData);
  }

  async removePlanetHabit(habitId) {
    return this.delete(`${API_CONFIG.ENDPOINTS.PLANET.HABITS}/${habitId}`);
  }

  async addPlanetAction(actionData) {
    return this.post(API_CONFIG.ENDPOINTS.PLANET.ACTIONS, actionData);
  }

  async removePlanetAction(actionId) {
    return this.delete(`${API_CONFIG.ENDPOINTS.PLANET.ACTIONS}/${actionId}`);
  }

  // Métodos para IA
  async getAdvice(context = 'general') {
    return this.post(API_CONFIG.ENDPOINTS.AI.ADVICE, { context });
  }

  async getActionAdvice(action, impact, category) {
    return this.post(API_CONFIG.ENDPOINTS.AI.ACTION_ADVICE, {
      action,
      impact,
      category
    });
  }

  async getDailyMotivation() {
    return this.get(API_CONFIG.ENDPOINTS.AI.DAILY_MOTIVATION);
  }

  async getAchievementAdvice(achievementName, achievementIcon, category) {
    return this.post(API_CONFIG.ENDPOINTS.AI.ACHIEVEMENT_ADVICE, {
      achievementName,
      achievementIcon,
      category
    });
  }

  // Métodos para comunidad
  async getCommunityMessages(params = {}) {
    return this.get(API_CONFIG.ENDPOINTS.COMMUNITY.MESSAGES, params);
  }

  async createCommunityMessage(messageData) {
    return this.post(API_CONFIG.ENDPOINTS.COMMUNITY.MESSAGES, messageData);
  }

  async likeCommunityMessage(messageId) {
    return this.post(`${API_CONFIG.ENDPOINTS.COMMUNITY.MESSAGES}/${messageId}/like`);
  }

  async replyToMessage(messageId, message) {
    return this.post(`${API_CONFIG.ENDPOINTS.COMMUNITY.MESSAGES}/${messageId}/reply`, { message });
  }

  // Métodos para tips
  async getTips(params = {}) {
    return this.get(API_CONFIG.ENDPOINTS.TIPS.GET, params);
  }

  async getRandomTip(category) {
    return this.get(API_CONFIG.ENDPOINTS.TIPS.RANDOM, category ? { category } : {});
  }

  async getFeaturedTips() {
    return this.get(API_CONFIG.ENDPOINTS.TIPS.FEATURED);
  }

  async searchTips(query, params = {}) {
    return this.get(API_CONFIG.ENDPOINTS.TIPS.SEARCH, { q: query, ...params });
  }

  async rateTip(tipId, rating) {
    return this.post(API_CONFIG.ENDPOINTS.TIPS.RATE(tipId), { rating });
  }

  // Métodos para logros
  async getAchievements() {
    return this.get(API_CONFIG.ENDPOINTS.ACHIEVEMENTS.GET);
  }

  async checkAchievements() {
    return this.post(API_CONFIG.ENDPOINTS.ACHIEVEMENTS.CHECK);
  }

  // Métodos para avatar
  async getAvatar() {
    return this.get(API_CONFIG.ENDPOINTS.AVATAR.GET);
  }

  async updateAvatarClothing(clothingData) {
    return this.put(API_CONFIG.ENDPOINTS.AVATAR.CLOTHING, clothingData);
  }

  async updateAvatarCustomizations(customizationsData) {
    return this.put(API_CONFIG.ENDPOINTS.AVATAR.CUSTOMIZATIONS, customizationsData);
  }

  async getClothingItems() {
    return this.get(API_CONFIG.ENDPOINTS.AVATAR.CLOTHING_ITEMS);
  }

  async getColors() {
    return this.get(API_CONFIG.ENDPOINTS.AVATAR.COLORS);
  }

  // Métodos para simulación
  async simulateCollectiveImpact(action, impact, peopleCount) {
    return this.post(API_CONFIG.ENDPOINTS.PLANET.SIMULATE_COLLECTIVE, {
      action,
      impact,
      peopleCount
    });
  }

  // Método para verificar conexión con el backend
  async checkBackendConnection() {
    try {
      const response = await this.get('/health-check');
      return { connected: true, data: response };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}

// Crear instancia única del servicio
const apiService = new ApiService();

// Exportar configuración y servicio
export { API_CONFIG, ApiService, apiService as default }; 