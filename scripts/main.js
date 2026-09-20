const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x1b1f2a);

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);


// Room Dimensions

const W = 8;
const D = 6;
const H = 3;
const T = 0.2;


// Wall Materials

const brickTextureLoader = new THREE.TextureLoader();

const brickTexture = brickTextureLoader.load(
    "texture/brick.jpg"
);

brickTexture.colorSpace = THREE.SRGBColorSpace;
brickTexture.wrapS = THREE.RepeatWrapping;
brickTexture.wrapT = THREE.ClampToEdgeWrapping;
brickTexture.anisotropy = 8;

const brickWallMat = new THREE.MeshStandardMaterial({
    map: brickTexture,
    roughness: 0.9
});


const concreteTextureLoader = new THREE.TextureLoader();

const concreteTexture = concreteTextureLoader.load(
    "texture/concrete.jpg"
);

concreteTexture.colorSpace = THREE.SRGBColorSpace;
concreteTexture.wrapS = THREE.RepeatWrapping;
concreteTexture.wrapT = THREE.RepeatWrapping;
concreteTexture.repeat.x = 3;
concreteTexture.repeat.y = 2;
concreteTexture.anisotropy = 8;

const concreteWallMat = new THREE.MeshStandardMaterial({
    map: concreteTexture,
    roughness: 0.9
});


const frontWallMat = new THREE.MeshStandardMaterial({
    color: 0xcbbba8,
    roughness: 0.9
});


const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xf0ebe2,
    roughness: 0.9
});


// Floor

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    new THREE.MeshStandardMaterial({
        map: textures.floor,
        roughness: 0.8
    })
);

floor.rotation.x = -Math.PI / 2;

scene.add(floor);


// Back Wall

const back = new THREE.Mesh(
    new THREE.BoxGeometry(W + 2 * T, H, T),
    brickWallMat
);

back.position.x = 0;
back.position.y = H / 2;
back.position.z = -D / 2 - T / 2;

scene.add(back);


// Left Wall

const left = new THREE.Mesh(
    new THREE.BoxGeometry(T, H, D + T),
    concreteWallMat
);

left.position.x = -W / 2 - T / 2;
left.position.y = H / 2;
left.position.z = -T / 2;

scene.add(left);


// Right Wall With Window

const winZ = 1.5;
const winY = 1.5;

const winW = 2.4;
const winH = 2.4;

const panes = 2;

const rightX = W / 2 + T / 2;

const wallBackEdge = -D / 2 - T;
const wallFrontEdge = D / 2;

const winBack = winZ - winW / 2;
const winFront = winZ + winW / 2;

const winBottom = winY - winH / 2;
const winTop = winY + winH / 2;


function wallPiece(depth, h, z, y) {

    const piece = new THREE.Mesh(
        new THREE.BoxGeometry(T, h, depth),
        concreteWallMat
    );

    piece.position.x = rightX;
    piece.position.y = y;
    piece.position.z = z;

    scene.add(piece);
}


wallPiece(
    winBack - wallBackEdge,
    H,
    (wallBackEdge + winBack) / 2,
    H / 2
);


wallPiece(
    wallFrontEdge - winFront,
    H,
    (winFront + wallFrontEdge) / 2,
    H / 2
);


wallPiece(
    winW,
    winBottom,
    winZ,
    winBottom / 2
);


wallPiece(
    winW,
    H - winTop,
    winZ,
    winTop + (H - winTop) / 2
);


// Window Glass

const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(winW, winH),
    new THREE.MeshStandardMaterial({
        color: 0x9fd0ff,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
    })
);

glass.rotation.y = Math.PI / 2;

glass.position.x = rightX;
glass.position.y = winY;
glass.position.z = winZ;

scene.add(glass);


// Window Frame

const frameMat = new THREE.MeshStandardMaterial({
    color: 0x0e0f14
});


function framePiece(depth, h, z, y) {

    const piece = new THREE.Mesh(
        new THREE.BoxGeometry(T + 0.05, h, depth),
        frameMat
    );

    piece.position.x = rightX;
    piece.position.y = y;
    piece.position.z = z;

    scene.add(piece);
}


framePiece(
    winW + 0.1,
    0.06,
    winZ,
    winTop
);

framePiece(
    winW + 0.1,
    0.06,
    winZ,
    winBottom
);

framePiece(
    0.06,
    winH,
    winBack,
    winY
);

framePiece(
    0.06,
    winH,
    winFront,
    winY
);


for (let i = 1; i < panes; i++) {

    framePiece(
        0.04,
        winH,
        winBack + (winW / panes) * i,
        winY
    );
}


// Curtain

const paneStart = winBack;

const curtainX = W / 2 - 0.15;

const curtainZ0 = paneStart - 0.1;
const curtainZ1 = paneStart + winW / panes / 2;

const rodY = winTop + 0.12;

const curtainH = rodY - 0.05;

const curtainMat = new THREE.MeshLambertMaterial({
    color: 0x31333b
});

const folds = 8;

const foldW = (curtainZ1 - curtainZ0) / folds;


for (let i = 0; i < folds; i++) {

    const strip = new THREE.Mesh(
        new THREE.BoxGeometry(
            0.05,
            curtainH,
            foldW * 1.1
        ),
        curtainMat
    );

    strip.position.x =
        curtainX + (i % 2 ? 0.04 : -0.04);

    strip.position.y =
        0.05 + curtainH / 2;

    strip.position.z =
        curtainZ0 + foldW * (i + 0.5);

    scene.add(strip);
}


const rodStart = curtainZ0 - 0.1;
const rodEnd = curtainZ1 + 0.1;

const rodMat = new THREE.MeshLambertMaterial({
    color: 0x2e2e33
});

const rod = new THREE.Mesh(
    new THREE.CylinderGeometry(
        0.02,
        0.02,
        rodEnd - rodStart,
        12
    ),
    rodMat
);

rod.rotation.x = Math.PI / 2;

rod.position.x = curtainX;
rod.position.y = rodY;
rod.position.z = (rodStart + rodEnd) / 2;

scene.add(rod);


for (const z of [rodStart, rodEnd]) {

    const cap = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.035,
            12,
            12
        ),
        rodMat
    );

    cap.position.x = curtainX;
    cap.position.y = rodY;
    cap.position.z = z;

    scene.add(cap);
}


// Front Wall

const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(W, H),
    frontWallMat
);

frontWall.position.x = 0;
frontWall.position.y = H / 2;
frontWall.position.z = D / 2;

frontWall.rotation.y = Math.PI;

scene.add(frontWall);


// Ceiling

const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    ceilingMat
);

ceiling.position.x = 0;
ceiling.position.y = H;
ceiling.position.z = 0;

ceiling.rotation.x = Math.PI / 2;

scene.add(ceiling);


// Lighting

const ambient = new THREE.HemisphereLight(
    0xffffff,
    0x8a7a66,
    0.55 * Math.PI
);

scene.add(ambient);


const sun = new THREE.DirectionalLight(
    0xfff1d6,
    0.9 * Math.PI
);

sun.position.x = 9;
sun.position.y = 5;
sun.position.z = 4;

sun.target.position.x = 0;
sun.target.position.y = 0;
sun.target.position.z = 0.5;

sun.castShadow = true;

sun.shadow.mapSize.width = 2048;
sun.shadow.mapSize.height = 2048;

sun.shadow.camera.left = -8;
sun.shadow.camera.right = 8;
sun.shadow.camera.top = 8;
sun.shadow.camera.bottom = -8;

sun.shadow.camera.near = 1;
sun.shadow.camera.far = 25;

sun.shadow.normalBias = 0.03;

