import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTags, faArrowsSpin, faRotateLeft, faRotateRight, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'

library.add(faTags, faArrowsSpin, faRotateLeft, faRotateRight, faPlay, faPause);

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
