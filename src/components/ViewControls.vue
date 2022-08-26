<template>
    <div id="viewcontrols">
        <button @click="resetView">Reset</button>
        <!--
        <button @click="changeResolution" class="toggle-button" :class="{on: resolution}">{{resolution ? 'Low res.' : 'Higher res.'}}</button>
        -->
        <button @click="setProperty('labels', !labels)" class="toggle-button" :class="{on: labels}">
            <font-awesome-icon icon="fa-solid fa-tags"/>
        </button>
        <button @click="setProperty('backlight', !backlight)" class="toggle-button" :class="{on: backlight}">
            <font-awesome-icon icon="fa-solid fa-lightbulb"/>
        </button>
        <!--
        <button @click="setProperty('outlines', !outlines)" class="toggle-button" :class="{on: outlines}">
          Outlines {{ outlines ? 'on' : 'off' }}
        </button>-->
        <button @click="rotate(-0.1)">
            <font-awesome-icon icon="fa-solid fa-rotate-right"/>
        </button>
        <button @click="setProperty('rotating', !rotating)" class="toggle-button" :class="{on: rotating}">
            <font-awesome-icon v-if="rotating" icon="fa-solid fa-pause"/>
            <font-awesome-icon v-if="!rotating" icon="fa-solid fa-play"/>
        </button>
        <button @click="rotate(0.1)">
            <font-awesome-icon icon="fa-solid fa-rotate-left"/>
        </button>
        <button @blur="onSelectBlur" @focus="layerPopup=true" @keydown="navigatePopup">
            <font-awesome-icon icon="fa-solid fa-layer-group"/>
        </button>
        <div class="select-popup" v-if="layerPopup">
            <div v-for="(option, index) in optionsTexture" @mousedown="startSelecting(option.value)"
                 @mouseup="selectLayer(option.value)" v-bind:key=option.value
                 :class="{selected: texture === option.value, hover: index === popupNavPos}">
                <font-awesome-icon icon="fa-solid fa-check" v-if="texture === option.value"/>
                <span>{{ option.text }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { CMD_CHANGE_RESOLUTION, CMD_CHANGE_TEXTURE, CMD_RESET, CMD_ROTATE, CMD_TOGGLE } from '@/commands'
import {
    TEXTURE_ALBEDO,
    TEXTURE_ALTITUDE,
    TEXTURE_CLEMENTINECOLOR,
    TEXTURE_CRUSTTHICKNESS,
    TEXTURE_GEOLOGICAL,
    TEXTURE_IRON,
    TEXTURE_REALCOLOR,
    TEXTURE_ROCKTYPES,
    TEXTURE_USGS,
    TEXTURE_WATER
} from '@/textures'

const OPTIONS = [
    { text: '-- None --', value: '' },
    { text: 'Albedo', value: TEXTURE_ALBEDO },
    { text: 'Altitude', value: TEXTURE_ALTITUDE },
    { text: 'Crustal thickness', value: TEXTURE_CRUSTTHICKNESS },
    { text: '"Real" color', value: TEXTURE_REALCOLOR },
    { text: 'Clementine false color', value: TEXTURE_CLEMENTINECOLOR },
    { text: 'Water concentration', value: TEXTURE_WATER },
    { text: 'Geological map', value: TEXTURE_GEOLOGICAL },
    { text: 'USGS map', value: TEXTURE_USGS },
    { text: 'Rocktypes', value: TEXTURE_ROCKTYPES },
    { text: 'Iron distribution', value: TEXTURE_IRON },
]

export default {
    name: 'ViewControls',
    data () {
        return {
            texture: TEXTURE_ALBEDO,
            popupNavPos: OPTIONS.findIndex(option => option.value === TEXTURE_ALBEDO) || 0,
            optionsTexture: OPTIONS,
            highres: false,
            labels: false,
            outlines: false,
            rotating: false,
            layerPopup: false,
            preventBlur: false,
            backlight: false,
        }
    },
    methods: {
        resetView () {
            this.$emit('view-command', CMD_RESET)
        },
        changeResolution () {
            this.highres = !this.highres
            this.$emit('view-command', CMD_CHANGE_RESOLUTION, this.highres ? 'high' : 'low')
        },
        rotate (direction) {
            this.$emit('view-command', CMD_ROTATE, direction)
        },
        setProperty (property, value) {
            this[property] = value
            this.$emit('view-command', CMD_TOGGLE, property, value)
        },
        onSelectBlur () {
            if (!this.preventBlur)
                this.layerPopup = false
        },
        startSelecting (texture) {
            this.preventBlur = true
            this.popupNavPos = this.optionsTexture.findIndex(option => option.value === texture)
            setTimeout(() => {
                this.preventBlur = false
            }, 4000)
        },
        selectLayer (texture) {
            const selectedTexture = this.optionsTexture.findIndex(option => option.value === texture)
            if (selectedTexture === this.popupNavPos) {
                this.texture = texture
                this.layerPopup = false
            }
            this.preventBlur = false
        },
        navigatePopup (event) {
            switch (event.key) {
                case 'ArrowDown':
                    this.layerPopup = true
                    this.popupNavPos++
                    if (this.popupNavPos >= this.optionsTexture.length) {
                        this.popupNavPos = 0
                    }
                    break
                case 'ArrowUp':
                    this.layerPopup = true
                    this.popupNavPos--
                    if (this.popupNavPos < 0) {
                        this.popupNavPos = this.optionsTexture.length - 1
                    }
                    break
                case 'Enter':
                    if (this.layerPopup) {
                        this.texture = this.optionsTexture[this.popupNavPos].value
                        this.layerPopup = false
                        event.preventDefault()
                        return false
                    } else {
                        this.layerPopup = true
                        event.preventDefault()
                        return false
                    }
                case ' ':
                    if (this.layerPopup) {
                        this.texture = this.optionsTexture[this.popupNavPos].value
                        event.preventDefault()
                        return false
                    }
                    break
                case 'Escape':
                    this.popupNavPos = this.optionsTexture.findIndex(option => option.value === this.texture)
                    this.layerPopup = false
                    break
                default:
                //console.log(event);
            }
        }
    },
    watch: {
        texture (value) {
            this.$emit('view-command', CMD_CHANGE_TEXTURE, value)
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
    gap: 0.50em;
    padding: 0.25em 0;

    button, .group {
        color: white;
        background: rgba(40, 40, 120, 0.6);
        border: 1px solid rgba(180, 180, 255, 0.8);
        border-radius: 10px;
        box-shadow: 0 0 8px rgba(220, 240, 255, 1);

        font-weight: bold;
        font-family: sans-serif;
        text-decoration: none;
        font-size: 1rem;
        text-align: center;
        line-height: 2em;
    }

    .group {
        padding: 10px 10px;
        display: flex;
        flex-flow: row nowrap;
        gap: 1em;
        align-items: center;
    }

    button {
        display: block;
        padding: 0.25rem 1rem;
        margin: 0;
        min-width: 3em;

        transition: background 250ms ease-in-out, transform 150ms ease, box-shadow 250ms ease-in-out;

        &:focus {
            outline: 1px solid #88f;
            outline-offset: -4px;
        }

        &:active {
            transform: scale(1, 0.9);
        }

        &.toggle-button {
            background-color: rgba(40, 40, 40, 0.5);
            color: #ccc;
            outline-color: #bbb;
            box-shadow: 0 0 1px rgba(40, 40, 180, 0.5);

            transition: box-shadow 250ms ease-in-out;

            &.on {
                background: linear-gradient(0deg, #ccf, #88f);
                color: white;
                box-shadow: 0 0 8px rgba(220, 240, 255, 1);

                &:focus {
                    outline-color: #888;
                }
            }
        }

    }

    .select-popup {
        display: flex;
        flex-flow: column;
        position: fixed;
        bottom: 4em;
        margin: 0;

        font-weight: bold;
        font-family: sans-serif;
        text-decoration: none;
        line-height: 1.5em;
        font-size: 1rem;
        text-align: left;

        border: 1px solid rgba(100, 100, 255, 0.8);
        background: rgba(40, 40, 120, 0.6);
        color: white;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(150, 150, 255, 1);

        div {
            padding: 0.25rem 2rem 0.25rem 1rem;
            display: flex;
            flex-flow: row;
            border-radius: 7px;

            svg {
                display: inline-block;
                position: absolute;
                margin: 0.25rem 0;
            }

            span {
                display: inline-block;
                position: relative;
                left: 1.25em;
            }

            &.selected {
                background: rgba(200, 200, 255, 0.3);
            }

            &.hover {
                outline: 1px solid #ccf;
                outline-offset: -2px;
            }
        }
    }
}
</style>