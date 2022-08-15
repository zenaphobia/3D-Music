import * as THREE from './node_modules/three/build/three.module.js';

let scene, camera, container, renderer, fileLoader

let listener, sound, data, analyser, audioLoader

//temp stuff
let material, geometry, sphere, customShader

//shaders

const vert = `
void main(){
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
}
`;
const frag =`
varying vec3 vNormal;
uniform vec3 colorMine;
void main()
{
    vec3 colorMine = vec3(55,0,0);
    gl_FragColor = vec4( colorMine, clamp(sin(u_time / 2.0), 0.5, .75) );
}
`;

customShader = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2()},
        vertexMod: { value: 1.0 },

        vertexShader: vert,
        fragmentShader: frag,
    }
});

document.getElementById('start-button').addEventListener("click", function(){onClick()});

function init(){
    container = document.getElementById("canvas");
    scene = new THREE.Scene();
    fileLoader = new THREE.FileLoader();
    camera = new THREE.PerspectiveCamera( 25, container.offsetWidth / container.offsetHeight, 0.1, 50 );
    camera.aspect = (container.offsetWidth / container.offsetHeight);
    camera.position.z = 25;
    camera.position.y = 15;


    renderer = new THREE.WebGLRenderer({canvas: container, antialias: true, alpha: true});
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    renderer.setPixelRatio( window.devicePixelRatio );

    geometry = new THREE.SphereGeometry( 5, 32, 16 );
    material = new THREE.MeshBasicMaterial({color: 0x00ff00 });
    sphere = new THREE.Mesh( geometry, material );

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

    camera.lookAt(sphere.position);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
    data = analyser.getAverageFrequency();
    console.log(data);
};

function onClick(){
    const startMenu = document.getElementById('splash');
    startMenu.style.display = 'none';
    init();
}