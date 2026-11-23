
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const planets = [
    {
        name: "Mercury",
        diameter: "4,879 km",
        day: "58.6 Earth days",
        year: "88 Earth days",
        distance: "57.9 million km",
        description: "Planet terkecil di Tata Surya dengan permukaan berbatu dan banyak kawah.",
        fact: "Merkurius menyelesaikan satu orbit Matahari hanya dalam 88 hari Bumi.",
        color: 0x9b9188,
        size: 0.48
    },
    {
        name: "Venus",
        diameter: "12,104 km",
        day: "243 Earth days",
        year: "225 Earth days",
        distance: "108.2 million km",
        description: "Planet dengan atmosfer karbon dioksida sangat tebal dan suhu permukaan ekstrem.",
        fact: "Venus merupakan planet terpanas di Tata Surya.",
        color: 0xd6a66e,
        size: 0.85
    },
    {
        name: "Earth",
        diameter: "12,742 km",
        day: "23.9 hours",
        year: "365.25 days",
        distance: "149.6 million km",
        description: "Rumah kita di alam semesta, dengan lautan, atmosfer, dan kehidupan.",
        fact: "Bumi merupakan satu-satunya planet yang diketahui mendukung kehidupan.",
        color: 0x397dc0,
        size: 0.9
    },
    {
        name: "Mars",
        diameter: "6,779 km",
        day: "24.6 hours",
        year: "687 Earth days",
        distance: "227.9 million km",
        description: "Planet merah yang memiliki gunung berapi besar dan permukaan gurun.",
        fact: "Olympus Mons merupakan salah satu gunung berapi terbesar di Tata Surya.",
        color: 0xb85f3e,
        size: 0.65
    },
    {
        name: "Jupiter",
        diameter: "139,820 km",
        day: "9.9 hours",
        year: "11.86 Earth years",
        distance: "778.6 million km",
        description: "Planet terbesar di Tata Surya dan terkenal dengan badai Great Red Spot.",
        fact: "Jupiter merupakan planet terbesar di Tata Surya.",
        color: 0xc99a72,
        size: 1.65
    },
    {
        name: "Saturn",
        diameter: "116,460 km",
        day: "10.7 hours",
        year: "29.45 Earth years",
        distance: "1.43 billion km",
        description: "Planet raksasa gas yang terkenal dengan sistem cincin yang indah.",
        fact: "Cincin Saturnus tersusun terutama dari partikel es dan batuan.",
        color: 0xd5bd8d,
        size: 1.4
    },
    {
        name: "Uranus",
        diameter: "50,724 km",
        day: "17.2 hours",
        year: "84 Earth years",
        distance: "2.87 billion km",
        description: "Planet raksasa es dengan warna biru kehijauan dan kemiringan sumbu ekstrem.",
        fact: "Uranus berotasi dengan kemiringan sumbu sekitar 98 derajat.",
        color: 0x83c9d1,
        size: 1.08
    },
    {
        name: "Neptune",
        diameter: "49,244 km",
        day: "16.1 hours",
        year: "165 Earth years",
        distance: "4.5 billion km",
        description: "Planet terjauh dari Matahari dengan atmosfer biru dan angin sangat kencang.",
        fact: "Neptunus membutuhkan sekitar 165 tahun Bumi untuk mengorbit Matahari.",
        color: 0x426cdb,
        size: 1.05
    }
];

const container = document.getElementById("planetCanvas");
const selector = document.getElementById("planetSelector");

let scene, camera, renderer, controls;
let planetMesh, ringMesh;
let selectedPlanet = 2;
let rotating = true;

// Membuat tekstur planet sederhana secara prosedural
function createTexture(color, name) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");
    const base = new THREE.Color(color);

    ctx.fillStyle = "#" + base.getHexString();
    ctx.fillRect(0, 0, 1024, 512);

    if (name === "Earth") {
        ctx.fillStyle = "#174b35";

        for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.ellipse(
                Math.random() * 1024,
                Math.random() * 512,
                20 + Math.random() * 80,
                10 + Math.random() * 35,
                Math.random() * 3,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        ctx.fillStyle = "rgba(220,240,255,.6)";

        for (let i = 0; i < 100; i++) {
            ctx.beginPath();
            ctx.ellipse(
                Math.random() * 1024,
                Math.random() * 512,
                15 + Math.random() * 35,
                3 + Math.random() * 10,
                Math.random() * 3,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }
    } else {
        for (let i = 0; i < 1000; i++) {
            ctx.fillStyle = "rgba(255,255,255,.08)";
            ctx.fillRect(
                Math.random() * 1024,
                Math.random() * 512,
                Math.random() * 4,
                Math.random() * 4
            );
        }
    }

    return new THREE.CanvasTexture(canvas);
}

// Inisialisasi Three.js
function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.5;
    controls.maxDistance = 8;

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const sunlight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunlight.position.set(-4, 3, 5);
    scene.add(sunlight);

    const starsGeometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < 1500; i++) {
        positions.push(
            (Math.random() - 0.5) * 35,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 20 - 5
        );
    }

    starsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );

    const stars = new THREE.Points(
        starsGeometry,
        new THREE.PointsMaterial({
            color: 0xb9ceff,
            size: 0.025
        })
    );

    scene.add(stars);

    createPlanet(selectedPlanet);

    window.addEventListener("resize", resize);

    animate();
}

