<template> 
    <AppBar />   

    <v-main>
      <v-container>          
        <h2>Selecionar Carteira</h2>
          <v-select
            v-model="selectedWalletId"
            :items="walletOptionsWithFullTitle"
            item-title="fullTitle"
            item-value="id"
            label="Selecionar Carteira"
            @update:modelValue="fetchWalletDetails"
          />          
      </v-container>
          

      <v-container>
        <v-card>     
          <v-card-title v-if="loading">
            Carregando a carteira, por favor aguarde...
          </v-card-title>
              
          <template v-if="selectedWalletId && !loadingDetails && !loading">
            
            <div class="d-flex align-center justify-between mb-4 divTitleWallet">
              <v-card-title>{{ nameWallet }}</v-card-title>

              <v-spacer></v-spacer>             

              <v-card-title>Saldo: R$ {{ valor }}</v-card-title>
            </div>           
                          
            
            <v-row class="mt-4">
                           
              <v-col cols="6">
                <div style="border-right: 1px solid #000429;">
                  <v-card-title>
                    Forma de Transferência:
                  </v-card-title>
                  <v-radio-group v-model="transferType" row class="mb-0">
                    <v-radio label="Carteira de Usuário" value="wallet" />
                    <v-radio label="Minhas Carteiras" value="my_wallet" />
                    <v-radio label="PIX" value="pix" />
                  </v-radio-group>
                </div>
              </v-col>

              
              <v-col cols="6">                
                <v-card-title v-if="transferType === 'wallet'">Selecionar Usuário:</v-card-title>
                <v-card-title v-if="transferType === 'my_wallet'">Escolher Minha Carteira:</v-card-title>
                <v-card-title v-if="transferType === 'pix'">Digite o PIX:</v-card-title>

                <v-select
                  v-if="transferType === 'wallet'"
                  v-model="receiverWalletId"
                  :items="userOptionsWithFullTitle"
                  item-title="fullTitle"
                  item-value="id"
                  label="Selecionar Usuário"
                ></v-select>

                <v-select
                    v-if="transferType === 'my_wallet'"
                    v-model="receiverWalletId"
                    :items="filteredWalletOptions"
                    item-title="fullTitle"
                    item-value="id"
                    label="Selecione uma de suas carteiras"
                ></v-select>

                <v-text-field
                  v-if="transferType === 'pix'"
                  v-model="receiverPixKey"
                  label="Chave PIX"
                  @input="clearTablePix"
                >
                  <template v-slot:append>
                    <v-btn 
                      @click="fetchPersonName" 
                      icon color="green" 
                      title="Pesquisar por chave PIX"
                    >
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
            
                <v-data-table 
                  v-if="hideTable && transferType === 'pix' && receiverPixKey.length > 0"
                  density="compact"
                  :headers="headers"
                  :items="tableData"
                  class="custom-margin"
                  :hide-default-footer="true"
                  :loading="loadingTable"
                  loading-text="Procurando Pix..."
                >               
                  <template v-slot:[`item.name`]="{ item }">
                    <td>{{ item.name }}</td>
                  </template>
                  <template v-slot:[`item.details`]="{ item }">
                    <td>{{ item.details }}</td>
                  </template>
                </v-data-table>
            
              </v-col>
            </v-row>
            
            <hr class="divider"/>

            <v-row>            
              <v-col cols="12 mt-6">
                <v-row class="d-flex justify-end">
                  <v-col cols="auto" class="d-flex align-center">
                    <v-card-title class="mr-2">Valor:</v-card-title>
                    <v-text-field
                      v-model="quantia"
                      label="Valor a transferir"
                      type="number"
                      class="w-50"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
         
            <hr class="divider"/>

            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn 
                  @click="transfer" 
                  :disabled="!isTransferButtonEnabled"
                  class="green--text white mb-6 mt-6" 
                  color="green" 
                  dark
                >
                <v-icon left>mdi-transfer</v-icon>  
                  Transferir
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-card>
      </v-container>
    </v-main>
</template>
  
