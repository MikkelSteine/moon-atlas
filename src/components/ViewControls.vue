<template>
  <div id="viewcontrols">
    <div class="group">
      <button @click="resetView">Reset view</button>
    </div>
    <div class="group">
      <label for="texture">Choose overlay:</label>
      <select name="texture" v-model="texture">
        <option v-for="option in optionsTexture" :value="option.value" v-bind:key=option.value>{{ option.text }}</option>
      </select>
    </div>
  </div>
</template>

<script>
import {CMD_CHANGE_TEXTURE, CMD_RESET} from '@/commands';
import {
  TEXTURE_ALBEDO,
  TEXTURE_ALTITUDE,
  TEXTURE_GEOLOGICAL,
  TEXTURE_ROCKTYPES,
  TEXTURE_USGS,
  TEXTURE_WATER
} from "@/textures";

export default {
  name: "ViewControls",
  data() {
    return {
      texture: TEXTURE_ALBEDO,
      optionsTexture: [
        { text: 'Albedo', value: TEXTURE_ALBEDO },
        { text: 'Altitude', value: TEXTURE_ALTITUDE },
        { text: 'Water concentration', value: TEXTURE_WATER },
        { text: 'Geological map', value: TEXTURE_GEOLOGICAL },
        { text: 'USGS map', value: TEXTURE_USGS },
        { text: 'Rocktypes', value: TEXTURE_ROCKTYPES },
      ]
    }
  },
  methods: {
    resetView() {
      this.$emit('view-command', CMD_RESET);
    },
  },
  watch: {
    texture(value) {
      this.$emit('view-command', CMD_CHANGE_TEXTURE, value);
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
    gap: 10px;
  }

  .group {
    color: white;
    font-weight: bold;
    font-family: sans-serif;
    border: 1px solid white;
    padding: 5px;
    display: flex;
    flex-flow: row nowrap;
    gap: 5px;
  }
</style>