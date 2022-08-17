import * as THREE from './node_modules/three/build/three.module.js';
import { vert, frag } from './js/CustomShaderData.js'

let scene, camera, container, renderer, fileLoader

let listener, sound, data, analyser, audioLoader

//temp stuff
let material, geometry, sphere, customShader, clock


document.getElementById('start-button').addEventListener("click", function(){onClick()});

function init(){
    container = document.getElementById("canvas");
    scene = new THREE.Scene();
    fileLoader = new THREE.FileLoader();
    camera = new THREE.PerspectiveCamera( 25, container.offsetWidth / container.offsetHeight, 0.1, 50 );
    camera.aspect = (container.offsetWidth / container.offsetHeight);
    //camera.position.z = 25;
    camera.position.y = 25;
    camera.position.x = 15


    renderer = new THREE.WebGLRenderer({canvas: container, antialias: true, alpha: true});
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    renderer.setPixelRatio( window.devicePixelRatio );

    customShader = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            resolution: { value: new THREE.Vector2()},
            vertexMod: { value: 1.0 },
        },
        vertexShader: vert,
        fragmentShader: frag
    });

    geometry = new THREE.SphereGeometry( 5, 64, 32 );
    material = new THREE.MeshBasicMaterial({color: 0x00ff00 });
    sphere = new THREE.Mesh( geometry, customShader );
    sphere.position.set(0,0,0);


    const listener = new THREE.AudioListener();
    camera.add(listener);
    sound = new THREE.Audio(listener);

    audioLoader = new THREE.AudioLoader();
    audioLoader.load('/audio/Mr.Kitty-After Dark.mp3', function(buffer){
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });

    analyser = new THREE.AudioAnalyser(sound, 32);
    data = analyser.getAverageFrequency();

    scene.add( sphere );
    camera.lookAt(0,2.5,0);

    console.log(sphere.position);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
    sphere.material.uniforms.time.value += 0.1;
    // sphere.rotation.x += 0.01;
    // sphere.rotation.y += 0.01;


    //Music modulation
    data = analyser.getAverageFrequency();
    sphere.material.uniforms.vertexMod.value = data;

};

function onClick(){
    const startMenu = document.getElementById('splash');
    startMenu.style.display = 'none';
    init();
}