scene.add(sun);
scene.add(sun.target);


// Camera Controls

const view = {
    target: new THREE.Vector3(0, 1.0, 0),
    theta: 0.55,
    phi: 1.05,
    radius: 11
};


function updateCamera() {

    const s = Math.sin(view.phi);
    const c = Math.cos(view.phi);

    camera.position.x =
        view.target.x +
        view.radius *
        s *
        Math.sin(view.theta);

    camera.position.y =
        view.target.y +
        view.radius * c;

    camera.position.z =
        view.target.z +
        view.radius *
        s *
        Math.cos(view.theta);

    camera.lookAt(view.target);
}


updateCamera();


const el = renderer.domElement;

el.style.touchAction = "none";

let dragging = false;
let panning = false;

let lastX = 0;
let lastY = 0;


el.addEventListener("contextmenu", function(e) {

    e.preventDefault();

});


el.addEventListener("pointerdown", function(e) {

    dragging = true;

    panning =
        e.button === 2 ||
        e.shiftKey;

    lastX = e.clientX;
    lastY = e.clientY;

    el.setPointerCapture(e.pointerId);

});


el.addEventListener("pointerup", function() {

    dragging = false;

});


el.addEventListener("pointermove", function(e) {

    if (!dragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    lastX = e.clientX;
    lastY = e.clientY;


    if (panning) {

        const right = new THREE.Vector3()
            .setFromMatrixColumn(camera.matrix, 0);

        const up = new THREE.Vector3()
            .setFromMatrixColumn(camera.matrix, 1);

        const k = view.radius * 0.0014;

        view.target
            .addScaledVector(right, -dx * k)
            .addScaledVector(up, dy * k);

    } else {

        view.theta -= dx * 0.006;

        view.phi = Math.min(
            Math.max(
                view.phi - dy * 0.006,
                0.15
            ),
            Math.PI * 0.55
        );

    }

    updateCamera();

});


el.addEventListener("wheel", function(e) {

    e.preventDefault();

    view.radius = Math.min(
        Math.max(
            view.radius *
            (1 + e.deltaY * 0.001),
            1.5
        ),
        20
    );

    updateCamera();

}, { passive: false });


// Door

const doorZ = 2.0;


const DoorFrameGeometry = new THREE.RoundedBoxGeometry(
    0.05,
    2.2,
    1.15,
    4,
    0.01
);

const DoorFrameMaterial = new THREE.MeshLambertMaterial({
    color: 0xf7f5f0
});

const doorFrame = new THREE.Mesh(
    DoorFrameGeometry,
    DoorFrameMaterial
);

doorFrame.position.x = -3.975;
doorFrame.position.y = 1.1;
doorFrame.position.z = doorZ;

scene.add(doorFrame);


const DoorGeometry = new THREE.RoundedBoxGeometry(
    0.05,
    2.1,
    1.0,
    4,
    0.01
);

const DoorMaterial = new THREE.MeshLambertMaterial({
    color: 0x7a5233
});

const door = new THREE.Mesh(
    DoorGeometry,
    DoorMaterial
);

door.position.x = -3.93;
door.position.y = 1.05;
door.position.z = doorZ;

scene.add(door);


const DoorKnobGeometry = new THREE.SphereGeometry(
    0.04,
    12,
    12
);

const DoorKnobMaterial = new THREE.MeshLambertMaterial({
    color: 0xd4af37
});

const doorKnob = new THREE.Mesh(
    DoorKnobGeometry,
    DoorKnobMaterial
);

doorKnob.position.x = -3.87;
doorKnob.position.y = 1.0;
doorKnob.position.z = doorZ - 0.38;

scene.add(doorKnob);


// Bed

const BedFrameGeometry = new THREE.RoundedBoxGeometry(
    2.6,
    0.3,
    3.4,
    4,
    0.02
);

const BedFrameMaterial = new THREE.MeshLambertMaterial({
    map: textures.wood
});

const bedFrame = new THREE.Mesh(
    BedFrameGeometry,
    BedFrameMaterial
);

bedFrame.position.x = -0.2;
bedFrame.position.y = 0.15;
bedFrame.position.z = -1.3;

scene.add(bedFrame);


// Mattress

const MattressGeometry = new THREE.RoundedBoxGeometry(
    2.4,
    0.45,
    3.2,
    4,
    0.08
);

const MattressMaterial = new THREE.MeshLambertMaterial({
    color: 0x93a3bd
});

const mattress = new THREE.Mesh(
    MattressGeometry,
    MattressMaterial
);

mattress.position.x = -0.2;
mattress.position.y = 0.48;
mattress.position.z = -1.3;

scene.add(mattress);


// Headboard

const HeadboardGeometry = new THREE.RoundedBoxGeometry(
    2.6,
    1.2,
    0.25,
    4,
    0.02
);

const HeadboardMaterial = new THREE.MeshLambertMaterial({
    map: textures.wood
});

const headboard = new THREE.Mesh(
    HeadboardGeometry,
    HeadboardMaterial
);

headboard.position.x = -0.2;
headboard.position.y = 0.9;
headboard.position.z = -2.9;

scene.add(headboard);


// Blanket

const blanketTextureLoader = new THREE.TextureLoader();

const blanketTexture = blanketTextureLoader.load(
    "texture/blanket.jpg"
);

blanketTexture.colorSpace = THREE.SRGBColorSpace;

const BlanketMaterial = new THREE.MeshLambertMaterial({
    map: blanketTexture
});


const BlanketTopGeometry = new THREE.RoundedBoxGeometry(
    2.5,
    0.05,
    2.3,
    4,
    0.02
);

const blanketTop = new THREE.Mesh(
    BlanketTopGeometry,
    BlanketMaterial
);

blanketTop.position.x = -0.2;
blanketTop.position.y = 0.731;
blanketTop.position.z = -0.8;

scene.add(blanketTop);


const BlanketSideGeometry = new THREE.RoundedBoxGeometry(
    0.05,
    0.37,
    2.275,
    4,
    0.02
);

const blanketLeft = new THREE.Mesh(
    BlanketSideGeometry,
    BlanketMaterial
);

blanketLeft.position.x = -1.425;
blanketLeft.position.y = 0.555;
blanketLeft.position.z = -0.8125;

scene.add(blanketLeft);


const blanketRight = new THREE.Mesh(
    BlanketSideGeometry,
    BlanketMaterial
);

blanketRight.position.x = 1.025;
blanketRight.position.y = 0.555;
blanketRight.position.z = -0.8125;

scene.add(blanketRight);


const BlanketFootGeometry = new THREE.RoundedBoxGeometry(
    2.5,
    0.37,
    0.05,
    4,
    0.02
);

const blanketFoot = new THREE.Mesh(
    BlanketFootGeometry,
    BlanketMaterial
);

blanketFoot.position.x = -0.2;
blanketFoot.position.y = 0.555;
blanketFoot.position.z = 0.325;

scene.add(blanketFoot);


// Pillows

const PillowMaterial = new THREE.MeshLambertMaterial({
    color: 0xf1efe8
});

const PillowGeometry = new THREE.RoundedBoxGeometry(
    0.9,
    0.16,
    0.5,
    4,
    0.07
);


const pillowLeft = new THREE.Mesh(
    PillowGeometry,
    PillowMaterial
);

pillowLeft.position.x = -0.72;
pillowLeft.position.y = 0.785;
pillowLeft.position.z = -2.5;

pillowLeft.rotation.y = 0.04;

scene.add(pillowLeft);


const pillowRight = new THREE.Mesh(
    PillowGeometry,
    PillowMaterial
);

pillowRight.position.x = 0.32;
pillowRight.position.y = 0.785;
pillowRight.position.z = -2.5;

pillowRight.rotation.y = -0.04;

scene.add(pillowRight);


// Round Pillow

const RoundPillowGeometry = new THREE.SphereGeometry(
    0.28,
    32,
    16
);

const chansTextureLoader = new THREE.TextureLoader();

const chansTexture = chansTextureLoader.load(
    "texture/chans.png"
);

chansTexture.colorSpace = THREE.SRGBColorSpace;

chansTexture.wrapS = THREE.ClampToEdgeWrapping;
chansTexture.wrapT = THREE.ClampToEdgeWrapping;

const RoundPillowMaterial = new THREE.MeshLambertMaterial({
    map: chansTexture
});

const roundPillow = new THREE.Mesh(
    RoundPillowGeometry,
    RoundPillowMaterial
);

roundPillow.scale.x = 1;
roundPillow.scale.y = 0.3;
roundPillow.scale.z = 1;

roundPillow.rotation.x = 0.45;

roundPillow.position.x = -0.2;
roundPillow.position.y = 0.96;
roundPillow.position.z = -2.5;

scene.add(roundPillow);


// Ottoman

const OttomanMaterial = new THREE.MeshLambertMaterial({
    color: 0x7d8590
});


const OttomanBaseGeometry = new THREE.RoundedBoxGeometry(
    2.6,
    0.32,
    0.75,
    4,
    0.06
);

const ottomanBase = new THREE.Mesh(
    OttomanBaseGeometry,
    OttomanMaterial
);

ottomanBase.position.x = -0.2;
ottomanBase.position.y = 0.26;
ottomanBase.position.z = 0.8;

scene.add(ottomanBase);


// Ottoman Cushion

const ottomanTextureLoader = new THREE.TextureLoader();

const ottomanTexture = ottomanTextureLoader.load(
    "texture/ottoman.jpg"
);

ottomanTexture.colorSpace = THREE.SRGBColorSpace;

const OttomanCushionMaterial = new THREE.MeshLambertMaterial({
    map: ottomanTexture
});


const OttomanCushionGeometry = new THREE.RoundedBoxGeometry(
    2.5,
    0.14,
    0.65,
    4,
    0.06
);

const ottomanCushion = new THREE.Mesh(
    OttomanCushionGeometry,
    OttomanCushionMaterial
);

ottomanCushion.position.x = -0.2;
ottomanCushion.position.y = 0.47;
ottomanCushion.position.z = 0.8;

scene.add(ottomanCushion);


// Ottoman Legs

const OttomanLegGeometry = new THREE.CylinderGeometry(
    0.04,
    0.04,
    0.1,
    12
);

const OttomanLegMaterial = new THREE.MeshLambertMaterial({
    color: 0x654321
});


const ottomanLeg1 = new THREE.Mesh(
    OttomanLegGeometry,
    OttomanLegMaterial
);

ottomanLeg1.position.x = -1.35;
ottomanLeg1.position.y = 0.05;
ottomanLeg1.position.z = 0.52;

scene.add(ottomanLeg1);


const ottomanLeg2 = new THREE.Mesh(
    OttomanLegGeometry,
    OttomanLegMaterial
);

ottomanLeg2.position.x = 0.95;
ottomanLeg2.position.y = 0.05;
ottomanLeg2.position.z = 0.52;

scene.add(ottomanLeg2);


const ottomanLeg3 = new THREE.Mesh(
    OttomanLegGeometry,
    OttomanLegMaterial
);

ottomanLeg3.position.x = -1.35;
ottomanLeg3.position.y = 0.05;
ottomanLeg3.position.z = 1.08;

scene.add(ottomanLeg3);


const ottomanLeg4 = new THREE.Mesh(
    OttomanLegGeometry,
    OttomanLegMaterial
);

ottomanLeg4.position.x = 0.95;
ottomanLeg4.position.y = 0.05;
ottomanLeg4.position.z = 1.08;

scene.add(ottomanLeg4);


// Rug

const rugTextureLoader = new THREE.TextureLoader();

const rugTexture = rugTextureLoader.load(
    "texture/rug.jpg"
);

rugTexture.colorSpace = THREE.SRGBColorSpace;

const RugMaterial = new THREE.MeshLambertMaterial({
    map: rugTexture
});

const RugGeometry = new THREE.CylinderGeometry(
    2.5,
    2.5,
    0.02,
    64
);

const rug = new THREE.Mesh(
    RugGeometry,
    RugMaterial
);

rug.position.x = -0.2;
rug.position.y = 0.01;
rug.position.z = -0.5;

scene.add(rug);


// TV Bench

const TVBenchMaterial = new THREE.MeshLambertMaterial({
    map: textures.woody
});

const TVBenchGeometry = new THREE.RoundedBoxGeometry(
    3.0,
    0.4,
    0.45,
    4,
    0.02
);

const tvBench = new THREE.Mesh(
    TVBenchGeometry,
    TVBenchMaterial
);

tvBench.position.x = -0.2;
tvBench.position.y = 0.2;
tvBench.position.z = 2.775;

scene.add(tvBench);


const TVTopMaterial = new THREE.MeshLambertMaterial({
    color: 0x9c7a54
});

const TVTopGeometry = new THREE.RoundedBoxGeometry(
    3.04,
    0.05,
    0.49,
    4,
    0.02
);

const tvTop = new THREE.Mesh(
    TVTopGeometry,
    TVTopMaterial
);

tvTop.position.x = -0.2;
tvTop.position.y = 0.425;
tvTop.position.z = 2.755;

scene.add(tvTop);


// TV

const TVFrameMaterial = new THREE.MeshLambertMaterial({
    color: 0x111111
});

const TVFrameGeometry = new THREE.RoundedBoxGeometry(
    2.2,
    1.25,
    0.06,
    4,
    0.02
);

const tvFrame = new THREE.Mesh(
    TVFrameGeometry,
    TVFrameMaterial
);

tvFrame.position.x = -0.2;
tvFrame.position.y = 1.25;
tvFrame.position.z = 2.97;

scene.add(tvFrame);


// TV Screen

const lanternTextureLoader = new THREE.TextureLoader();

const lanternTexture = lanternTextureLoader.load(
    "texture/lanterns.jpg"
);

lanternTexture.colorSpace = THREE.SRGBColorSpace;

const TVScreenMaterial = new THREE.MeshLambertMaterial({
    map: lanternTexture
});

const TVScreenGeometry = new THREE.RoundedBoxGeometry(
    2.1,
    1.15,
    0.01,
    4,
    0.004
);

const tvScreen = new THREE.Mesh(
    TVScreenGeometry,
    TVScreenMaterial
);

tvScreen.position.x = -0.2;
tvScreen.position.y = 1.25;
tvScreen.position.z = 2.935;

scene.add(tvScreen);


// Meat Cube

const meatTextureLoader = new THREE.TextureLoader();

const meatTexture = meatTextureLoader.load(
    "texture/meat.jpg"
);

meatTexture.colorSpace = THREE.SRGBColorSpace;


const CubeGeometry = new THREE.BoxGeometry(
    0.25,
    0.25,
    0.25
);

const CubeMaterial = new THREE.MeshLambertMaterial({
    map: meatTexture
});

const cube = new THREE.Mesh(
    CubeGeometry,
    CubeMaterial
);

cube.position.x = 1.15;
cube.position.y = 0.58;
cube.position.z = 2.755;

scene.add(cube);


// Candles

const CandleMaterial = new THREE.MeshLambertMaterial({
    color: 0xf1d6a8
});


const Candle1Geometry = new THREE.CylinderGeometry(
    0.06,
    0.06,
    0.28,
    12
);

const candle1 = new THREE.Mesh(
    Candle1Geometry,
    CandleMaterial
);

candle1.position.x = 0.72;
candle1.position.y = 0.59;
candle1.position.z = 2.68;

scene.add(candle1);


const Candle2Geometry = new THREE.CylinderGeometry(
    0.06,
    0.06,
    0.18,
    12
);

const candle2 = new THREE.Mesh(
    Candle2Geometry,
    CandleMaterial
);

candle2.position.x = 0.62;
candle2.position.y = 0.54;
candle2.position.z = 2.82;

scene.add(candle2);


const Candle3Geometry = new THREE.CylinderGeometry(
    0.06,
    0.06,
    0.23,
    12
);

const candle3 = new THREE.Mesh(
    Candle3Geometry,
    CandleMaterial
);

candle3.position.x = 0.82;
candle3.position.y = 0.565;
candle3.position.z = 2.82;

scene.add(candle3);


// Cabinet

const cabinetLen = 2.6;
const cabinetZ = -1.5;


const CabinetBodyGeometry = new THREE.RoundedBoxGeometry(
    0.5,
    0.85,
    cabinetLen,
    4,
    0.02
);

const CabinetBodyMaterial = new THREE.MeshLambertMaterial({
    map: textures.woody
});

const cabinetBody = new THREE.Mesh(
    CabinetBodyGeometry,
    CabinetBodyMaterial
);

cabinetBody.position.x = 3.75;
cabinetBody.position.y = 0.425;
cabinetBody.position.z = cabinetZ;

scene.add(cabinetBody);


const CabinetTopGeometry = new THREE.RoundedBoxGeometry(
    0.54,
    0.05,
    cabinetLen + 0.04,
    4,
    0.02
);

const CabinetTopMaterial = new THREE.MeshLambertMaterial({
    color: 0x9c7a54
});

const cabinetTop = new THREE.Mesh(
    CabinetTopGeometry,
    CabinetTopMaterial
);

cabinetTop.position.x = 3.73;
cabinetTop.position.y = 0.875;
cabinetTop.position.z = cabinetZ;

scene.add(cabinetTop);


const CabinetDoorGeometry = new THREE.RoundedBoxGeometry(
    0.02,
    0.7,
    0.8,
    4,
    0.008
);

const CabinetDoorMaterial = new THREE.MeshLambertMaterial({
    color: 0x7a5233
});


const cabinetDoor1 = new THREE.Mesh(
    CabinetDoorGeometry,
    CabinetDoorMaterial
);

cabinetDoor1.position.x = 3.49;
cabinetDoor1.position.y = 0.43;
cabinetDoor1.position.z = cabinetZ - 0.85;

scene.add(cabinetDoor1);


const cabinetDoor2 = new THREE.Mesh(
    CabinetDoorGeometry,
    CabinetDoorMaterial
);

cabinetDoor2.position.x = 3.49;
cabinetDoor2.position.y = 0.43;
cabinetDoor2.position.z = cabinetZ;

scene.add(cabinetDoor2);


const cabinetDoor3 = new THREE.Mesh(
    CabinetDoorGeometry,
    CabinetDoorMaterial
);

cabinetDoor3.position.x = 3.49;
cabinetDoor3.position.y = 0.43;
cabinetDoor3.position.z = cabinetZ + 0.85;

scene.add(cabinetDoor3);


// Closet

const closetW = 1.8;
const closetD = 0.6;
const closetH = 2.4;

const closetX = 2.9;
const closetZ = 3 - closetD / 2;


const ClosetBodyGeometry = new THREE.RoundedBoxGeometry(
    closetW,
    closetH,
    closetD,
    4,
    0.02
);

const ClosetBodyMaterial = new THREE.MeshLambertMaterial({
    color: 0x6c4529
});

const closetBody = new THREE.Mesh(
    ClosetBodyGeometry,
    ClosetBodyMaterial
);

closetBody.position.x = closetX;
closetBody.position.y = closetH / 2;
closetBody.position.z = closetZ;

scene.add(closetBody);


const closetFrontZ =
    closetZ - closetD / 2 - 0.012;


const ClosetDoorGeometry = new THREE.RoundedBoxGeometry(
    closetW / 2 - 0.05,
    2.3,
    0.03,
    4,
    0.01
);

const ClosetDoorMaterial = new THREE.MeshLambertMaterial({
    color: 0x8a6240
});


const closetDoorLeft = new THREE.Mesh(
    ClosetDoorGeometry,
    ClosetDoorMaterial
);

closetDoorLeft.position.x =
    closetX - closetW / 4;

closetDoorLeft.position.y = 1.2;
closetDoorLeft.position.z = closetFrontZ;

scene.add(closetDoorLeft);


const closetDoorRight = new THREE.Mesh(
    ClosetDoorGeometry,
    ClosetDoorMaterial
);

closetDoorRight.position.x =
    closetX + closetW / 4;

closetDoorRight.position.y = 1.2;
closetDoorRight.position.z = closetFrontZ;

scene.add(closetDoorRight);


// Closet Handles

const ClosetHandleGeometry = new THREE.RoundedBoxGeometry(
    0.03,
    0.4,
    0.03,
    4,
    0.01
);

const ClosetHandleMaterial = new THREE.MeshLambertMaterial({
    color: 0xd4af37
});


const closetHandleLeft = new THREE.Mesh(
    ClosetHandleGeometry,
    ClosetHandleMaterial
);

closetHandleLeft.position.x =
    closetX - 0.08;

closetHandleLeft.position.y = 1.15;
closetHandleLeft.position.z =
    closetFrontZ - 0.025;

scene.add(closetHandleLeft);


const closetHandleRight = new THREE.Mesh(
    ClosetHandleGeometry,
    ClosetHandleMaterial
);

closetHandleRight.position.x =
    closetX + 0.08;

closetHandleRight.position.y = 1.15;
closetHandleRight.position.z =
    closetFrontZ - 0.025;

scene.add(closetHandleRight);


// Posters

const PosterFrameMaterial = new THREE.MeshLambertMaterial({
    color: 0x2b2b2b
});

const PosterPaperMaterial = new THREE.MeshLambertMaterial({
    color: 0xf1efe8
});

const PosterFrameGeometry = new THREE.BoxGeometry(
    0.03,
    0.91,
    0.66
);

const PosterPaperGeometry = new THREE.PlaneGeometry(
    0.6,
    0.85
);


// Poster 1

const jubileeTextureLoader = new THREE.TextureLoader();

const jubileeTexture = jubileeTextureLoader.load(
    "texture/jubilee.png"
);

jubileeTexture.colorSpace = THREE.SRGBColorSpace;

const Poster1Material = new THREE.MeshLambertMaterial({
    map: jubileeTexture
});

const posterFrame1 = new THREE.Mesh(
    PosterFrameGeometry,
    PosterFrameMaterial
);

posterFrame1.position.x = 3.985;
posterFrame1.position.y = 1.75;
posterFrame1.position.z = -2.41;

scene.add(posterFrame1);


const posterPaper1 = new THREE.Mesh(
    PosterPaperGeometry,
    Poster1Material
);

posterPaper1.rotation.y = -Math.PI / 2;

posterPaper1.position.x = 3.966;
posterPaper1.position.y = 1.75;
posterPaper1.position.z = -2.41;

scene.add(posterPaper1);


// Poster 2

const flashTextureLoader = new THREE.TextureLoader();

const flashTexture = flashTextureLoader.load(
    "texture/flash.png"
);

flashTexture.colorSpace = THREE.SRGBColorSpace;

const Poster2Material = new THREE.MeshLambertMaterial({
    map: flashTexture
});

const posterFrame2 = new THREE.Mesh(
    PosterFrameGeometry,
    PosterFrameMaterial
);

posterFrame2.position.x = 3.985;
posterFrame2.position.y = 1.75;
posterFrame2.position.z = -1.5;

scene.add(posterFrame2);


const posterPaper2 = new THREE.Mesh(
    PosterPaperGeometry,
    Poster2Material
);

posterPaper2.rotation.y = -Math.PI / 2;

posterPaper2.position.x = 3.966;
posterPaper2.position.y = 1.75;
posterPaper2.position.z = -1.5;

scene.add(posterPaper2);


// Poster 3

const frankTextureLoader = new THREE.TextureLoader();

const frankTexture = frankTextureLoader.load(
    "texture/Frank.jpg"
);

frankTexture.colorSpace = THREE.SRGBColorSpace;

const Poster3Material = new THREE.MeshLambertMaterial({
    map: frankTexture
});

const posterFrame3 = new THREE.Mesh(
    PosterFrameGeometry,
    PosterFrameMaterial
);

posterFrame3.position.x = 3.985;
posterFrame3.position.y = 1.75;
posterFrame3.position.z = -0.59;

scene.add(posterFrame3);


const posterPaper3 = new THREE.Mesh(
    PosterPaperGeometry,
    Poster3Material
);

posterPaper3.rotation.y = -Math.PI / 2;

posterPaper3.position.x = 3.966;
posterPaper3.position.y = 1.75;
posterPaper3.position.z = -0.59;

scene.add(posterPaper3);


// Pendant Light

const pendantX = -0.2;
const pendantZ = -0.5;


const PendantCordGeometry = new THREE.CylinderGeometry(
    0.01,
    0.01,
    0.6,
    8
);

const PendantCordMaterial = new THREE.MeshLambertMaterial({
    color: 0x2e2e33
});

const pendantCord = new THREE.Mesh(
    PendantCordGeometry,
    PendantCordMaterial
);

pendantCord.position.x = pendantX;
pendantCord.position.y = 2.7;
pendantCord.position.z = pendantZ;

scene.add(pendantCord);


const PendantBulbGeometry = new THREE.SphereGeometry(
    0.13,
    20,
    16
);

const PendantBulbMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff2cf
});

