<template>
  <div id="moonview" />
</template>

<script>
import * as THREE from 'three';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';

let scene, camera, renderer;
// const material = new THREE.MeshNormalMaterial();

function animate() {
  requestAnimationFrame(animate);

//tmesh.rotation.x += 0.02;
//  tmesh.rotation.y += 0.01;
 // mesh.rotation.y += 0.02;

  renderer.render(scene, camera);
}

/*
const createMesh = () => {
  const geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
  const vertices = new Float32Array( [
    -0.2, -0.2,  0.2,
    0.2, -0.2,  0.2,
    0.2,  0.2,  0.2,

    0.2,  0.2,  0.2,
    -0.2,  0.2,  0.2,
    -0.2, -0.2,  0.2
  ] );

// itemSize = 3 because there are 3 values (components) per vertex
  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  //const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  const mesh = new THREE.Mesh( geometry, material );
  return mesh;

  const vertices = [
    new THREE.Vector3(-1.0, 1.5, 0.95),
    new THREE.Vector3(-1.0, -1.5, 0.95),
    new THREE.Vector3(1.0, -1.5, 0.95),
    new THREE.Vector3(-1.0, 1.5, 1.2),
    new THREE.Vector3(-1.0, -1.5, 1.2),
    new THREE.Vector3(1.0, -1.5, 1.2),
  ];
  const holes = [];
  const tgeometry = new THREE.BoxGeometry(1, 1, 1);

  tgeometry.vertices = vertices;
  const triangles = THREE.ShapeUtils.triangulateShape(vertices, holes);
  console.log(triangles);
  const normal = new THREE.Vector3( 0, 0, 1 );
  const color = new THREE.Color( 0xffaa00 );
  tgeometry.faces = triangles.map(t => new THREE.Vector3(t[0], t[1], t[2], normal, color));
  return new THREE.Mesh(tgeometry, material);
};
*/
const loadMoon20 = (scene, objLoader) => {
  for (let x = 1; x < 30; x++) {
    objLoader.load(`/moon20_${x}.obj`, (root) => {
      scene.add(root);
    });
  }
}

const loadMoon20normal = (scene, objLoader) => {
  for (let x = 1; x < 30; x++) {
    objLoader.load(`/moon20n_${x}.obj`, (root) => {
      scene.add(root);
    });
  }
}

const loadMoon100 = (scene, objLoader) => {
  for (let x = 1; x < 9; x++) {
    objLoader.load(`/moon100_${x}.obj`, (root) => {
      scene.add(root);
    });
  }
}

const loadObject = (scene, objLoader, fileName) => {
  objLoader.load('/' + fileName, (root) => {
    scene.add(root);
  });
}

export default {
  props: {},
  mounted() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 200);
    camera.position.z = 50;

    scene = new THREE.Scene();

/*    const geometry = new THREE.BoxGeometry(2, 2, 2);
    //const material = new THREE.MeshBasicMaterial( { color: 0x004070 } );
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(0.5);
    mesh.rotateY(0.5);
    scene.add(mesh);*/
/*
    tmesh = createMesh();
    tmesh.rotateX(0.5);
    tmesh.rotateY(0.5);
    scene.add(tmesh);
*/
/*        const sphereGeometry = new THREE.SphereGeometry(0.4, 32, 16);
    sphereMesh = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphereMesh);
*/

    {
      const color = 0xFFFFFF;
      const intensity = 0.7;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(100, 0, 100);
      light.target.position.set(0, 0, 0);
      scene.add(light);
      scene.add(light.target);
    }
/*    {
      const color = 0x0080ff;
      const intensity = 0.4;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(0, 20, -100);
      light.target.position.set(0, 0, 0);
      scene.add(light);
      scene.add(light.target);
    }*/
/*    {
      const color = 0x80a0f0;
      const intensity = 0.1;
      const light = new THREE.AmbientLight(color, intensity)
      //      light.position.set(0, 20, -100);
      //light.target.position.set(0, 0, 0);
      scene.add(light);
      //scene.add(light.target);
    }*/

    const objLoader = new OBJLoader();

    loadMoon20(scene, objLoader);
    //loadMoon20normal(scene, objLoader);
    //loadMoon100(scene, objLoader);
    //loadObject(scene, objLoader, 'moon1000_1.obj');
    //loadObject(scene, objLoader, 'Low_Poly_Planet_001.obj');

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    const moonview = document.getElementById('moonview');
    if (moonview) {
      const controls = new OrbitControls(camera, moonview);
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