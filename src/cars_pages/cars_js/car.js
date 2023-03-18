import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"

var canvas = document.getElementById("canvasID");
var car = document.getElementById("carID").getAttribute("value");
let carUrl;
if(car == "1"){
    carUrl = new URL("../assets/blender_test.glb", import.meta.url);
} else if(car == "2"){
    carUrl = new URL("../assets/blender_test2.glb", import.meta.url);
} else{
    carUrl = new URL("../assets/blender_test3.glb", import.meta.url);
}
var factor = 0.84;
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.shadowMap.enabled = true;
document.getElementById('canvasDiv').appendChild( renderer.domElement );
renderer.setSize(window.innerWidth*factor, window.innerHeight*factor); 

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    25, 
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.addEventListener( 'change', animate);
orbit.minPolarAngle = 0;
orbit.maxPolarAngle =  Math.PI * 0.49;
orbit.minDistance = 10;
orbit.maxDistance = 50;

camera.position.set(-10, 5, 10);
orbit.update();

//PLANO
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x131313,//
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

// ILUMINCACION
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight)

// ILUMINACION SPOTLIGHT
const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-50, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.04;
spotLight.penumbra = 0.2;
spotLight.intensity = 2;

// FOG
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

// BACKGROUND
renderer.setClearColor(0x000000)
//0x292828

// CAR 3D MODEL
const assetLoader = new GLTFLoader();
assetLoader.load(carUrl.href, function(gltf){
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, 0);
}, undefined, function(error){
    console.log(error);
});

function resize() {
    var w = window.innerWidth * factor;
    var h = window.innerHeight * factor;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}; 

window.addEventListener("resize", resize);

// ANIMACION
function animate(){
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);



