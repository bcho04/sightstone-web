// Configuration (aspect ratio, view angle, zoom, etc)
var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;

var VIEW_ANGLE   = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR         = 0.1;
var FAR          = 10000;

// Create scene, camera, and a WebGL renderer
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR, FAR);
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Create frame variables.
var initpos, initcolor, targetpos, targetcolor;
var tweenpos, tweencolor;
var rotateIcos = true;
var stats = new Stats();
var geometry, material, mesh, light, light2;
var composer;

// Set up the above.
renderer.setSize(WIDTH, HEIGHT);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);
controls.enableZoom = false;
controls.enablePanning = false;
controls.enableRotate = true;
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// Create meshes and objects.
geometry = new THREE.IcosahedronGeometry(4);
material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
mesh     = new THREE.Mesh(geometry, material);

// Create light.
light = new THREE.PointLight(0xBBBBBB, 1.4);
light2 = new THREE.PointLight(0xAAAAAA, 1.2);
light.position.set(0,0,15);
light2.position.set(15,0,-15);

// Add to the scene.
scene.add(mesh);
scene.add(light);
scene.add(light2);
scene.add(new THREE.AmbientLight(0x111111));

// Use postprocessing.
composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera)); // Initial RenderPass.

var DotScreenShader = new THREE.ShaderPass(THREE.DotScreenShader);
DotScreenShader.uniforms['scale'].value = 4; // Default: 4
DotScreenShader.renderToScreen = true;

var RGBShiftShader = new THREE.ShaderPass(THREE.RGBShiftShader);
RGBShiftShader.uniforms['amount'].value = 0.07; // Default: 0.0015
RGBShiftShader.renderToScreen = true;

var GlitchPass = new THREE.GlitchPass();
GlitchPass.renderToScreen = true;

composer.addPass(DotScreenShader);
composer.addPass(RGBShiftShader);
composer.addPass(GlitchPass);

// Add event listeners.
function onWindowResize(){
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    camera.aspect = WIDTH / HEIGHT;
    controls.update();
    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
    composer.setSize(WIDTH, HEIGHT);
}

function onWindowSubmit(){
    initpos = {z: mesh.position.z};
    targetpos = {z: 5.4};
    GlitchPass.renderToScreen = false; // Disable distracting glitch
    RGBShiftShader.uniforms['amount'].value = 0.0015; // Lower value for easier transition
    tweenpos = new TWEEN.Tween(initpos)
    .to(targetpos, 1000)
    .easing(TWEEN.Easing.Exponential.In)
    .onUpdate((object) => {
        rotateIcos = false;
        mesh.position.z = object.z;
    }).onComplete(() => {
        rotateIcos = true;
    })
    .start();
}

function onWindowOffline(){
    initcolor = {r: mesh.material.color.r*255, g: mesh.material.color.g*255, b: mesh.material.color.b*255};
    targetcolor = {r: 200, g: 60, b: 30};
    tweencolor = new TWEEN.Tween(initcolor)
    .to(targetcolor, 1000)
    .onUpdate((object) => {
        mesh.material.color.setRGB(object.r/255, object.g/255, object.b/255);
    })
    .start();
}

function onWindowOnline(){
    initcolor = {r: mesh.material.color.r*255, g: mesh.material.color.g*255, b: mesh.material.color.b*255};
    targetcolor = {r: 255, g: 255, b: 255};
    tweencolor = new TWEEN.Tween(initcolor)
    .to(targetcolor, 1000)
    .onUpdate((object) => {
        mesh.material.color.setRGB(object.r/255, object.g/255, object.b/255);
    })
    .start();
    mesh.material.color.setHex(0xFFFFFF);
}

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('sumsubmit', onWindowSubmit, false);
window.addEventListener('submit', onWindowSubmit, false);
window.addEventListener('offline', onWindowOffline, false);
window.addEventListener('online', onWindowOnline, false);

// Render the scene and add scene calls.
camera.position.z = 10;
controls.update();

function render(now){
    requestAnimationFrame(render);
    stats.begin();
    TWEEN.update();
    if(rotateIcos == true){
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
    } else {
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.001;
    }
    controls.update();
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    composer.render();
    stats.end();
}

render();
