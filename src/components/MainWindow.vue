<template>
  <MoonView ref="moonView" />
  <ViewControls @view-command="handleCommand" />
</template>

<script>
import MoonView from '@/components/MoonView.vue'
import ViewControls from "@/components/ViewControls";
import {
  CMD_CHANGE_MATERIAL,
  CMD_CHANGE_RESOLUTION,
  CMD_CHANGE_TEXTURE,
  CMD_RESET,
  CMD_TOGGLE,
  CMD_ROTATE
} from "@/commands";

export default {
  name: 'MainView',
  components: {
    MoonView,
    ViewControls
  },
  methods: {
    handleCommand(command, ...options) {
      switch (command) {
        case CMD_RESET:
          this.$refs.moonView.resetView();
          break;
        case CMD_CHANGE_TEXTURE:
          this.$refs.moonView.setTexture(...options);
          break;
        case CMD_CHANGE_MATERIAL:
          this.$refs.moonView.changeMaterial(...options);
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
        default:
          console.error(`Unknown commant: ${command}`);
      }
    }
  }
}
</script>
