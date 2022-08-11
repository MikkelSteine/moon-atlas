<template>
  <MoonView ref="moonView" />
  <ViewControls @view-command="handleCommand" />
</template>

<script>
import MoonView from '@/components/MoonView.vue'
import ViewControls from "@/components/ViewControls";
import {CMD_RESET} from "@/commands";

export default {
  name: 'MainView',
  components: {
    MoonView,
    ViewControls
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case CMD_RESET:
          this.$refs.moonView.resetView();
          break;
        default:
          console.error(`Unknown commant: ${command}`);
      }
    }
  }
}
</script>
