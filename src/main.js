import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router';
import toast, { POSITION } from 'vue-toastification';
import { useToast } from "vue-toastification";
import 'vue-toastification/dist/index.css';

loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(useToast)
  .use(toast, {
    position: POSITION.TOP_RIGHT, 
    timeout: 5000,
  })
  .mount('#app')