const pendantBulb = new THREE.Mesh(
    PendantBulbGeometry,
    PendantBulbMaterial
);

pendantBulb.position.x = pendantX;
pendantBulb.position.y = 2.3;
pendantBulb.position.z = pendantZ;

scene.add(pendantBulb);


const pendantLight = new THREE.PointLight(
    0xffe2b0,
    0,
    0,
    2
);

pendantLight.position.x = pendantX;
pendantLight.position.y = 2.3;
pendantLight.position.z = pendantZ;

pendantLight.castShadow = true;

pendantLight.shadow.mapSize.width = 1024;
pendantLight.shadow.mapSize.height = 1024;

pendantLight.shadow.normalBias = 0.03;

scene.add(pendantLight);


// Lamp

const lampX = 3.75;
const lampZ = -0.45;


const LampMetalMaterial = new THREE.MeshLambertMaterial({
    color: 0x2e2e33
});

const LampShadeMaterial = new THREE.MeshLambertMaterial({
    color: 0xf6e3b4,
    emissive: 0xffc870,
    emissiveIntensity: 0
});


const LampBaseGeometry = new THREE.CylinderGeometry(
    0.08,
    0.1,
    0.03,
    20
);

const lampBase = new THREE.Mesh(
    LampBaseGeometry,
    LampMetalMaterial
);

