import { createApp } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faCheck,
    faLayerGroup,
    faLightbulb,
    faPause,
    faPlay,
    faRotateLeft,
    faRotateRight,
    faSearch,
    faTags
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';

library.add(faTags, faLayerGroup, faRotateLeft, faRotateRight, faPlay, faPause, faCheck, faLightbulb, faSearch);

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app');