// Membuat planet
function createPlanet(index) {
    selectedPlanet = (index + planets.length) % planets.length;

    const planet = planets[selectedPlanet];

    if (planetMesh) {
        scene.remove(planetMesh);
        planetMesh.geometry.dispose();
        planetMesh.material.map?.dispose();
        planetMesh.material.dispose();
    }

    if (ringMesh) {
        scene.remove(ringMesh);
        ringMesh.geometry.dispose();
        ringMesh.material.dispose();
        ringMesh = null;
    }

    const geometry = new THREE.SphereGeometry(
        planet.size,
        80,
        64
    );

    const material = new THREE.MeshStandardMaterial({
        map: createTexture(planet.color, planet.name),
        roughness: 0.85
    });

    planetMesh = new THREE.Mesh(geometry, material);
    scene.add(planetMesh);

    // Cincin Saturnus
    if (planet.name === "Saturn") {
        ringMesh = new THREE.Mesh(
            new THREE.RingGeometry(1.75, 2.55, 128),
            new THREE.MeshBasicMaterial({
                color: 0xc9b58d,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.75
            })
        );

        ringMesh.rotation.x = Math.PI / 2.35;
        planetMesh.add(ringMesh);
    }

    camera.position.set(0, 0, Math.max(4.1, planet.size * 3.6));
    controls.target.set(0, 0, 0);
    controls.update();

    updateInformation(planet);
    updateSelector();
}

// Memperbarui informasi planet
function updateInformation(planet) {
    document.getElementById("infoName").textContent = planet.name;
    document.getElementById("planetDescription").textContent = planet.description;
    document.getElementById("diameter").textContent = planet.diameter;
    document.getElementById("dayLength").textContent = planet.day;
    document.getElementById("yearLength").textContent = planet.year;
    document.getElementById("distance").textContent = planet.distance;
    document.getElementById("planetFact").textContent = planet.fact;
}

// Tombol pemilihan planet
planets.forEach((planet, index) => {
    const button = document.createElement("button");

    button.className = "planet-chip";
    button.textContent = planet.name;

    button.addEventListener("click", () => {
        createPlanet(index);
    });

    selector.appendChild(button);
});

function updateSelector() {
    [...selector.children].forEach((button, index) => {
        button.classList.toggle("active", index === selectedPlanet);
    });
}

// Rotasi
function animate() {
    requestAnimationFrame(animate);

    if (planetMesh && rotating) {
        planetMesh.rotation.y += 0.0025;
    }

    controls.update();
    renderer.render(scene, camera);
}

// Resize
function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

// Kontrol tombol
document.getElementById("nextPlanet").addEventListener("click", () => {
    createPlanet(selectedPlanet + 1);
});

document.getElementById("prevPlanet").addEventListener("click", () => {
    createPlanet(selectedPlanet - 1);
});

document.getElementById("rotateToggle").addEventListener("click", (event) => {
    rotating = !rotating;
    event.target.textContent = rotating ? "Ⅱ" : "▶";
});

document.getElementById("resetView").addEventListener("click", () => {
    camera.position.set(
        0,
        0,
        Math.max(4.1, planets[selectedPlanet].size * 3.6)
    );

    controls.target.set(0, 0, 0);
    controls.update();
});

// Fakta acak
const facts = [
    "Cahaya Matahari membutuhkan sekitar 8 menit 20 detik untuk mencapai Bumi.",
    "Satu hari di Venus lebih lama daripada satu tahun Venus.",
    "Jupiter merupakan planet terbesar di Tata Surya.",
    "Bima Sakti memiliki ratusan miliar bintang.",
    "Neptunus memiliki angin yang sangat kencang.",
    "Bulan menjauh dari Bumi beberapa sentimeter setiap tahun."
];

document.getElementById("randomFactBtn").addEventListener("click", () => {
    const random = Math.floor(Math.random() * facts.length);

    document.getElementById("randomFact").textContent = facts[random];
});

// Jalankan visualisasi
try {
    init();
} catch (error) {
    console.error("Three.js gagal dijalankan:", error);
    container.textContent = "Visualisasi 3D tidak tersedia di browser ini.";
}
