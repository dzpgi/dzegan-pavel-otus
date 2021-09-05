import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router/router'
import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

createApp(App).use(PrimeVue).use(store).use(router).mount('#app')
