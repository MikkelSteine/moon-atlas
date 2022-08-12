<template>
  <div id="moonview" />
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {
  TEXTURE_ALBEDO,
  TEXTURE_ALTITUDE, TEXTURE_CLEMENTINECOLOR, TEXTURE_CRUSTTHICKNESS,
  TEXTURE_GEOLOGICAL, TEXTURE_IRON, TEXTURE_REALCOLOR,
  TEXTURE_ROCKTYPES,
  TEXTURE_USGS,
  TEXTURE_WATER
} from "@/textures";
import {loadMoon100, loadMoon20normal} from "@/moduleLoader";

// eslint-disable-next-line no-unused-vars
const cleanMaterial = (material) => {
  console.log('dispose material!')
  // dispose textures
  for (const key of Object.keys(material)) {
    const value = material[key]
    if (value && typeof value === 'object' && 'minFilter' in value) {
      console.log('dispose texture! ' + key)
      value.dispose();
    }
  }
  material.dispose();
  material = undefined;
}

const getTextureFilepath = (texture) => {
  switch (texture) {
    case TEXTURE_ALBEDO:
      return '/textures/moon-albedo.png';
    case TEXTURE_REALCOLOR:
      return '/textures/moon-realcolors.jpeg';
    case TEXTURE_CLEMENTINECOLOR:
      return '/textures/moon-clementinecolors.jpeg';
    case TEXTURE_WATER:
      return '/textures/moon-water.jpeg';
    case TEXTURE_ROCKTYPES:
      return '/textures/moon-rocktypes.jpeg';
    case TEXTURE_USGS:
      return '/textures/moon-usgs.jpeg';
    case TEXTURE_GEOLOGICAL:
      return '/textures/moon-geological.jpeg';
    case TEXTURE_ALTITUDE:
      return '/textures/moon-altitude.jpeg';
    case TEXTURE_CRUSTTHICKNESS:
      return '/textures/moon-grail-crustalthickness.jpeg';
    case TEXTURE_IRON:
      return '/textures/moon-iron.jpeg';
    default:
      return undefined;
  }
}

export default {
  props: {},
  methods: {
    resetView () {
      this.controls.reset();
    },
    setTexture (texture) {
      const textureFile = getTextureFilepath(texture);
      if (textureFile) {
        this.moonMaterial.map = this.textureLoader.load(textureFile);
        this.moonMaterial.needsUpdate = true;
      }
    },
    changeMaterial (options) {
      if (options.shiny) {
        this.moonMaterial.shininess = 30;
      } else {
        this.moonMaterial.shininess = 0;
      }

      if (options.flat) {
        this.moonMaterial.emissiveIntensity = 0.4;
      } else {
        this.moonMaterial.emissiveIntensity = 0;
      }
      this.moonMaterial.needsUpdate = true;
    },
    addLight(color, intensity, position, target = [0,0,0]) {
      let light;
      if (!position || position.length !== 3) {
        light = new THREE.AmbientLight(color, intensity)
        this.scene.add(light);
      } else {
        light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...position);
        light.target.position.set(...target);
        this.scene.add(light);
        this.scene.add(light.target);
      }

      return light;
    },
    loadMoonModelsAtResolution(resolution) {
      if (this.moon && this.moon.length > 0) {
        const scene = this.scene;
        this.moon.forEach((object) => {
          object.traverse( function (child) {
            if (!child.isMesh) return;
            scene.remove(child);
            child.geometry.dispose();
/*            if (child.material.isMaterial) {
              cleanMaterial(child)
            } else {
              // an array of materials
              for (const material of child.material) cleanMaterial(material)
            }*/
            child.geometry = undefined;
            child = undefined;
          });
          this.scene.remove(object);
          object = undefined;
        });
      }
      this.moon = [];
      if (resolution === 'high') {
        loadMoon20normal(this.scene, this.objLoader, this.moonMaterial, this.moon);
      } else {
        loadMoon100(this.scene, this.objLoader, this.moonMaterial, this.moon);
      }
    },
    createMoonMaterial() {
      this.textureLoader = new THREE.TextureLoader();
      return new THREE.MeshPhongMaterial({
        shininess: 0,
        emissive: 0x404040,
        emissiveIntensity: 0,
        map: this.textureLoader.load(getTextureFilepath(TEXTURE_ALBEDO))
      });
    },
    onViewResize() {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      requestAnimationFrame(this.animate);

    //  if (moon) {
    //    moon.map(part => part.rotation.y += 0.0005);
    //  }

      this.renderer.render(this.scene, this.camera);
    }
  },
  async mounted() {
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 200);
    this.camera.position.z = 50;

    this.moonMaterial = this.createMoonMaterial();

    this.scene = new THREE.Scene();

    this.addLight(0xFFFFFF, 1, [100, 0, 100]);
    this.addLight(0xFFfa80, 0.4, [-100, 0, -100]);
    this.addLight(0xFFFFFF, 0.1);

    this.objLoader = new OBJLoader();

    this.loadMoonModelsAtResolution('low');
    //loadObject(scene, objLoader, 'moon1000_1.obj');
    //loadObject(scene, objLoader, 'Low_Poly_Planet_001.obj');

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    window.onresize = this.onViewResize;

    this.moonview = document.getElementById('moonview');
    if (this.moonview) {
      this.controls = new OrbitControls(this.camera, this.moonview);
      this.controls.target.set(0, 0, 0);
      this.controls.update();

      this.moonview.appendChild(this.renderer.domElement);
      this.renderer.render(this.scene, this.camera);

      this.animate();
    }
  }
}
</script>

<style>
#moonview {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>