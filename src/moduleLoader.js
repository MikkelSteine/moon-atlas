import * as THREE from "three";

export const loadMoon20normal = async (scene, objLoader, moonMaterial, moon) => {
    for (let x = 1; x < 30; x++) {
        await loadObject(scene, objLoader, `moon20n_${x}.obj`, moonMaterial, moon);
    }
}

// eslint-disable-next-line no-unused-vars
export const loadMoon100 = async (scene, objLoader, moonMaterial, moon) => {
    for (let x = 1; x < 9; x++) {
        await loadObject(scene, objLoader, `moon100_${x}.obj`, moonMaterial, moon);
    }
}

const loadObject = async (scene, objLoader, fileName, material, loadTo) => {
    objLoader.load(
        '/obj/' + fileName,
        async (object) => {
            object.traverse( function (child) {
                if (material && child instanceof THREE.Mesh) {
                    child.material = material;
                    child.material.needsUpdate = true;
                }
            });
            await scene.add(object);
            if (loadTo) {
                loadTo.push(object);
            }
        }/*,
    function ( xhr ) {
        console.log(xhr);
//      console.log( fileName + ' ' + Number(xhr.loaded / xhr.total * 100 ).toFixed(1) + '% loaded' );
    }*/
    );
}