lampBase.position.x = lampX;
lampBase.position.y = 0.915;
lampBase.position.z = lampZ;

scene.add(lampBase);


const LampStemGeometry = new THREE.CylinderGeometry(
    0.015,
    0.015,
    0.16,
    10
);

const lampStem = new THREE.Mesh(
    LampStemGeometry,
    LampMetalMaterial
);

lampStem.position.x = lampX;
lampStem.position.y = 1.01;
lampStem.position.z = lampZ;

scene.add(lampStem);


const LampShadeGeometry = new THREE.CylinderGeometry(
    0.09,
    0.15,
    0.16,
    24
);

const lampShade = new THREE.Mesh(
    LampShadeGeometry,
    LampShadeMaterial
);

lampShade.position.x = lampX;
lampShade.position.y = 1.17;
lampShade.position.z = lampZ;

scene.add(lampShade);


const lampLight = new THREE.PointLight(
    0xffd9a0,
    0,
    6,
    2
);

lampLight.position.x = lampX;
lampLight.position.y = 1.15;
lampLight.position.z = lampZ;

scene.add(lampLight);


// Candle Flames

const FlameGeometry = new THREE.SphereGeometry(
    0.02,
    12,
    12
);

const FlameMaterial = new THREE.MeshBasicMaterial({
    color: 0xffc46b
});


