<template>
  <div>
    <v-app-bar app class="border-b">
      <v-app-bar-title>
        Brasil Card
      </v-app-bar-title>
      <v-spacer></v-spacer>

      <div>
        <v-btn icon color="green darken-1">
          <v-icon>mdi-currency-usd</v-icon>
        </v-btn>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-chip 
              v-if="exchangeRates" 
              class="ml-2" 
              small 
              color="green darken-1" 
              dark 
              v-bind="attrs" 
              v-on="on"
            >
              1 USD = {{ exchangeRates.usd_to_brl }} BRL
            </v-chip>
          </template>
        </v-tooltip>
      </div>

      <v-btn 
        color="secondary" 
        dark 
        @click="openCreateWalletModal"
        >
        Nova Carteira
      </v-btn>

      <v-btn to="/wallet" text>Ver Carteira</v-btn>

      <v-btn to="/transactions" text>Ver Transações</v-btn>

      <LogoutComponent></LogoutComponent>

    </v-app-bar>

    <!-- Modal para criar nova carteira -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Criar Nova Carteira</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              label="Nome da Carteira"
              v-model="walletName"
              required
            ></v-text-field>
            <v-text-field
              label="Cadastrar Pix"
              v-model="walletPix"              
            ></v-text-field>
            <v-text-field
              label="Saldo Inicial"
              v-model="initialBalance"
              type="number"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeCreateWalletModal">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="createWallet">Criar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import LogoutComponent from './LogoutComponent.vue';
import api from '../api';
import { getExchangeRates } from '@/services/apiService';

export default {
  name: 'AppBar',
  components: {
    LogoutComponent
  },
  data() {
    return {
      dialog: false,
      walletName: '',
      walletPix: '',
      initialBalance: '',
      exchangeRates: null,
    };
  },
  mounted() {
    this.buscarApi();
  },
  methods: {
    async buscarApi(){
      try {
        const data = await getExchangeRates();
        this.exchangeRates = data;
      } catch (error) {
        console.error('Erro ao obter taxas de câmbio:', error);
      }
    },
    openCreateWalletModal() {
      this.dialog = true;
    },
    closeCreateWalletModal() {
      this.dialog = false;
    },
    async createWallet() {
      try {
        await api.post('/wallet-create', {
          name: this.walletName,
          pix:this.walletPix,
          valor: this.initialBalance
        });
        this.closeCreateWalletModal();
        this.$router.push('/wallet'); // Exemplo de redirecionamento
      } catch (error) {
            console.error('Erro na transferência:', error);           
        }      
    }
  }
};
</script>

<style scoped>
.v-app-bar {
  z-index: 1;
}

.v-card-title {
  font-weight: bold;
}
</style>