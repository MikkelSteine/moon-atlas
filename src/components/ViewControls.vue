<template>
  <div id="viewcontrols">
    <div class="group">
      <button @click="resetView">Reset view</button>
    </div>
  </div>
</template>

<script>
import { CMD_RESET } from '@/commands';

export default {
  name: "ViewControls",
  methods: {
    resetView() {
      this.$emit('view-command', CMD_RESET);
    }
  }
}
</script>

<style scoped>
  #viewcontrols {
    display: flex;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2em;
    background: rgba(20, 20, 20, 0.2);
    flex-flow: row nowrap;
    justify-content: center;
  }

  .group {
    border: 1px solid white;
    padding: 5px;
  }
</style>