<template>
  <MoonView ref="moonView" />
  <ViewControls @view-command="handleCommand" />
</template>

<script>
import MoonView from '@/components/MoonView.vue'
import ViewControls from "@/components/ViewControls";
import {CMD_CHANGE_TEXTURE, CMD_RESET} from "@/commands";

export default {
  name: 'MainView',
  components: {
    MoonView,
    ViewControls
  },
  methods: {
    handleCommand(command, data) {
      switch (command) {
        case CMD_RESET:
          this.$refs.moonView.resetView();
          break;
        case CMD_CHANGE_TEXTURE:
          this.$refs.moonView.setTexture(data);
          break;
        default:
          console.error(`Unknown commant: ${command}`);
      }
    }
  }
}
</script>