const flame1 = new THREE.Mesh(
    FlameGeometry,
    FlameMaterial
);

flame1.scale.y = 1.6;

flame1.position.x = 0.72;
flame1.position.y = 0.76;
flame1.position.z = 2.68;

scene.add(flame1);


const flame2 = new THREE.Mesh(
    FlameGeometry,
    FlameMaterial
);

flame2.scale.y = 1.6;

flame2.position.x = 0.62;
flame2.position.y = 0.66;
flame2.position.z = 2.82;

scene.add(flame2);


const flame3 = new THREE.Mesh(
    FlameGeometry,
    FlameMaterial
);

flame3.scale.y = 1.6;

flame3.position.x = 0.82;
flame3.position.y = 0.71;
flame3.position.z = 2.82;

scene.add(flame3);


const candleLight = new THREE.PointLight(
    0xffb060,
    0,
    4,
    2
);

candleLight.position.x = 0.72;
candleLight.position.y = 0.85;
candleLight.position.z = 2.7;

scene.add(candleLight);


// TV Glow

const tvLight = new THREE.PointLight(
    0x6fa8ff,
    0,
    5,
    2
);

tvLight.position.x = -0.2;
tvLight.position.y = 1.25;
tvLight.position.z = 2.3;

scene.add(tvLight);


// Nightstands

const NightstandBodyMaterial = new THREE.MeshLambertMaterial({
    map: textures.woody
});

const NightstandTopMaterial = new THREE.MeshLambertMaterial({
    color: 0x9c7a54
});

const NightstandDrawerMaterial = new THREE.MeshLambertMaterial({
    color: 0x7a5233
});

const NightstandKnobMaterial = new THREE.MeshLambertMaterial({
    color: 0xd4af37
});


const NightstandBodyGeometry = new THREE.RoundedBoxGeometry(
    0.5,
    0.62,
    0.45,
    4,
    0.02
);

const NightstandTopGeometry = new THREE.RoundedBoxGeometry(
    0.54,
    0.04,
    0.49,
    4,
    0.015
);

const NightstandDrawerGeometry = new THREE.RoundedBoxGeometry(
    0.42,
    0.25,
    0.02,
    4,
    0.008
);

const NightstandKnobGeometry = new THREE.SphereGeometry(
    0.02,
    12,
    12
);


