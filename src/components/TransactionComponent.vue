<template>
  <AppBar />
  <v-main>
    <v-container>
      <h2>Transações</h2>
      <v-card>
        <div>
          <v-data-table
            :headers="headers"
            :items="transactions"
            item-value="id"
            class="elevation-1"
            :items-per-page="5"
            :loading="loading"
            loading-text="Carregando transações..."
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Extrato</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
              </v-toolbar>
            </template>

            <template v-slot:[`item.index`]="{ index }">
              <span>{{ index + 1 }}</span>
            </template>
            
            <template v-slot:[`item.sender_wallet_id`]="{ item }">
              <span>{{ item.sender_wallet.user_id === loggedInUserId ? `${item.sender_wallet.cod} - ${item.sender_wallet.name}`: item.sender_wallet.user.name }}</span>
            </template>

            <template v-slot:[`item.receiver_wallet_id`]="{ item }">
              <span>{{ item.receiver_wallet ? (item.receiver_wallet.user_id === loggedInUserId ? `${item.receiver_wallet.cod} - ${item.receiver_wallet.name}` : `${item.receiver_wallet.cod} - ${item.receiver_wallet.user.name}`) : 'PIX' }}</span>
            </template>

            <template v-slot:[`item.quantia`]="{ item }">      
              <span :style="getQuantiaStyle(item.quantia, item.sender_wallet_id)">
                {{ item.sender_wallet_id === loggedInUserId ? 
                  `- R$ ${item.quantia}` : 
                  `+ R$ ${item.quantia}` 
                }}
              </span>
            </template>

            <template v-slot:[`item.tipo`]="{ item }">
              <span>{{ item.tipo }}</span>
            </template>

            <template v-slot:[`item.created_at_time`]="{ item }">
              <span>{{ formatTime(item.created_at) }}</span>
            </template>

            <template v-slot:[`item.created_at`]="{ item }">
              <span>{{ formatDate(item.created_at) }}</span>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import api from '../api';
import authService from '../services/authService';
import AppBar from './AppBar.vue';

export default {
  name: 'TransactionComponent',
  components: {
    AppBar 
  },
  data() {
    return {
      transactions: [],
      loggedInUserId: null,
      loading: true,
      headers: [
        { title: 'P', value: 'index' },
        { title: 'Remetente', value: 'sender_wallet_id' },
        { title: 'Destinatário', value: 'receiver_wallet_id' },
        { title: 'Valor', value: 'quantia' },
        { title: 'Transação', value: 'tipo' },
        { title: 'Hora', value: 'created_at_time' },
        { title: 'Data', value: 'created_at' }
      ]
    };
  },

  mounted() {
    this.getUser();
    this.fetchTransactions();
  },

  methods: {

    // Buscar Transações
    async fetchTransactions() {
      try {
        const response = await api.get('/transactions');      
        this.transactions = response.data;
        this.loading = false;
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
        this.loading = false;
      }
    },

    // Buscar Usuario
    async getUser() {
      try {
        this.loggedInUserId = await authService.getUserId();      
        console.log(this.loggedInUserId);
      } catch (error) {
        console.error('Erro ao obter ID do usuário:', error);
      }
    },

    // Verificar se é positivo ou negativo e colocar uma cor
    getQuantiaStyle(quantia, senderWalletId) {
      if (senderWalletId === this.loggedInUserId) {
        return 'color: red';
      } else {
        return 'color: green';
      }
    },

    // Formatar Data
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    // Formatar Hora
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString(); // Formata a hora (e.g., 14:30:00)
    },
  }
};
</script>


<style scoped>
</style>