<script>
  import api from '../api';
  import AppBar from './AppBar.vue';
  import { useToast } from "vue-toastification";

  export default {
    name: 'WalletComponent',
    components: {
      AppBar,
    },

    data() {
      return {
        valor: 0,
        nameWallet: "Carteira Escolhida",
        quantia: '',
        receiverWalletId: null,      
        walletOptions: [],  
        userOptions: [],  
        selectedWalletId: null,
        receiverPixKey: '',
        transferType: 'wallet', 
        loading: false,
        loadingTable: true,
        hideTable: false,
        toast: null,
        nameWalletPix: '',
        codWalletPix: '',
        nameUserPix: '',
        headers: [
          { title: 'Nome da Pessoa', value: 'name' },
          { title: 'Carteira', value: 'details' },
        ],
        tableData: [],
      };
    },

    computed: {

      // Concatenar Cod e nome da carteira
      walletOptionsWithFullTitle() {
        return this.walletOptions.map(wallet => ({
          ...wallet,
          fullTitle: `${wallet.cod} - ${wallet.userName}` 
        }));
      },

      // Concatenar Cod e nome do usuario
      userOptionsWithFullTitle() {
        return this.userOptions.map(wallet => ({
          ...wallet,
          fullTitle: `${wallet.cod} - ${wallet.userName}` 
        }));
      }, 

      // Filtrar carteira do usuario logado para transferir
      filteredWalletOptions() {
        return this.walletOptionsWithFullTitle.filter(wallet => wallet.id !== this.selectedWalletId);
      },

      // Habilitar botao de transferi
      isTransferButtonEnabled() {        
        return (this.transferType === 'pix' && this.receiverPixKey.length > 0 && this.tableData.length > 0) ||
              ((this.transferType === 'wallet' || this.transferType === 'my_wallet') && this.receiverWalletId !== null);
      }    
    },


    mounted() {
      this.fetchWallets(); 
      this.toast = useToast();
    },


    methods: {

      //  Buscar Carteiras do usuario logado
      async fetchWallets() {
        try {
          const response = await api.get('/wallets');
          
          this.walletOptions = response.data.map(wallet => ({
            id: wallet.id,
            cod: wallet.cod,
            userName: wallet.name 
          }));
        } catch (error) {
          console.error('Erro ao buscar carteiras:', error);
        }
      },
      
      // Buscar os dados da carteira depois de selecionar uma
      async fetchWalletDetails(){
        this.loading = true;
        if (this.selectedWalletId) {
          try {
            const selectedWallet = this.walletOptions.find(wallet => wallet.id === this.selectedWalletId);
            if (selectedWallet) {
              this.nameWallet = `${selectedWallet.cod} - ${selectedWallet.userName}`;
            }

            const response = await api.get(`/wallet/${this.selectedWalletId}`);           
            this.valor = response.data.valor;
            await this.fetchWalletUser();
          } catch (error) {
            console.error('Erro ao buscar detalhes da carteira:', error);
          }
        }
      },

      // Buscar todos usuarios que tem carteira
      async fetchWalletUser() {
        try {
          const response = await api.get('/walletUsers');          
          this.userOptions = response.data.map(wallet => ({
            id: wallet.id,
            cod: wallet.cod,
            userName: wallet.user_name 
          }));
          this.loading = false;
        } catch (error) {
          console.error('Erro ao buscar carteiras:', error);
        }
      },

      // Pesquisar se existe Pix valido
      async fetchPersonName() {
        if (this.transferType === 'pix' && this.receiverPixKey) {
          this.hideTable = true;
          this.loadingTable = true;
          try {
            const response = await api.get(`/wallet-pix?pix_key=${this.receiverPixKey}`);
            this.nameWalletPix = response.data.wallet_name;
            this.codWalletPix = response.data.wallet_cod;
            this.nameUserPix = response.data.user_name;
            this.tableData = [
              { name: this.nameUserPix, details: `${this.codWalletPix} - ${this.nameWalletPix}` }
            ];
            this.loadingTable = false;
          } catch (error) {
            this.toast.error("Nenhum Pix encontrado", {
              timeout: 3000
            });
            this.tableData = [];
            this.loadingTable = false;
            console.error('Erro ao buscar nome com chave PIX:', error);
          }
        } 
      },

      // Limpar tabela do pix quando campo tiver vazio
      clearTablePix() {
        if (this.receiverPixKey.length === 0) {
          this.tableData = [];
          return;
        }
      },
      
      // Fazer transferencia do dinheiro
      async transfer() {
        try {
          await api.post('/transfer', {
            sender_wallet_id: this.selectedWalletId,
            quantia: this.quantia,          
            receiver_wallet_id: 
                this.transferType === 'wallet' ? this.receiverWalletId : 
                this.transferType === 'my_wallet' ? this.receiverWalletId : 
                null,
            receiver_pix_key: this.transferType === 'pix' ? this.receiverPixKey : null,          
            transfer_type: this.transferType
          });
          this.toast.success("Transferência Realizada com sucesso", {
            timeout: 2000
          });
          await this.fetchWalletDetails();
          await this.fetchWallets();
          
        } catch (error) {                    
              if (error.response && error.response.data && error.response.data.error) {
                this.handleApiError(error.response.data.error);
              }             
          }
      },

      // Tratamento de erros
      handleApiError(errorMessage) {
        switch (errorMessage) {
          case 'Carteira remetente não encontrada':
            this.toast.error("Carteira remetente não foi encontrada", {timeout: 3000});
            break;
          case 'Saldo insuficiente':
            this.toast.error("Saldo Insuficiente", {timeout: 3000});
            break;
          case 'Carteira do destinatário não encontrada':
            this.toast.error("Carteira destinatário não foi encontrada", {timeout: 3000});
            break;
          default:        
            this.toast.error("Erro na transferência:", {timeout: 3000});
            break;          
        }
      }      
    }
  };
</script>
  
<style scoped>
  .custom-margin {
    margin-top: -12px;
  }

  .divTitleWallet{
    background: #000429; 
    color:white;
  }
</style>