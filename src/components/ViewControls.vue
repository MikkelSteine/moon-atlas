<template>
  <div id="viewcontrols">
    <div class="group">
      <button @click="resetView">Reset view</button>
    </div>
    <!--<div class="group">
      <button @click="changeResolution" class="toggle-button" :class="{on: resolution}">{{resolution ? 'Low res.' : 'Higher res.'}}</button>
    </div -->
    <div class="group">
      <button @click="changeShininess" class="toggle-button" :class="{on: shiny}">Shinyness is
        {{ shiny ? 'on' : 'off' }}
      </button>
      <button @click="changeFlatness" class="toggle-button" :class="{on: flat}">Flatness is {{ flat ? 'on' : 'off' }}
      </button>
    </div>
    <div class="group">
      <label for="texture">Choose overlay:</label>
      <select name="texture" v-model="texture">
        <option v-for="option in optionsTexture" :value="option.value" v-bind:key=option.value>{{
            option.text
          }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import {
  CMD_CHANGE_MATERIAL,
  CMD_CHANGE_RESOLUTION,
  CMD_CHANGE_TEXTURE,
  CMD_RESET
} from '@/commands';
import {
  TEXTURE_ALBEDO,
  TEXTURE_ALTITUDE, TEXTURE_CLEMENTINECOLOR,
  TEXTURE_CRUSTTHICKNESS,
  TEXTURE_GEOLOGICAL,
  TEXTURE_IRON, TEXTURE_REALCOLOR,
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
        {text: 'Albedo', value: TEXTURE_ALBEDO},
        {text: 'Altitude', value: TEXTURE_ALTITUDE},
        {text: 'Crustal thickness', value: TEXTURE_CRUSTTHICKNESS},
        {text: '"Real" color', value: TEXTURE_REALCOLOR},
        {text: 'Clementine false color', value: TEXTURE_CLEMENTINECOLOR},
        {text: 'Water concentration', value: TEXTURE_WATER},
        {text: 'Geological map', value: TEXTURE_GEOLOGICAL},
        {text: 'USGS map', value: TEXTURE_USGS},
        {text: 'Rocktypes', value: TEXTURE_ROCKTYPES},
        {text: 'Iron distribution', value: TEXTURE_IRON},
      ],
      highres: false,
      shiny: false,
      flat: false,
    }
  },
  methods: {
    resetView() {
      this.$emit('view-command', CMD_RESET);
    },
    changeResolution() {
      this.highres = !this.highres;
      this.$emit('view-command', CMD_CHANGE_RESOLUTION, this.highres ? 'high' : 'low');
    },
    changeShininess() {
      this.shiny = !this.shiny;
      this.emitUpdateMaterial();
    },
    changeFlatness() {
      this.flat = !this.flat;
      this.emitUpdateMaterial();
    },
    emitUpdateMaterial() {
      this.$emit('view-command', CMD_CHANGE_MATERIAL, {
        shiny: !!this.shiny,
        flat: !!this.flat,
      });
    }
  },
  watch: {
    texture(value) {
      this.$emit('view-command', CMD_CHANGE_TEXTURE, value);
    }
  }
}
</script>

<style scoped lang="less">
#viewcontrols {
  display: flex;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  flex-flow: row wrap;
  justify-content: center;
  gap: 20px;

  .group {
    color: white;
    background: rgba(80, 80, 200, 0.4);
    font-weight: bold;
    font-family: sans-serif;
    border: 1px solid rgba(100, 100, 255, 0.8);
    padding: 10px 20px;
    display: flex;
    flex-flow: row nowrap;
    gap: 20px;
    align-items: center;
  }
}

select, button {
  border: 1px solid aqua;
  display: block;
  padding: 0.5rem 2rem;
  margin: 0;
  text-decoration: none;
  line-height: 1;
  font-size: 1rem;
  text-align: center;
  transition: background 250ms ease-in-out, transform 150ms ease;

  &:focus {
    outline: 1px solid #228;
    outline-offset: -4px;
  }

  &:active {
    transform: scale(0.99);
  }
}

button {
  &.toggle-button {
    background-color: #404040;
    color: #b0b0b0;
    outline-color: #bbb;

    &.on {
      background-color: #f0f0f0;
      color: black;

      &:focus {
        outline-color: #888;
      }
    }
  }
}
</style>