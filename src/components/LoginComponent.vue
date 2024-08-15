<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
        <v-card>
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="[emailRules]"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                :rules="[passwordRules]"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary">Login</v-btn>
              <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="goToRegister">Criar Conta</v-btn>
          </v-card-actions>
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
      email: '',
      password: '',
      error: null,
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required'
      ]
    };
  },
  methods: {
    async login() {
      try {
        await authService.login(this.email, this.password);
        this.$router.push({ name: 'wallet' });
      } catch (error) {
        this.error = 'Invalid email or password';
      }
    },
    goToRegister() {
      this.$router.push({ name: 'register' });
    }
  }
};
</script>