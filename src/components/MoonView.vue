<template>
  <div id="moonview" />
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {
  TEXTURE_ALBEDO,
  TEXTURE_ALTITUDE,
  TEXTURE_GEOLOGICAL,
  TEXTURE_ROCKTYPES,
  TEXTURE_USGS,
  TEXTURE_WATER
} from "@/textures";

let scene, camera, renderer, controls, moon = [], moonMaterial;

// eslint-disable-next-line no-unused-vars
function animate() {
  requestAnimationFrame(animate);

//  if (moon) {
//    moon.map(part => part.rotation.y += 0.0005);
//  }

  renderer.render(scene, camera);
}

const loadMoon20normal = async (scene, objLoader) => {
  moon = [];
  for (let x = 1; x < 30; x++) {
    await loadObject(scene, objLoader, `moon20n_${x}.obj`, moonMaterial, moon);
  }
}

// eslint-disable-next-line no-unused-vars
const loadMoon100 = (scene, objLoader) => {
  moon = [];
  for (let x = 1; x < 9; x++) {
    loadObject(scene, objLoader, `moon100_${x}.obj`, moonMaterial, moon);
  }
}

const loadObject = async (scene, objLoader, fileName, material, loadTo) => {
  objLoader.load('/obj/' + fileName, async (object) => {
    object.traverse( function (child) {
      if (material && child instanceof THREE.Mesh) {
        child.material = moonMaterial;
        child.material.needsUpdate = true;
      }
    });
    await scene.add(object);
    if (loadTo) {
      loadTo.push(object);
    }
  }/*,
  function ( xhr ) {
    //console.log( fileName + ' ' + Number(xhr.loaded / xhr.total * 100 ).toFixed(1) + '% loaded' );
  }*/);
}

const addLight = (color, intensity, position, target = [0,0,0]) => {
  let light;
  if (!position || position.length !== 3) {
    light = new THREE.AmbientLight(color, intensity)
    scene.add(light);
  } else {
    light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...position);
    light.target.position.set(...target);
    scene.add(light);
    scene.add(light.target);
  }

  return light;
}

const getTextureFilepath = (texture) => {
  switch (texture) {
    case TEXTURE_ALBEDO:
      return '/textures/moon-albedo.png';
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
    default:
      return undefined;
  }
}

export default {
  props: {},
  methods: {
    resetView () {
      controls.reset();
    },
    setTexture (texture) {
      const textureFile = getTextureFilepath(texture);
      if (textureFile) {
        moonMaterial.map = this.textureLoader.load(textureFile);
        moonMaterial.needsUpdate = true;
      }
    },
    changeMaterial (options) {
      if (options.shiny) {
        moonMaterial.shininess = 30;
      } else {
        moonMaterial.shininess = 0;
      }

      if (options.flat) {
        moonMaterial.emissiveIntensity = 0.3;
      } else {
        moonMaterial.emissiveIntensity = 0;
      }
      moonMaterial.needsUpdate = true;
    }
  },
  async mounted() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 200);
    camera.position.z = 50;

    this.textureLoader = new THREE.TextureLoader();
    moonMaterial = new THREE.MeshPhongMaterial({
      shininess: 0,
      emissive: 0xffffff,
      emissiveIntensity: 0,
      map: this.textureLoader.load('/textures/moon-albedo.png')
    });

    scene = new THREE.Scene();

    addLight(0xFFFFFF, 1, [100, 0, 100]);
    addLight(0xFFfa80, 0.4, [-100, 0, -100]);
    addLight(0xFFFFFF, 0.1);

    const objLoader = new OBJLoader();

    //loadMoon20(scene, objLoader);
    await loadMoon20normal(scene, objLoader);
    //loadMoon100(scene, objLoader);
    //loadObject(scene, objLoader, 'moon1000_1.obj');
    //loadObject(scene, objLoader, 'Low_Poly_Planet_001.obj');

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.onresize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }

    const moonview = document.getElementById('moonview');
    if (moonview) {
      controls = new OrbitControls(camera, moonview);
      controls.target.set(0, 0, 0);
      controls.update();

      moonview.appendChild(renderer.domElement);
      renderer.render(scene, camera);

      animate();
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