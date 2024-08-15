<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="6" offset-md="3">
          <v-card>
            <v-card-title>
              <span class="headline">Criar Nova Conta</span>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="register">
                <v-text-field
                  v-model="name"
                  label="Name"
                  :rules="nameRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="email"
                  label="Email"
                  type="email"
                  :rules="emailRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  :rules="passwordRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  :rules="confirmPasswordRules"
                  required
                ></v-text-field>
                <v-btn type="submit" color="primary">Cadastrar</v-btn>
                <v-alert
                  v-if="error"
                  type="error"
                  class="mt-4"
                  dismissible
                >{{ error }}</v-alert>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import authService from '../services/authService';
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: null,
        nameRules: [
          v => !!v || 'Name is required'
        ],
        emailRules: [
          v => !!v || 'Email is required',
          v => /.+@.+\..+/.test(v) || 'Email must be valid'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => v.length >= 6 || 'Password must be at least 6 characters'
        ]
      };
    },
    computed: {
      confirmPasswordRules() {
        return [
          v => !!v || 'Confirm password is required',
          v => v === this.password || 'Senha Invalida'
        ];
      }
    },
    methods: {
      async register() {
        try {
          if (this.password !== this.confirmPassword) {
            this.error = "Senha não coincidem,";
            return;
          }
  
          await authService.register(
            this.name,
            this.email,
            this.password,
            this.confirmPassword
          );
  
          this.$router.push({ name: 'wallet' }); // Redirecionar para a página principal após o registro
        } catch (error) {
          this.error = error.response?.data?.message || 'Erro ao criar a conta, tente novamente';
        }
      }
    }
  };
  </script>