function makeNightstand(x, z) {

    const body = new THREE.Mesh(
        NightstandBodyGeometry,
        NightstandBodyMaterial
    );

    body.position.x = x;
    body.position.y = 0.31;
    body.position.z = z;

    scene.add(body);


    const top = new THREE.Mesh(
        NightstandTopGeometry,
        NightstandTopMaterial
    );

    top.position.x = x;
    top.position.y = 0.64;
    top.position.z = z;

    scene.add(top);


    for (const y of [0.46, 0.19]) {

        const drawer = new THREE.Mesh(
            NightstandDrawerGeometry,
            NightstandDrawerMaterial
        );

        drawer.position.x = x;
        drawer.position.y = y;
        drawer.position.z = z + 0.235;

        scene.add(drawer);


        const knob = new THREE.Mesh(
            NightstandKnobGeometry,
            NightstandKnobMaterial
        );

        knob.position.x = x;
        knob.position.y = y;
        knob.position.z = z + 0.255;

        scene.add(knob);
    }
}


makeNightstand(-1.81, -2.755);

makeNightstand(1.41, -2.755);


// Bookshelf

const shelfW = 1.5;
const shelfH = 1.9;
const shelfD = 0.32;
const shelfT = 0.03;

const shelfX = -3.65;
const shelfZ = -2.20;

const BookshelfMaterial = new THREE.MeshLambertMaterial({
    color: 0x8a6240
});

const BookshelfBackMaterial = new THREE.MeshLambertMaterial({
    color: 0x5a3a22
});


const shelfSideGeometry = new THREE.BoxGeometry(
    shelfD,
    shelfH,
    shelfT
);

const shelfSide1 = new THREE.Mesh(
    shelfSideGeometry,
    BookshelfMaterial
);

shelfSide1.position.x = shelfX;
shelfSide1.position.y = shelfH / 2;
shelfSide1.position.z =
    shelfZ - shelfW / 2 + shelfT / 2;

scene.add(shelfSide1);


const shelfSide2 = new THREE.Mesh(
    shelfSideGeometry,
    BookshelfMaterial
);

shelfSide2.position.x = shelfX;
shelfSide2.position.y = shelfH / 2;
shelfSide2.position.z =
    shelfZ + shelfW / 2 - shelfT / 2;

scene.add(shelfSide2);


const shelfTop = new THREE.Mesh(
    new THREE.BoxGeometry(
        shelfD,
        shelfT,
        shelfW
    ),
    BookshelfMaterial
);

shelfTop.position.x = shelfX;
shelfTop.position.y = shelfH - shelfT / 2;
shelfTop.position.z = shelfZ;

scene.add(shelfTop);


const shelfBack = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.015,
        shelfH,
        shelfW
    ),
    BookshelfBackMaterial
);

shelfBack.position.x =
    shelfX - shelfD / 2 + 0.0075;

shelfBack.position.y = shelfH / 2;
shelfBack.position.z = shelfZ;

scene.add(shelfBack);


const shelfGeometry = new THREE.BoxGeometry(
    shelfD - 0.015,
    shelfT,
    shelfW - 2 * shelfT
);


const shelf1 = new THREE.Mesh(
    shelfGeometry,
    BookshelfMaterial
);

shelf1.position.x = shelfX + 0.0075;
shelf1.position.y = 0.06;
shelf1.position.z = shelfZ;

scene.add(shelf1);


const shelf2 = new THREE.Mesh(
    shelfGeometry,
    BookshelfMaterial
);

shelf2.position.x = shelfX + 0.0075;
shelf2.position.y = 0.52;
shelf2.position.z = shelfZ;

scene.add(shelf2);


const shelf3 = new THREE.Mesh(
    shelfGeometry,
    BookshelfMaterial
);

shelf3.position.x = shelfX + 0.0075;
shelf3.position.y = 0.98;
shelf3.position.z = shelfZ;

scene.add(shelf3);


const shelf4 = new THREE.Mesh(
    shelfGeometry,
    BookshelfMaterial
);

shelf4.position.x = shelfX + 0.0075;
shelf4.position.y = 1.44;
shelf4.position.z = shelfZ;

scene.add(shelf4);


// Book Materials

const BookMaterial1 = new THREE.MeshLambertMaterial({
    color: 0x26344a
});

const BookMaterial2 = new THREE.MeshLambertMaterial({
    color: 0x3f4a32
});

const BookMaterial3 = new THREE.MeshLambertMaterial({
    color: 0x4a3528
});

const BookMaterial4 = new THREE.MeshLambertMaterial({
    color: 0x343638
});

const BookMaterial5 = new THREE.MeshLambertMaterial({
    color: 0x5a4635
});

const BookMaterial6 = new THREE.MeshLambertMaterial({
    color: 0x64748b
});

const BookMaterial7 = new THREE.MeshLambertMaterial({
    color: 0x687052
});

const BookMaterial8 = new THREE.MeshLambertMaterial({
    color: 0x8a7358
});

const BookMaterial9 = new THREE.MeshLambertMaterial({
    color: 0xa09278
});

const BookMaterial10 = new THREE.MeshLambertMaterial({
    color: 0x52647a
});


const BookGeometry = new THREE.BoxGeometry(
    0.07,
    0.30,
    0.16
);


// Shelf 1

const book1 = new THREE.Mesh(
    BookGeometry,
    BookMaterial1
);

book1.position.x = shelfX + 0.13;
book1.position.y = 0.25;
book1.position.z = shelfZ - 0.45;

scene.add(book1);


const book2 = new THREE.Mesh(
    BookGeometry,
    BookMaterial7
);

book2.position.x = shelfX + 0.13;
book2.position.y = 0.25;
book2.position.z = shelfZ - 0.27;

scene.add(book2);


const book3 = new THREE.Mesh(
    BookGeometry,
    BookMaterial3
);

book3.position.x = shelfX + 0.13;
book3.position.y = 0.25;
book3.position.z = shelfZ - 0.09;

scene.add(book3);


const book4 = new THREE.Mesh(
    BookGeometry,
    BookMaterial9
);

book4.position.x = shelfX + 0.13;
book4.position.y = 0.25;
book4.position.z = shelfZ + 0.09;

scene.add(book4);


const book5 = new THREE.Mesh(
    BookGeometry,
    BookMaterial6
);

book5.position.x = shelfX + 0.13;
book5.position.y = 0.25;
book5.position.z = shelfZ + 0.27;

scene.add(book5);


// Shelf 2

const book6 = new THREE.Mesh(
    BookGeometry,
    BookMaterial8
);

book6.position.x = shelfX + 0.13;
book6.position.y = 0.71;
book6.position.z = shelfZ - 0.45;

scene.add(book6);


const book7 = new THREE.Mesh(
    BookGeometry,
    BookMaterial4
);

book7.position.x = shelfX + 0.13;
book7.position.y = 0.71;
book7.position.z = shelfZ - 0.27;

scene.add(book7);


const book8 = new THREE.Mesh(
    BookGeometry,
    BookMaterial2
);

book8.position.x = shelfX + 0.13;
book8.position.y = 0.71;
book8.position.z = shelfZ - 0.09;

scene.add(book8);


const book9 = new THREE.Mesh(
    BookGeometry,
    BookMaterial10
);

book9.position.x = shelfX + 0.13;
book9.position.y = 0.71;
book9.position.z = shelfZ + 0.09;

scene.add(book9);


const book10 = new THREE.Mesh(
    BookGeometry,
    BookMaterial5
);

book10.position.x = shelfX + 0.13;
book10.position.y = 0.71;
book10.position.z = shelfZ + 0.27;

scene.add(book10);


// Shelf 3

const book11 = new THREE.Mesh(
    BookGeometry,
    BookMaterial7
);

book11.position.x = shelfX + 0.13;
book11.position.y = 1.17;
book11.position.z = shelfZ - 0.45;

scene.add(book11);


const book12 = new THREE.Mesh(
    BookGeometry,
    BookMaterial1
);

book12.position.x = shelfX + 0.13;
book12.position.y = 1.17;
book12.position.z = shelfZ - 0.27;

scene.add(book12);


