<template>
  <div id="moonview" />
  <div class="loading-bar" :class="{ visible: loading }">
    <div class="progress-bar" :style="{ width: progress + '%' }" />
  </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {
  TEXTURE_ALBEDO,
  TEXTURE_ALTITUDE, TEXTURE_CLEMENTINECOLOR, TEXTURE_CRUSTTHICKNESS,
  TEXTURE_GEOLOGICAL, TEXTURE_IRON, TEXTURE_REALCOLOR,
  TEXTURE_ROCKTYPES,
  TEXTURE_USGS,
  TEXTURE_WATER
} from "@/textures";
//import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import { Text } from 'troika-three-text';

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

const PIx2 = Math.PI*2;
const createCirclePoints = (radius) => {
  const curve = new THREE.EllipseCurve(
      0,  0,
      radius, radius,
      0,  PIx2,
      false,
      0
  );
  return curve.getPoints( 50 );
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
  data: function() {
return {
    loading: false,
    progress: 0,
  };
},
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
      this.renderer.render(this.scene, this.camera);
    },
    toggleLabels (on) {
      if (on) {
        this.camera.layers.enable(1);
      } else {
        this.camera.layers.disable(1);
      }
    },
    toggleOutlines (on) {
      if (on) {
        this.camera.layers.enable(2);
      } else {
        this.camera.layers.disable(2);
      }
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
        light.layers.enableAll();
        this.scene.add(light);
        this.scene.add(light.target);
      }

      return light;
    },

    reloadMoonModelsAtResolution(resolution) {
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
      this.loadMoonModelsAtResolution(resolution);
    },
    loadMoonModelsAtResolution(resolution) {
      this.moon = [];
      return new Promise((resolve) => {
        if (resolution === 'high') {
          this.loadMoon20normal(this.moonMaterial, this.moon).then(resolve);
        } else {
          this.loadMoon100(this.moonMaterial, this.moon).then(resolve);
        }
      });
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
    loadCraterNames() {
      /*
      const loader = new FontLoader();
      loader.load( 'three/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
        console.log(font);
        const geometry = new THREE.TextGeometry( 'Hello three.js!', {
          font: font,
          size: 80,
          height: 5,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5
        });
        const material = new THREE.MeshBasicMaterial( { color: 0x004070 } );
        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.setFromSphericalCoords(1760, convertCraterLat(0), convertCraterLon(0));
        const vector = new THREE.Vector3();
        vector.copy(mesh.position).multiplyScalar(2);
        mesh.lookAt(vector);
        mesh.layers.set(1);
        this.scene.add(mesh);
      });*/

      const material = new THREE.LineBasicMaterial( { color: 0xffd000 } );
      //const material2 = new THREE.LineBasicMaterial( { color: 0x040d0ff } );

      fetch('/json/craters.json').then(response => {
        return response.json();
      }).then(data => {
        //console.log(data);
        this.craters = [];
        let crater;
        const vector = new THREE.Vector3();
        for (let c = 0; c < data.length; c++) {
          crater = data[c];
          if (crater.r > 30) {
/*            const name = crater.n;
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = name;
            const labelObj = new CSS3DObject(labelDiv);
            labelObj.position.setFromSphericalCoords(1760, convertCraterLat(crater.lt), convertCraterLon(crater.ln));
            const vector = new THREE.Vector3();
            vector.copy(labelObj.position).multiplyScalar(2);
            labelObj.lookAt(vector);
            labelObj.layers.set(1);
            this.craters.push(labelObj);
            this.scene.add(labelObj);*/

            const name = crater.n;
            const labelObj = new Text();
            labelObj.text = name;
            labelObj.fontSize = 16;
            labelObj.color = crater.t === 'Crater' ? 0xffffc0 : 0xc0d0ff;
            labelObj.position.setFromSphericalCoords(1760, crater.lt, crater.ln);
            vector.copy(labelObj.position).multiplyScalar(2);
            labelObj.lookAt(vector);
            labelObj.layers.set(1);
            this.craters.push(labelObj);
            this.scene.add(labelObj);

            if (crater.t === 'Crater') {
              const geometry = new THREE.BufferGeometry().setFromPoints( createCirclePoints(crater.r) );
              const line = new THREE.Line( geometry, material);
              line.position.copy(labelObj.position);
//              console.log(line.position);
              line.position.multiplyScalar(1.02 - Math.sin(Math.atan2(crater.r, 1760)));
//              console.log(line.position, 1 - Math.sin(Math.atan2(crater.r, 1880)));
              line.lookAt(vector);
              line.layers.set(2);
              this.scene.add(line);
            }
          }
        }
        console.log(this.craters.length);
      });
    },

    loadMoon20normal () {
      return new Promise((resolve) => {
        let loaded = 0;
        const total = 29;
        for (let x = 1; x <= total; x++) {
          this.loadObject(`moon20n_${x}.obj`, this.moonMaterial, this.moon, () => {
            loaded++;
            this.updateLoadingAnimation(100 * loaded / total);
            if (loaded === total) {
              resolve();
            }
          });
        }
      });
    },

// eslint-disable-next-line no-unused-vars
    loadMoon100 () {
      return new Promise((resolve) => {
        let loaded = 0;
        const total = 8;
        for (let x = 1; x <= total; x++) {
          this.loadObject(`moon100_${x}.obj`, this.moonMaterial, this.moon, () => {
            loaded++;
            this.updateLoadingAnimation(100 * loaded / total);
            if (loaded === total) {
              resolve();
            }
          });
        }
      });
    },

    loadObject (fileName, material, loadTo, cb) {
      this.objLoader.load(
          '/obj/' + fileName,
          (object) => {
            object.traverse( function (child) {
              if (material && child instanceof THREE.Mesh) {
                child.material = material;
                child.material.needsUpdate = true;
              }
            });
            object.layers.enableAll();
            object.scale.set(100, 100, 100);
            this.scene.add(object);
            if (loadTo) {
              loadTo.push(object);
            }
            if (cb && typeof cb === 'function') {
              cb(object);
            }
          }/*,
    function ( xhr ) {
        console.log(xhr);
//      console.log( fileName + ' ' + Number(xhr.loaded / xhr.total * 100 ).toFixed(1) + '% loaded' );
    }*/
      );
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
      //this.labelRenderer.render(this.scene, this.camera);
    },
    updateLoadingAnimation(progress) {
      this.loading = true;
      this.progress = progress;
    },
    loadingDone() {
      this.animate();
      this.loading = false;
    }
  },
  async mounted() {
    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000);
    this.camera.position.z = 5000;
    this.camera.layers.enableAll();
    this.camera.layers.toggle(2);

    this.moonMaterial = this.createMoonMaterial();

    this.scene = new THREE.Scene();

    this.addLight(0xFFFFFF, 1, [10000, 0, 10000]);
    this.addLight(0xFFfa80, 0.4, [-10000, 0, -10000]);
    this.addLight(0xFFFFFF, 0.1);

    this.objLoader = new OBJLoader();

    const finishedLoading = this.loadMoonModelsAtResolution('low');
    //loadObject(scene, objLoader, 'moon1000_1.obj');
    //loadObject(scene, objLoader, 'Low_Poly_Planet_001.obj');
    this.loadCraterNames();

    window.onresize = this.onViewResize;

    this.moonview = document.getElementById('moonview');
    if (this.moonview) {
      this.renderer = new THREE.WebGLRenderer({antialias: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.moonview.appendChild(this.renderer.domElement);

/*      this.labelRenderer = new CSS3DRenderer();
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.top = '0';
      this.moonview.appendChild(this.labelRenderer.domElement);*/

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target.set(0, 0, 0);
      this.controls.update();

      this.renderer.render(this.scene, this.camera);

      finishedLoading.then(this.loadingDone);
    }
  }
}
</script>

<style lang="less">
#moonview {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.label {
  font-size: 1em;
  color: #FFF;
  font-family: sans-serif;
  padding: 2px;
  background: rgba( 0, 0, 0, .3 );
  transform-style: preserve-3d;
}

.loading-bar {
  background: rgba(40, 40, 120, 0.6);
  font-weight: bold;
  font-family: sans-serif;
  border: 1px solid rgba(100, 100, 255, 0.8);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(150, 150, 255, 1);
  padding: 10px 20px;
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -18px 0 0 -161px;
  width: 300px;

  &.visible {
    display: block;
  }

  .progress-bar {
    display: block;
    position: relative;
    left: 0;
    top: 0;
    height: 10px;
    background: #cfcff0;
  }
}
</style>