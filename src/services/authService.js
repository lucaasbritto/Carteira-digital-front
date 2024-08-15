import api from '../api';

const authService = {

    async login(email, password) {
        try {
            const response = await api.post('/login', { email, password });
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;           
            return token;
        } catch (error) {
            throw new Error('Login failed');
        }
    },

    async register(name, email, password, confirmPassword ) {
      try {
          const response = await api.post('/register', {
              name,
              email,
              password,
              password_confirmation: confirmPassword
          });
          localStorage.setItem('authToken', response.data.token);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          return response.data.token;
      } catch (error) {
          throw new Error('Registration failed');
      }
  },

    async getUserId() {
        try {
            const response = await api.get('/user');
            return response.data.user_id;
        } catch (error) {
            console.error('Failed to get user ID:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
    },

    getToken() {
        return localStorage.getItem('authToken');
    }
};

export default authService;