// Textures

const textureLoader = new THREE.TextureLoader();

// Wood texture
// Used for bed

const woodTexture = textureLoader.load("texture/wood.jpg");

woodTexture.colorSpace = THREE.SRGBColorSpace;
woodTexture.wrapS = THREE.RepeatWrapping;
woodTexture.wrapT = THREE.RepeatWrapping;
woodTexture.repeat.x = 1;
woodTexture.repeat.y = 1;
woodTexture.anisotropy = 8;

// Woody furniture texture
// Used for furniture other than the bed

const woodyTexture = textureLoader.load("texture/woody.jpg");

woodyTexture.colorSpace = THREE.SRGBColorSpace;
woodyTexture.wrapS = THREE.RepeatWrapping;
woodyTexture.wrapT = THREE.RepeatWrapping;
woodyTexture.repeat.x = 1;
woodyTexture.repeat.y = 1;
woodyTexture.anisotropy = 8;

// Floor texture
// Used only for the floor

const floorTexture = textureLoader.load("texture/floor.jpg");

floorTexture.colorSpace = THREE.SRGBColorSpace;
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.x = 4;
floorTexture.repeat.y = 3;
floorTexture.anisotropy = 8;

// Textures used by main.js

const textures = {
    wood: woodTexture,
    woody: woodyTexture,
    floor: floorTexture
};

// ---------- Walls ----------

const wallTexture = textureLoader.load("texture/brick.jpg");

wallTexture.colorSpace = THREE.SRGBColorSpace;
wallTexture.wrapS = THREE.MirroredRepeatWrapping;
wallTexture.wrapT = THREE.ClampToEdgeWrapping;
wallTexture.repeat.x = 1;
wallTexture.repeat.y = 1;
wallTexture.anisotropy = 8;