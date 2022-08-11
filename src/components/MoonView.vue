<template>
  <div id="moonview" />
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';

let scene, camera, renderer, controls, moon = [];

// eslint-disable-next-line no-unused-vars
function animate() {
  requestAnimationFrame(animate);

//  if (moon) {
//    moon.map(part => part.rotation.y += 0.0005);
//  }

  renderer.render(scene, camera);
}

// eslint-disable-next-line no-unused-vars
const loadMoon20 = (scene, objLoader) => {
  moon = [];
  for (let x = 1; x < 30; x++) {
    loadObject(scene, objLoader, `moon20_${x}.obj`, moon);
  }
}

const loadMoon20normal = async (scene, objLoader) => {
  moon = [];
  for (let x = 1; x < 30; x++) {
    await loadObject(scene, objLoader, `moon20n_${x}.obj`, moon);
  }
}

// eslint-disable-next-line no-unused-vars
const loadMoon100 = (scene, objLoader) => {
  moon = [];
  for (let x = 1; x < 9; x++) {
    loadObject(scene, objLoader, `moon100_${x}.obj`, moon);
  }
}

const loadObject = async (scene, objLoader, fileName, loadTo) => {
  objLoader.load('/obj/' + fileName, async (root) => {
    await scene.add(root);
    if (loadTo) {
      loadTo.push(root);
    }
  });
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

export default {
  props: {},
  methods: {
    resetView () {
      controls.reset();
    }
  },
  async mounted() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 200);
    camera.position.z = 50;

    scene = new THREE.Scene();

    addLight(0xFFFFFF, 0.7, [100, 0, 100]);
    addLight(0xFFfa80, 0.2, [-100, 0, -100]);
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