const book13 = new THREE.Mesh(
    BookGeometry,
    BookMaterial9
);

book13.position.x = shelfX + 0.13;
book13.position.y = 1.17;
book13.position.z = shelfZ - 0.09;

scene.add(book13);


const book14 = new THREE.Mesh(
    BookGeometry,
    BookMaterial3
);

book14.position.x = shelfX + 0.13;
book14.position.y = 1.17;
book14.position.z = shelfZ + 0.09;

scene.add(book14);


const book15 = new THREE.Mesh(
    BookGeometry,
    BookMaterial6
);

book15.position.x = shelfX + 0.13;
book15.position.y = 1.17;
book15.position.z = shelfZ + 0.27;

scene.add(book15);


// Shelf 4

const book16 = new THREE.Mesh(
    BookGeometry,
    BookMaterial5
);

book16.position.x = shelfX + 0.13;
book16.position.y = 1.65;
book16.position.z = shelfZ - 0.45;

scene.add(book16);


const book17 = new THREE.Mesh(
    BookGeometry,
    BookMaterial8
);

book17.position.x = shelfX + 0.13;
book17.position.y = 1.65;
book17.position.z = shelfZ - 0.27;

scene.add(book17);


const book18 = new THREE.Mesh(
    BookGeometry,
    BookMaterial4
);

book18.position.x = shelfX + 0.13;
book18.position.y = 1.65;
book18.position.z = shelfZ - 0.09;

scene.add(book18);


const book19 = new THREE.Mesh(
    BookGeometry,
    BookMaterial10
);

book19.position.x = shelfX + 0.13;
book19.position.y = 1.65;
book19.position.z = shelfZ + 0.09;

scene.add(book19);


const book20 = new THREE.Mesh(
    BookGeometry,
    BookMaterial2
);

book20.position.x = shelfX + 0.13;
book20.position.y = 1.65;
book20.position.z = shelfZ + 0.27;

scene.add(book20);


// Reading Chair

const armchair = new THREE.Group();

armchair.position.x = -2.7;
armchair.position.y = 0;
armchair.position.z = -2.55;

armchair.rotation.y = 0;

scene.add(armchair);


// Chair Materials

const chairTextureLoader = new THREE.TextureLoader();

const chairTexture = chairTextureLoader.load(
    "texture/chair.jpg"
);

chairTexture.colorSpace = THREE.SRGBColorSpace;

const ArmchairFabricMaterial = new THREE.MeshLambertMaterial({
    map: chairTexture
});

const ArmchairCushionMaterial = new THREE.MeshLambertMaterial({
    map: chairTexture
});

const ArmchairLegMaterial = new THREE.MeshLambertMaterial({
    color: 0x654321
});


// Chair Base

const ArmchairBaseGeometry = new THREE.RoundedBoxGeometry(
    0.75,
    0.16,
    0.8,
    4,
    0.04
);

const armchairBase = new THREE.Mesh(
    ArmchairBaseGeometry,
    ArmchairFabricMaterial
);

armchairBase.position.x = 0;
armchairBase.position.y = 0.2;
armchairBase.position.z = 0;

armchair.add(armchairBase);


// Chair Arms

const ArmchairArmGeometry = new THREE.RoundedBoxGeometry(
    0.12,
    0.26,
    0.8,
    4,
    0.04
);

const armchairArm1 = new THREE.Mesh(
    ArmchairArmGeometry,
    ArmchairFabricMaterial
);

armchairArm1.position.x = -0.315;
armchairArm1.position.y = 0.41;
armchairArm1.position.z = 0;

armchair.add(armchairArm1);


const armchairArm2 = new THREE.Mesh(
    ArmchairArmGeometry,
    ArmchairFabricMaterial
);

armchairArm2.position.x = 0.315;
armchairArm2.position.y = 0.41;
armchairArm2.position.z = 0;

armchair.add(armchairArm2);


// Chair Seat

const ArmchairSeatGeometry = new THREE.RoundedBoxGeometry(
    0.5,
    0.12,
    0.6,
    4,
    0.05
);

const armchairSeat = new THREE.Mesh(
    ArmchairSeatGeometry,
    ArmchairCushionMaterial
);

armchairSeat.position.x = 0;
armchairSeat.position.y = 0.34;
armchairSeat.position.z = 0.08;

armchair.add(armchairSeat);


// Chair Back

const ArmchairBackGeometry = new THREE.RoundedBoxGeometry(
    0.75,
    0.62,
    0.14,
    4,
    0.05
);

const armchairBack = new THREE.Mesh(
    ArmchairBackGeometry,
    ArmchairFabricMaterial
);

armchairBack.position.x = 0;
armchairBack.position.y = 0.59;
armchairBack.position.z = -0.33;

armchairBack.rotation.x = -0.1;

armchair.add(armchairBack);


// Chair Legs

const ArmchairLegGeometry = new THREE.CylinderGeometry(
    0.02,
    0.028,
    0.12,
    12
);


const leg1 = new THREE.Mesh(
    ArmchairLegGeometry,
    ArmchairLegMaterial
);

leg1.position.x = -0.3;
leg1.position.y = 0.06;
leg1.position.z = -0.32;

armchair.add(leg1);


const leg2 = new THREE.Mesh(
    ArmchairLegGeometry,
    ArmchairLegMaterial
);

leg2.position.x = 0.3;
leg2.position.y = 0.06;
leg2.position.z = -0.32;

armchair.add(leg2);


const leg3 = new THREE.Mesh(
    ArmchairLegGeometry,
    ArmchairLegMaterial
);

leg3.position.x = -0.3;
leg3.position.y = 0.06;
leg3.position.z = 0.32;

armchair.add(leg3);


const leg4 = new THREE.Mesh(
    ArmchairLegGeometry,
    ArmchairLegMaterial
);

leg4.position.x = 0.3;
leg4.position.y = 0.06;
leg4.position.z = 0.32;

armchair.add(leg4);


// Pretty Plant by Door

const plantX = -3.65;
const plantZ = 1;


// Pot

const PlantPotMaterial = new THREE.MeshLambertMaterial({
    color: 0x40352d
});

const PlantPotGeometry = new THREE.CylinderGeometry(
    0.24,
    0.18,
    0.38,
    24
);

const plantPot = new THREE.Mesh(
    PlantPotGeometry,
    PlantPotMaterial
);

plantPot.position.x = plantX;
plantPot.position.y = 0.19;
plantPot.position.z = plantZ;

scene.add(plantPot);


// Pot Rim

const PlantRimGeometry = new THREE.CylinderGeometry(
    0.255,
    0.255,
    0.06,
    24
);

const plantRim = new THREE.Mesh(
    PlantRimGeometry,
    PlantPotMaterial
);

plantRim.position.x = plantX;
plantRim.position.y = 0.38;
plantRim.position.z = plantZ;

scene.add(plantRim);


// Soil

const PlantSoilMaterial = new THREE.MeshLambertMaterial({
    color: 0x211a14
});

const PlantSoilGeometry = new THREE.CylinderGeometry(
    0.21,
    0.21,
    0.025,
    24
);

const plantSoil = new THREE.Mesh(
    PlantSoilGeometry,
    PlantSoilMaterial
);

plantSoil.position.x = plantX;
plantSoil.position.y = 0.415;
plantSoil.position.z = plantZ;

scene.add(plantSoil);


// Leaves

const PlantLeafMaterial = new THREE.MeshLambertMaterial({
    color: 0x354d35
});

const PlantLeafMaterial2 = new THREE.MeshLambertMaterial({
    color: 0x536b45
});

const PlantLeafGeometry = new THREE.SphereGeometry(
    0.16,
    16,
    12
);


