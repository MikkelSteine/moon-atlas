<template>
    <MoonView @search-result="searchResults" ref="moonView"/>
    <ViewControls @view-command="handleCommand" ref="viewControls"/>
</template>

<script>
import MoonView from '@/components/MoonView.vue';
import ViewControls from '@/components/ViewControls';
import {
    CMD_CHANGE_RESOLUTION,
    CMD_CHANGE_TEXTURE,
    CMD_GOTO,
    CMD_RESET,
    CMD_ROTATE,
    CMD_SEARCH,
    CMD_TOGGLE
} from '@/commands';

export default {
    name: 'MainView',
    components: {
        MoonView,
        ViewControls
    },
    methods: {
        handleCommand (command, ...options) {
            switch (command) {
                case CMD_RESET:
                    this.$refs.moonView.resetView();
                    break;
                case CMD_CHANGE_TEXTURE:
                    this.$refs.moonView.setTexture(...options);
                    break;
                case CMD_CHANGE_RESOLUTION:
                    this.$refs.moonView.loadMoonModelsAtResolution(...options);
                    break;
                case CMD_TOGGLE:
                    this.$refs.moonView.toggle(...options);
                    break;
                case CMD_ROTATE:
                    this.$refs.moonView.rotate(...options);
                    break;
                case CMD_SEARCH:
                    this.$refs.moonView.findCrater(...options);
                    break;
                case CMD_GOTO:
                    this.$refs.moonView.hightlightFeature(...options);
                    break;
                default:
                    console.error(`Unknown commant: ${command}`);
            }
        },
        searchResults (results) {
            this.$refs.viewControls.showFilterResults(results);
        }
    }
};
</script>
