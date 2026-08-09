// ─── MainScene.js — Unified Scroll-Based Environment ───────────────
import * as THREE from 'three';
import { PROJECTS, SECTIONS, EXPERIENCE, EDUCATION } from './data.js';

export class MainScene {
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#060a09');
        // Dense fog makes the distance fade smoothly as we scroll
        this.scene.fog = new THREE.Fog('#060a09', 4, 30);
        
        this.clickables = [];
        this.projectMeshes = [];
        this.elapsed = 0;

        this._initLighting();
        this._initStructure();
        this._initRobot();
        this._initJourneyWindows();
        this._initDoor();
        this._initMaglevRoom();
        this._initParticles();
    }

    _initLighting() {
        // Overhead warm fluorescent lights for Hallway (Z=0 to -22)
        for (let i = 0; i < 6; i++) {
            const z = 2 - i * 4;
            const light = new THREE.PointLight('#ffe8c0', 3, 10, 1.5);
            light.position.set(0, 4.5, z);
            this.scene.add(light);
            
            // Light strip fixture mesh
            const stripGeo = new THREE.PlaneGeometry(0.7, 0.08);
            const stripMat = new THREE.MeshBasicMaterial({ color: '#ffe8c0', transparent: true, opacity: 0.8 });
            const strip = new THREE.Mesh(stripGeo, stripMat);
            strip.rotation.x = Math.PI / 2;
            strip.position.set(0, 4.92, z);
            this.scene.add(strip);
        }
        
        const ambient = new THREE.AmbientLight('#0a1815', 1.2);
        this.scene.add(ambient);
        
        // Spotlight on robot (Z=0)
        const robotSpot = new THREE.SpotLight('#ffe0b0', 15, 12, Math.PI / 6, 0.5, 1.5);
        robotSpot.position.set(1, 6, 2);
        robotSpot.target.position.set(0, 1, 0);
        this.scene.add(robotSpot);
        this.scene.add(robotSpot.target);
    }

    _initStructure() {
        // We make one extremely long corridor extending deep into -Z
        const length = 150; 
        const zCenter = -65; // from +10 down to -140
        
        const wallMat = new THREE.MeshStandardMaterial({ color: '#1a2420', roughness: 0.85, metalness: 0.05 });
        const floorMat = new THREE.MeshStandardMaterial({ color: '#141c18', roughness: 0.8, metalness: 0.1 });
        const ceilMat = new THREE.MeshStandardMaterial({ color: '#0f1a16', roughness: 0.9, metalness: 0 });

        const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, length), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, 0, zCenter);
        this.scene.add(floor);

        const tileGrid = new THREE.GridHelper(length, length * 2, '#1a2820', '#162018');
        tileGrid.position.set(0, 0.01, zCenter);
        this.scene.add(tileGrid);

        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(10, length), ceilMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(0, 5, zCenter);
        this.scene.add(ceiling);

        // Walls
        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(length, 5), wallMat);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.set(-5, 2.5, zCenter);
        this.scene.add(leftWall);

        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(length, 5), wallMat);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.set(5, 2.5, zCenter);
        this.scene.add(rightWall);
    }

    _initRobot() {
        this.robotGroup = new THREE.Group();
        const metalMat = new THREE.MeshStandardMaterial({ color: '#505a58', metalness: 0.8, roughness: 0.25 });
        const darkMat = new THREE.MeshStandardMaterial({ color: '#2a2e2c', metalness: 0.7, roughness: 0.3 });
        const accentMat = new THREE.MeshStandardMaterial({ color: '#ff3e1d', emissive: '#ff3e1d', emissiveIntensity: 0.6, metalness: 0.5, roughness: 0.3 });

        // Torso
        this.torso = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 1.2, 12), metalMat);
        this.torso.position.y = 1.6;
        this.robotGroup.add(this.torso);

        // Chest plate
        const chest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.25), darkMat);
        chest.position.set(0, 1.8, 0.22);
        this.robotGroup.add(chest);

        // Head Group
        this.headGroup = new THREE.Group();
        this.headGroup.position.y = 2.6;
        const headBox = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.4), metalMat);
        this.headGroup.add(headBox);
        
        const visor = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.22, 0.05),
            new THREE.MeshStandardMaterial({ color: '#0a0a0a', metalness: 0.9, roughness: 0.1 })
        );
        visor.position.set(0, 0.02, 0.22);
        this.headGroup.add(visor);

        const eyeMat = new THREE.MeshStandardMaterial({ color: '#ff3e1d', emissive: '#ff3e1d', emissiveIntensity: 1.2 });
        this.leftEye = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), eyeMat);
        this.leftEye.position.set(-0.1, 0.03, 0.25);
        this.headGroup.add(this.leftEye);
        this.rightEye = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), eyeMat);
        this.rightEye.position.set(0.1, 0.03, 0.25);
        this.headGroup.add(this.rightEye);

        this.antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8), accentMat);
        this.antennaTip.position.set(0.15, 0.48, 0);
        const antennaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.25, 6), darkMat);
        antennaBase.position.set(0.15, 0.35, 0);
        this.headGroup.add(this.antennaTip, antennaBase);

        this.robotGroup.add(this.headGroup);

        // Arms & Base
        this.leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.5, 8), metalMat);
        this.leftArm.position.set(-0.55, 1.9, 0);
        this.leftArm.rotation.z = 0.15;
        this.rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.5, 8), metalMat);
        this.rightArm.position.set(0.55, 1.9, 0);
        this.rightArm.rotation.z = -0.15;
        this.robotGroup.add(this.leftArm, this.rightArm);

        const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.3, 10), darkMat);
        waist.position.y = 0.9;
        this.robotGroup.add(waist);
        
        const legs = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 0.25), metalMat);
        legs.position.y = 0.45;
        this.robotGroup.add(legs);

        this.robotGroup.position.set(0, 0, 0);
        this.scene.add(this.robotGroup);
    }

    _initJourneyWindows() {
        // Experience and Education combined and sorted latest first
        const timeline = [
            { type: 'edu', ...EDUCATION[0] }, // NYU (2026)
            { type: 'exp', ...EXPERIENCE[0] }, // Course Assistant (Sep 2025)
            { type: 'exp', ...EXPERIENCE[1] }, // Graduate Researcher (Jan 2025)
            { type: 'edu', ...EDUCATION[1] }, // SRM (2024)
            { type: 'exp', ...EXPERIENCE[2] }, // Intern (2023)
        ];

        const windowMat = new THREE.MeshStandardMaterial({
            color: '#a0ffd0', emissive: '#30ff80', emissiveIntensity: 0.35,
            transparent: true, opacity: 0.35, roughness: 0.9, side: THREE.DoubleSide
        });

        timeline.forEach((item, i) => {
            const z = -4 - (i * 3.5);
            // Alternate left and right walls
            const isLeft = i % 2 === 0;
            const sign = isLeft ? -1 : 1;

            const group = new THREE.Group();
            // Data for the modal when clicked
            group.userData = { type: 'journey', data: item };

            // Pane
            const paneGeo = new THREE.PlaneGeometry(2.2, 1.8);
            const pane = new THREE.Mesh(paneGeo, windowMat);
            pane.rotation.y = sign * (Math.PI / 2);
            // Slightly offset from the wall (wall is at +/- 5)
            pane.position.set(sign * 4.95, 2.5, 0);
            
            // Re-map userData onto pane for raycaster
            pane.userData = { type: 'journey', data: item, label: (item.school || item.org) };
            group.add(pane);

            // Light spill
            const light = new THREE.PointLight('#40ffa0', 1.5, 6);
            light.position.set(sign * 4.5, 2.5, 0);
            group.add(light);

            group.position.set(0, 0, z);
            this.scene.add(group);
            this.clickables.push(pane); // Add to interactive list
        });
    }

    _initDoor() {
        this.doorWrapper = new THREE.Group();
        this.doorWrapper.position.set(0, 0, -22);

        // Frame
        const frameMat = new THREE.MeshStandardMaterial({ color: '#2a3a30', metalness: 0.7, roughness: 0.3 });
        const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.5, 0.15), frameMat);
        frameL.position.set(-1.6, 1.75, 0);
        const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.5, 0.15), frameMat);
        frameR.position.set(1.6, 1.75, 0);
        const frameT = new THREE.Mesh(new THREE.BoxGeometry(3.32, 0.12, 0.15), frameMat);
        frameT.position.set(0, 3.5, 0);
        this.doorWrapper.add(frameL, frameR, frameT);

        // Left Door Panel
        this.doorLeftHinge = new THREE.Group();
        this.doorLeftHinge.position.set(-1.54, 0, 0);
        const doorMat = new THREE.MeshStandardMaterial({ color: '#1a2a22', metalness: 0.4, roughness: 0.5 });
        const doorHalfGeo = new THREE.BoxGeometry(1.54, 3.4, 0.08);
        const panelL = new THREE.Mesh(doorHalfGeo, doorMat);
        panelL.position.set(0.77, 1.75, 0);
        this.doorLeftHinge.add(panelL);
        this.doorWrapper.add(this.doorLeftHinge);

        // Right Door Panel
        this.doorRightHinge = new THREE.Group();
        this.doorRightHinge.position.set(1.54, 0, 0);
        const panelR = new THREE.Mesh(doorHalfGeo, doorMat);
        panelR.position.set(-0.77, 1.75, 0);
        this.doorRightHinge.add(panelR);
        this.doorWrapper.add(this.doorRightHinge);

        // "PROJECTS" label on wall above door
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 512;
        labelCanvas.height = 128;
        const ctx = labelCanvas.getContext('2d');
        ctx.fillStyle = '#ff3e1d';
        ctx.font = 'bold 72px Bebas Neue, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PROJECTS', 256, 90);
        const labelTex = new THREE.CanvasTexture(labelCanvas);
        const labelPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(2.0, 0.5),
            new THREE.MeshBasicMaterial({ map: labelTex, transparent: true })
        );
        labelPlane.position.set(0, 4.0, 0.06);
        this.doorWrapper.add(labelPlane);

        this.scene.add(this.doorWrapper);
    }

    _initMaglevRoom() {
        const startZ = -28;
        const zSpacing = 4.0;
        
        // Expose maxProjectZ for camera limit
        this.maxProjectZ = startZ - ((PROJECTS.length + 2) * zSpacing);

        PROJECTS.forEach((proj, i) => {
            const z = startZ - i * zSpacing;
            const isLeft = i % 2 === 0;
            const x = isLeft ? -2.2 : 2.2;
            
            // Look up theme color from its first section
            const secId = proj.sections[0];
            const section = SECTIONS.find(s => s.id === secId);
            const color = section ? section.theme.accent : '#ffffff';

            const group = new THREE.Group();
            group.position.set(x, 0, z);

            // Maglev pedestal base
            const pedGeo = new THREE.CylinderGeometry(0.6, 0.8, 0.4, 16);
            const pedMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.8, roughness: 0.3 });
            const pedestal = new THREE.Mesh(pedGeo, pedMat);
            pedestal.position.y = 0.2;
            group.add(pedestal);

            // Emissive glowing ring atop the pedestal
            const ringGeo = new THREE.TorusGeometry(0.65, 0.02, 8, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: color });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.y = 0.45;
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
            
            // Ambient glow for the project stand
            const light = new THREE.PointLight(color, 1.5, 4);
            light.position.y = 1.0;
            group.add(light);

            // Floating object / card wrapper
            const floatGroup = new THREE.Group();
            floatGroup.position.set(0, 1.4, 0);

            // A sleek tech-cube
            const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            const cubeMat = new THREE.MeshStandardMaterial({ 
                color: '#222', metalness: 0.6, roughness: 0.2,
                emissive: color, emissiveIntensity: 0.25
            });
            const floatObj = new THREE.Mesh(cubeGeo, cubeMat);
            
            // Link data to the mesh so the raycaster catches it
            floatObj.userData = { type: 'project', data: proj, label: proj.title };
            this.clickables.push(floatObj);
            floatGroup.add(floatObj);
            
            // Project Title text floating above the cube
            const c = document.createElement('canvas');
            c.width = 512; c.height = 128;
            const ctx = c.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 28px Inter';
            ctx.textAlign = 'center';
            // Wrap text if needed, but for simplicity we draw 1 line
            ctx.fillText(proj.title.substring(0, 35) + (proj.title.length > 35 ? '...' : ''), 256, 80);
            const tex = new THREE.CanvasTexture(c);
            const txtPlane = new THREE.Mesh(
                new THREE.PlaneGeometry(1.6, 0.4),
                new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
            );
            txtPlane.position.y = 0.8;
            floatGroup.add(txtPlane);

            group.add(floatGroup);
            this.scene.add(group);

            proj.sceneGroup = group;
            proj.floatGroup = floatGroup;
            this.projectMeshes.push(proj);
        });
    }

    _initParticles() {
        const dustCount = 800;
        const dustGeo = new THREE.BufferGeometry();
        const dustPos = new Float32Array(dustCount * 3);
        for (let i = 0; i < dustCount; i++) {
            dustPos[i * 3] = (Math.random() - 0.5) * 10;
            dustPos[i * 3 + 1] = Math.random() * 5;
            dustPos[i * 3 + 2] = 5 - Math.random() * 150; // scatter across entire -Z
        }
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        const dustMat = new THREE.PointsMaterial({ color: '#c0d0b0', size: 0.02, transparent: true, opacity: 0.3 });
        this.dust = new THREE.Points(dustGeo, dustMat);
        this.scene.add(this.dust);
    }

    /** 
     * Filter active projects by hiding ones that don't match domain or text query.
     */
    filterProjects(domain, query = '') {
        let activeIndex = 0;
        const startZ = -28;
        const zSpacing = 4.0;

        this.projectMeshes.forEach(proj => {
            const matchDomain = domain === 'all' || proj.sections.includes(domain);
            
            const projectText = (proj.title + ' ' + (proj.tags || []).join(' ') + ' ' + (proj.bullets || []).join(' ')).toLowerCase();
            const matchQuery = query === '' || projectText.includes(query);

            const isActive = matchDomain && matchQuery;
            
            if (isActive) {
                proj.sceneGroup.visible = true;
                // Transition target positions
                const z = startZ - activeIndex * zSpacing;
                const isLeft = activeIndex % 2 === 0;
                const x = isLeft ? -2.2 : 2.2;
                
                // Set explicitly for now. A tween engine could smooth this.
                proj.sceneGroup.position.set(x, 0, z);
                
                activeIndex++;
            } else {
                proj.sceneGroup.visible = false;
            }
        });
        
        // Update the scroll limit based on active projects
        this.maxProjectZ = startZ - ((activeIndex + 2) * zSpacing);
    }

    update(delta, currentScrollZ, mouse) {
        this.elapsed += delta;
        
        // Robot animation (only process if near origin)
        if (currentScrollZ > -15) {
            this.headGroup.rotation.y = mouse.lerpX * 0.6;
            this.headGroup.rotation.x = -mouse.lerpY * 0.3;
            const eyePulse = 0.8 + Math.sin(this.elapsed * 3) * 0.4;
            this.leftEye.material.emissiveIntensity = eyePulse;
            this.rightEye.material.emissiveIntensity = eyePulse;
            this.antennaTip.material.emissiveIntensity = 0.4 + Math.sin(this.elapsed * 5) * 0.4;
            this.robotGroup.position.y = Math.sin(this.elapsed * 1.2) * 0.02;
            this.torso.rotation.y = mouse.lerpX * 0.08;
        }

        // Door mechanics
        // Starts at Z=-22. We want it to open smoothly as camera goes past Z=-15
        if (currentScrollZ < -15) {
            const progress = Math.min(1, Math.max(0, (-15 - currentScrollZ) / 4));
            // Rotate hinges outward 
            this.doorLeftHinge.rotation.y = progress * (Math.PI / 2.2);
            this.doorRightHinge.rotation.y = -progress * (Math.PI / 2.2);
        } else {
            this.doorLeftHinge.rotation.y = 0;
            this.doorRightHinge.rotation.y = 0;
        }

        // Maglev Project animations
        this.projectMeshes.forEach((proj, i) => {
            if (!proj.sceneGroup.visible) return;
            
            // Only update if relatively close to camera
            if (Math.abs(currentScrollZ - proj.sceneGroup.position.z) < 20) {
                // Float up and down
                proj.floatGroup.position.y = 1.4 + Math.sin(this.elapsed * 2 + i) * 0.1;
                // Spin slowly
                proj.floatGroup.children[0].rotation.y += delta * 0.5; // cube spin
                proj.floatGroup.children[0].rotation.x += delta * 0.2; // cube spin
                // Billboard text plane to camera
                proj.floatGroup.children[1].lookAt(this.camera.position);
            }
        });

        // Dust drift globally
        const dPos = this.dust.geometry.attributes.position.array;
        for (let i = 0; i < 800; i++) {
            dPos[i * 3 + 1] += delta * 0.05;
            if (dPos[i * 3 + 1] > 5) dPos[i * 3 + 1] = 0;
        }
        this.dust.geometry.attributes.position.needsUpdate = true;
    }
}