// Leaf 1

const plantLeaf1 = new THREE.Mesh(
    PlantLeafGeometry,
    PlantLeafMaterial
);

plantLeaf1.scale.x = 0.45;
plantLeaf1.scale.y = 2.5;
plantLeaf1.scale.z = 0.28;

plantLeaf1.position.x = plantX - 0.12;
plantLeaf1.position.y = 0.82;
plantLeaf1.position.z = plantZ;

plantLeaf1.rotation.z = -0.45;
plantLeaf1.rotation.y = Math.PI;

scene.add(plantLeaf1);


// Leaf 2

const plantLeaf2 = new THREE.Mesh(
    PlantLeafGeometry,
    PlantLeafMaterial2
);

plantLeaf2.scale.x = 0.45;
plantLeaf2.scale.y = 2.7;
plantLeaf2.scale.z = 0.28;

plantLeaf2.position.x = plantX + 0.12;
plantLeaf2.position.y = 0.86;
plantLeaf2.position.z = plantZ;

plantLeaf2.rotation.z = 0.45;
plantLeaf2.rotation.y = Math.PI;

scene.add(plantLeaf2);


// Leaf 3

const plantLeaf3 = new THREE.Mesh(
    PlantLeafGeometry,
    PlantLeafMaterial
);

plantLeaf3.scale.x = 0.42;
plantLeaf3.scale.y = 2.8;
plantLeaf3.scale.z = 0.27;

plantLeaf3.position.x = plantX;
plantLeaf3.position.y = 0.95;
plantLeaf3.position.z = plantZ;

plantLeaf3.rotation.y = Math.PI;

scene.add(plantLeaf3);


// Leaf 4

const plantLeaf4 = new THREE.Mesh(
    PlantLeafGeometry,
    PlantLeafMaterial2
);

plantLeaf4.scale.x = 0.42;
plantLeaf4.scale.y = 2.3;
plantLeaf4.scale.z = 0.26;

plantLeaf4.position.x = plantX - 0.18;
plantLeaf4.position.y = 0.92;
plantLeaf4.position.z = plantZ + 0.04;

plantLeaf4.rotation.z = -0.75;
plantLeaf4.rotation.y = Math.PI;

scene.add(plantLeaf4);


// Leaf 5

const plantLeaf5 = new THREE.Mesh(
    PlantLeafGeometry,
    PlantLeafMaterial
);

plantLeaf5.scale.x = 0.42;
plantLeaf5.scale.y = 2.4;
plantLeaf5.scale.z = 0.26;

plantLeaf5.position.x = plantX + 0.18;
plantLeaf5.position.y = 0.94;
plantLeaf5.position.z = plantZ + 0.04;

plantLeaf5.rotation.z = 0.75;
plantLeaf5.rotation.y = Math.PI;

scene.add(plantLeaf5);


// Leaf 6

const plantLeaf6 = new THREE.Mesh(
    PlantLeafGeometry,
    PlantLeafMaterial2
);

plantLeaf6.scale.x = 0.38;
plantLeaf6.scale.y = 2.5;
plantLeaf6.scale.z = 0.25;

plantLeaf6.position.x = plantX - 0.08;
plantLeaf6.position.y = 1.05;
plantLeaf6.position.z = plantZ + 0.05;

plantLeaf6.rotation.z = -0.25;
plantLeaf6.rotation.y = Math.PI;

scene.add(plantLeaf6);


// Leaf 7

const plantLeaf7 = new THREE.Mesh(
    PlantLeafGeometry,
    PlantLeafMaterial
);

plantLeaf7.scale.x = 0.38;
plantLeaf7.scale.y = 2.5;
plantLeaf7.scale.z = 0.25;

plantLeaf7.position.x = plantX + 0.08;
plantLeaf7.position.y = 1.08;
plantLeaf7.position.z = plantZ + 0.05;

plantLeaf7.rotation.z = 0.25;
plantLeaf7.rotation.y = Math.PI;

scene.add(plantLeaf7);


// Reading Lamp

const readingLampX = -2.25;
const readingLampZ = -2.55;


const ReadingLampMetalMaterial = new THREE.MeshLambertMaterial({
    color: 0x2e2e33
});

const ReadingLampShadeMaterial = new THREE.MeshLambertMaterial({
    color: 0xf6e3b4,
    emissive: 0xffc870,
    emissiveIntensity: 0
});


// Reading Lamp Base

const readingLampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(
        0.14,
        0.16,
        0.03,
        24
    ),
    ReadingLampMetalMaterial
);

readingLampBase.position.x = readingLampX;
readingLampBase.position.y = 0.015;
readingLampBase.position.z = readingLampZ;

scene.add(readingLampBase);


// Reading Lamp Pole

const readingLampPole = new THREE.Mesh(
    new THREE.CylinderGeometry(
        0.015,
        0.015,
        1.3,
        10
    ),
    ReadingLampMetalMaterial
);

readingLampPole.position.x = readingLampX;
readingLampPole.position.y = 0.68;
readingLampPole.position.z = readingLampZ;

scene.add(readingLampPole);


// Reading Lamp Shade

const readingLampShade = new THREE.Mesh(
    new THREE.CylinderGeometry(
        0.12,
        0.19,
        0.26,
        24
    ),
    ReadingLampShadeMaterial
);

readingLampShade.position.x = readingLampX;
readingLampShade.position.y = 1.46;
readingLampShade.position.z = readingLampZ;

scene.add(readingLampShade);


// Reading Lamp Light

const readingLight = new THREE.PointLight(
    0xffd9a0,
    0,
    6,
    2
);

readingLight.position.x = readingLampX;
readingLight.position.y = 1.4;
readingLight.position.z = readingLampZ;

scene.add(readingLight);


// Shadows

const noShadow = [
    ceiling,
    frontWall,
    glass,
    pendantBulb,
    flame1,
    flame2,
    flame3
];


scene.traverse(function(obj) {

    if (obj.isMesh && !noShadow.includes(obj)) {

        obj.castShadow = true;
        obj.receiveShadow = true;

    }

});


// Day / Night

let isNight = false;


function setNight(on) {

    isNight = on;


    if (on) {

        ambient.intensity = 0.1 * Math.PI;

        sun.intensity = 0;

        pendantLight.intensity = 9;

        lampLight.intensity = 1.6;

        readingLight.intensity = 1.6;

        candleLight.intensity = 0.6;

        tvLight.intensity = 0.6;


        LampShadeMaterial.emissiveIntensity = 0.9;

        ReadingLampShadeMaterial.emissiveIntensity = 0.9;


        TVScreenMaterial.emissive.set(0x2a4f80);

        PendantBulbMaterial.color.set(0xfff2cf);

        scene.background.set(0x080b14);

    } else {

        ambient.intensity = 0.55 * Math.PI;

        sun.intensity = 0.9 * Math.PI;

        pendantLight.intensity = 0;

        lampLight.intensity = 0;

        readingLight.intensity = 0;

        candleLight.intensity = 0;

        tvLight.intensity = 0;

        LampShadeMaterial.emissiveIntensity = 0;
        ReadingLampShadeMaterial.emissiveIntensity = 0;

        TVScreenMaterial.emissive.set(0x000000);
        PendantBulbMaterial.color.set(0xb5b0a2);
        scene.background.set(0x1b1f2a);

    }


    flame1.visible = on;
    flame2.visible = on;
    flame3.visible = on;
}


setNight(false);


// Night Toggle

window.addEventListener("keydown", function(e) {

    if (e.key === "n" || e.key === "N") {
        setNight(!isNight);

    }

});


// Resize

window.addEventListener("resize", function() {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});


// Animation

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();