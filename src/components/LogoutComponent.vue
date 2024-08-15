<template>
    <v-btn @click="logout">Logout</v-btn>
  </template>
  
  <script>
  import authService from '../services/authService';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'LogoutComponent',
    setup() {
      const router = useRouter();
  
      const logout = async () => {
        try {
          authService.logout();
          router.push('/');
        } catch (error) {
          console.error('Error during logout:', error);
        }
      };
  
      return {
        logout
      };
    }
  };
  </script>