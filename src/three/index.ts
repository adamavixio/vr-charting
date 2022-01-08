import * as THREE from "THREE";
import { OrbitControls } from "THREE/examples/jsm/controls/OrbitControls";
import { newChart } from "./chart";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement)

const chart = newChart(scene, -10, 10, -10, 10, .1)
chart.axis()
chart.grid()
chart.points((x, y) => 2 * (Math.cos(x / 2) + Math.cos(y / 2)))

let i = 0
setInterval(() => {
	let divider = (i + 1) % 2
	chart.points((x, y) => 2 * (Math.cos(x / divider) + Math.cos(y / divider)))
	i += 0.1
}, 100)

function animate() {
	requestAnimationFrame(animate);

	orbitControls.update()
	renderer.render(scene, camera);
};

export { animate };

