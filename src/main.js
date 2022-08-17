import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faTags,
    faRotateLeft,
    faRotateRight,
    faPlay,
    faPause,
    faLayerGroup,
    faCheck,
    faLightbulb
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'

library.add(faTags, faLayerGroup, faRotateLeft, faRotateRight, faPlay, faPause, faCheck, faLightbulb);

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
