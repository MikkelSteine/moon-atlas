<template>
    <div id="moonview"/>
    <div class="loading-bar" :class="{ visible: loading }">
        <div class="progress-bar" :style="{ width: progress + '%' }"/>
    </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import {
//    TEXTURE_ALBEDO,
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
import { Text } from 'troika-three-text'

// eslint-disable-next-line no-unused-vars
const cleanMaterial = (material) => {
    console.log('dispose material!')
    // dispose textures
    for (const key of Object.keys(material)) {
        const value = material[key]
        if (value && typeof value === 'object' && 'minFilter' in value) {
            console.log('dispose texture! ' + key)
            value.dispose()
        }
    }
    material.dispose()
    material = undefined
}

const PIx2 = Math.PI * 2
// eslint-disable-next-line no-unused-vars
const createCirclePoints = (radius) => {
    const curve = new THREE.EllipseCurve(
        0, 0,
        radius, radius,
        0, PIx2,
        false,
        0
    )
    return curve.getPoints(50)
}

const getTextureFilepath = (texture) => {
    switch (texture) {
//        case TEXTURE_ALBEDO:
//            return '/textures/moon-albedo.png'
        case TEXTURE_REALCOLOR:
//            return '/textures/moon-realcolors.jpeg'
            return '/textures/lroc_color_poles.jpg'
        case TEXTURE_CLEMENTINECOLOR:
            return '/textures/moon-clementine-full.jpeg'
        case TEXTURE_WATER:
            return '/textures/moon-water.jpeg'
        case TEXTURE_ROCKTYPES:
            return '/textures/moon-rocktypes.jpeg'
        case TEXTURE_USGS:
            return '/textures/moon-usgs.jpeg'
        case TEXTURE_GEOLOGICAL:
            return '/textures/moon-geological.jpeg'
        case TEXTURE_ALTITUDE:
            return '/textures/moon-altitude.jpeg'
        case TEXTURE_CRUSTTHICKNESS:
            return '/textures/moon-grail-crustalthickness.jpeg'
        case TEXTURE_IRON:
            return '/textures/moon-iron.jpeg'
        default:
            return undefined
    }
}

export default {
    props: {},
    async mounted () {
        this.camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 200000)
        this.camera.position.z = 20000
        this.camera.layers.enableAll()
        this.camera.layers.toggle(1)
        this.camera.layers.toggle(2)

        this.moonMaterial = this.createMoonMaterial()

        this.scene = new THREE.Scene()

        this.lights = []
        this.lights.push(this.addLight(0xFFFFFF, 1, true, [1, 0, 1]))
        this.lights[0].castShadow = true
        this.lights.push(this.addLight(0xFFfa80, 0.2, false, [-1, 0, -1]))
        this.lights.push(this.addLight(0xFFFFFF, 0.1, false))

        this.objLoader = new OBJLoader()

        const finishedLoading = this.loadMoonModelsAtResolution('high')
        //const finishedLoading = new Promise(resolve => resolve());
        this.loadCraterNames()

        window.onresize = this.onViewResize

        this.moonview = document.getElementById('moonview')
        if (this.moonview) {
            this.renderer = new THREE.WebGLRenderer({ antialias: true })
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.moonview.appendChild(this.renderer.domElement)

            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            this.controls.target.set(0, 0, 0)
            this.controls.minDistance = 2000;
            this.controls.maxDistance = 100000;
            this.controls.update()

            this.renderer.render(this.scene, this.camera)

            finishedLoading.then(this.loadingDone)
        }
    },
    data: function () {
        return {
            loading: false,
            progress: 0,
            rotating: false,
        }
    },
    methods: {
        resetView () {
            this.controls.reset()
            if (this.moon) {
                this.moon.map(part => part.rotation.y = 0)
            }
            if (this.labels) {
                this.labels.rotation.y = 0
            }
        },
        rotate (amount) {
            if (this.moon) {
                this.moon.map(part => part.rotation.y += amount)
            }
            if (this.labels) {
                this.labels.rotation.y += amount
            }
        },
        setTexture (texture) {
            const textureFile = getTextureFilepath(texture)
            if (textureFile) {
                this.moonMaterial.map = this.textureLoader.load(textureFile/*, () => {
                    this.loadingDone();
                }, (event) => {
                    console.log(event);
                    this.updateLoadingAnimation(event.progress / event.total);
                }*/);
                this.moonMaterial.needsUpdate = true
            } else {
                this.moonMaterial.map = null
                this.moonMaterial.needsUpdate = true
            }
        },
        toggle (what, on) {
            switch (what) {
                case 'labels':
                    if (on) {
                        this.camera.layers.enable(1)
                    } else {
                        this.camera.layers.disable(1)
                    }
                    break
                case 'outlines':
                    if (on) {
                        this.camera.layers.enable(2)
                    } else {
                        this.camera.layers.disable(2)
                    }
                    break
                case 'backlight':
                    this.lights[1].visible = on
                    this.lights[2].visible = on
                    break
                case 'rotating':
                    this.rotating = on
                    break
                default:
                    console.error('unknown toggle: ' + what)
            }
        },
        addLight (color, intensity, on, position, target = [0, 0, 0]) {
            let light
            if (!position || position.length !== 3) {
                light = new THREE.AmbientLight(color, intensity)
                light.visible = on
                this.scene.add(light)
            } else {
                light = new THREE.DirectionalLight(color, intensity)
                light.visible = on
                light.position.set(...position)
                light.target.position.set(...target)
                light.layers.enableAll()
                this.scene.add(light)
                this.scene.add(light.target)
            }

            return light
        },

        reloadMoonModelsAtResolution (resolution) {
            if (this.moon && this.moon.length > 0) {
                const scene = this.scene
                this.moon.forEach((object) => {
                    object.traverse(function (child) {
                        if (!child.isMesh) return
                        scene.remove(child)
                        child.geometry.dispose()
                        /*            if (child.material.isMaterial) {
                                      cleanMaterial(child)
                                    } else {
                                      // an array of materials
                                      for (const material of child.material) cleanMaterial(material)
                                    }*/
                        child.geometry = undefined
                        child = undefined
                    })
                    this.scene.remove(object)
                    object = undefined
                })
            }
            this.loadMoonModelsAtResolution(resolution)
        },
        loadMoonModelsAtResolution (resolution) {
            this.moon = []
            return new Promise((resolve) => {
                if (resolution === 'high') {
                    this.loadMoon20normal(this.moonMaterial, this.moon).then(resolve)
                } else {
                    this.loadMoon100(this.moonMaterial, this.moon).then(resolve)
                }
            })
        },
        createMoonMaterial () {
            /*return new THREE.MeshStandardMaterial({
              wireframe: true,
            });*/
            this.textureLoader = new THREE.TextureLoader()
            return new THREE.MeshLambertMaterial({
                emissive: 0x404040,
                emissiveIntensity: 0,
                map: this.textureLoader.load(getTextureFilepath(TEXTURE_REALCOLOR))
            })
        },
        loadCraterNames () {
            //const material = new THREE.LineBasicMaterial( { color: 0xffd000 } );

            fetch('/json/craters.json').then(response => {
                return response.json()
            }).then(data => {
                //console.log(data);
                this.labels = new THREE.Object3D()
                this.labels.position.set(0, 0, 0)
                let crater
                const vector = new THREE.Vector3()
                for (let c = 0; c < data.length; c++) {
                    crater = data[c]
                    if (crater.r > 40) {
                        const name = crater.n
                        const labelObj = new Text()
                        labelObj.text = name
                        labelObj.fontSize = 16
                        labelObj.color = crater.t === 'Crater' ? 0xffffc0 : 0xc0d0ff
                        labelObj.position.setFromSphericalCoords(1760, crater.lt, crater.ln)
                        vector.copy(labelObj.position).multiplyScalar(2)
                        labelObj.lookAt(vector)
                        labelObj.layers.set(1)
                        this.labels.attach(labelObj)

                        if (crater.t === 'Crater') {
                            /*              const geometry = new THREE.RingGeometry( 1, 5, 32, 1 );
                                          const line = new THREE.Line( geometry, material);
                                          line.position.copy(labelObj.position);
                                          line.lookAt(vector);
                                          line.layers.set(1);
                                          this.labels.attach(line);
                                          /*
                                          const geometry = new THREE.BufferGeometry().setFromPoints( createCirclePoints(crater.r) );
                                          const line = new THREE.Line( geometry, material);
                                          line.position.copy(labelObj.position);
                                          line.position.multiplyScalar(1.02 - Math.sin(Math.atan2(crater.r, 1760)));
                                          line.lookAt(vector);
                                          line.layers.set(2);
                                          this.scene.add(line);*/
                        }
                    }
                }
                this.scene.add(this.labels)
//                console.log(this.labels.children.length)
            })
        },

        loadMoon20normal () {
            return new Promise((resolve) => {
                let loaded = 0
                const total = 21
                for (let x = 1; x <= total; x++) {
                    this.loadObject(`moon20n_${x}.obj`, this.moonMaterial, this.moon, () => {
                        loaded++
                        this.renderer.render(this.scene, this.camera)
                        this.updateLoadingAnimation(100 * loaded / total)
                        if (loaded === total) {
                            resolve()
                        }
                    })
                }
            })
        },

// eslint-disable-next-line no-unused-vars
        loadMoon100 () {
            return new Promise((resolve) => {
                let loaded = 0
                const total = 6
                for (let x = 1; x <= total; x++) {
                    this.loadObject(`moon100_${x}.obj`, this.moonMaterial, this.moon, () => {
                        loaded++
                        this.renderer.render(this.scene, this.camera)
                        this.updateLoadingAnimation(100 * loaded / total)
                        if (loaded === total) {
                            resolve()
                        }
                    })
                }
            })
        },

        loadObject (fileName, material, loadTo, cb) {
            this.objLoader.load(
                '/obj/' + fileName,
                (object) => {
                    object.traverse(function (child) {
                        if (material && child instanceof THREE.Mesh) {
                            child.material = material
                            child.material.needsUpdate = true
                        }
                    })
                    object.layers.enableAll()
                    object.scale.set(100, 100, 100)
                    this.scene.add(object)
                    if (loadTo) {
                        loadTo.push(object)
                    }
                    if (cb && typeof cb === 'function') {
                        cb(object)
                    }
                }
            )
        },

        onViewResize () {
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.render(this.scene, this.camera)
        },
        animate () {
            requestAnimationFrame(this.animate)

            if (this.rotating) {
                this.rotate(0.001)
            }

            this.renderer.render(this.scene, this.camera)
        },
        updateLoadingAnimation (progress) {
            this.loading = true
            this.progress = progress
        },
        loadingDone () {
            this.animate()
            this.loading = false
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
    background: rgba(0, 0, 0, .3);
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