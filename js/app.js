// ─── app.js — Entry Point ───────────────────────────────────────
import * as THREE from 'three';
import { MainScene } from './MainScene.js';
import { UI } from './ui.js';

class App {
    constructor() {
        this.canvas = document.getElementById('three-canvas');
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;

        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 2.2, 5);

        this.clock = new THREE.Clock();

        this.mouse = { x: 0, y: 0, lerpX: 0, lerpY: 0, isDown: false };
        this.raycaster = new THREE.Raycaster();
        this.mouseNDC = new THREE.Vector2();

        this.targetScrollZ = 5;
        this.currentScrollZ = 5;
        this.touchStartY = 0;

        this.filterBar = document.getElementById('filter-bar');
        this.homeOverlay = document.getElementById('home-overlay');
        this.labelEl = document.getElementById('object-label');

        this.ui = new UI(this);
        this.mainScene = new MainScene(this.renderer, this.camera);
        
        this.hoveredObj = null;

        this._bindEvents();
        this._animate();
    }

    _bindEvents() {
        window.addEventListener('resize', () => this._onResize());

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            this.mouseNDC.set(this.mouse.x, this.mouse.y);
        });

        window.addEventListener('mousedown', () => { this.mouse.isDown = true; });
        window.addEventListener('mouseup', () => { this.mouse.isDown = false; });

        // Touch Interaction
        window.addEventListener('touchstart', (e) => {
            this.mouse.isDown = true;
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        window.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            this.mouse.x = (t.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(t.clientY / window.innerHeight) * 2 + 1;
            
            if (!this.ui.modal.classList.contains('hidden')) return;

            const deltaY = this.touchStartY - t.clientY;
            this.targetScrollZ -= deltaY * 0.03;
            this.touchStartY = t.clientY;
            this._clampScroll();
        }, { passive: true });
        
        window.addEventListener('touchend', () => { this.mouse.isDown = false; });

        // Scroll
        window.addEventListener('wheel', (e) => {
            if (!this.ui.modal.classList.contains('hidden')) return;

            let delta = e.deltaY * 0.02;
            this.targetScrollZ -= delta;
            this._clampScroll();
        }, { passive: true });

        // Raycast Click
        window.addEventListener('click', (e) => this._onClick(e));
    }

    _clampScroll() {
        const topZ = 5;
        const bottomZ = this.mainScene.maxProjectZ;
        if (this.targetScrollZ > topZ) this.targetScrollZ = topZ;
        if (this.targetScrollZ < bottomZ) this.targetScrollZ = bottomZ;
        if (this.currentScrollZ < bottomZ) this.currentScrollZ = bottomZ;
    }

    _onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }

    _onClick(e) {
        // Ignore clicks if clicking on a UI generic element
        if (e.target.closest('#filter-bar, #detail-modal, footer, a')) return;

        this.mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouseNDC, this.camera);
        const hits = this.raycaster.intersectObjects(this.mainScene.clickables, false);

        for (let i = 0; i < hits.length; i++) {
            let o = hits[i].object;
            // Check visibility by drilling up tree
            let isVis = true;
            let p = o;
            while(p) {
                if(!p.visible) { isVis = false; break; }
                p = p.parent;
            }
            if (isVis && o.userData && o.userData.type) {
                this.ui.openModal(o.userData.type, o.userData.data);
                break;
            }
        }
    }

    _updateHover() {
        // Do not update hover if modal is active
        if (!this.ui.modal.classList.contains('hidden')) {
            if(this.hoveredObj) {
                this.hoveredObj = null;
                this.labelEl.classList.remove('visible');
                this.renderer.domElement.style.cursor = 'default';
            }
            return;
        }

        this.raycaster.setFromCamera(this.mouseNDC, this.camera);
        const hits = this.raycaster.intersectObjects(this.mainScene.clickables, false);

        let hit = null;
        for (let i = 0; i < hits.length; i++) {
            let isVis = true;
            let o = hits[i].object;
            while(o) {
                if(!o.visible) { isVis = false; break; }
                o = o.parent;
            }
            if (isVis) {
                hit = hits[i].object;
                break;
            }
        }

        if (hit && hit.userData.label) {
            if (this.hoveredObj !== hit) {
                this.hoveredObj = hit;
                this.labelEl.textContent = `↵ EXPLORE ${hit.userData.label.toUpperCase()}`;
                this.labelEl.classList.add('visible');
            }
            // Follow cursor
            const rect = this.canvas.getBoundingClientRect();
            let popX = (this.mouse.x + 1) / 2 * rect.width + 15;
            let popY = (-this.mouse.y + 1) / 2 * rect.height - 10;
            
            // simple edge protection
            if(popX + 150 > rect.width) popX = rect.width - 150;
            
            this.labelEl.style.left = popX + 'px';
            this.labelEl.style.top = popY + 'px';
            this.renderer.domElement.style.cursor = 'pointer';
        } else {
            if (this.hoveredObj) {
                this.hoveredObj = null;
                this.labelEl.classList.remove('visible');
                this.renderer.domElement.style.cursor = 'default';
            }
        }
    }

    _animate() {
        requestAnimationFrame(() => this._animate());

        const delta = this.clock.getDelta();

        // Ensure target is clamped
        this._clampScroll();

        // Lerp scroll
        this.currentScrollZ += (this.targetScrollZ - this.currentScrollZ) * 0.08;
        
        // Lerp mouse
        this.mouse.lerpX += (this.mouse.x - this.mouse.lerpX) * 0.08;
        this.mouse.lerpY += (this.mouse.y - this.mouse.lerpY) * 0.08;

        // Overlay visibility based on scroll
        if (this.currentScrollZ < 0) {
            this.homeOverlay.classList.add('faded');
        } else {
            this.homeOverlay.classList.remove('faded');
        }

        if (this.currentScrollZ < -15) {
            this.filterBar.classList.remove('hidden');
        } else {
            this.filterBar.classList.add('hidden');
        }

        // Camera positioning (always pushing forward down -Z)
        // Add a slight lag/sway horizontally with mouse
        this.camera.position.z = this.currentScrollZ;
        this.camera.position.x = this.mouse.lerpX * 0.5;
        this.camera.position.y = 2.2 + this.mouse.lerpY * 0.3;
        
        // When approaching the door and beyond, look straight ahead mostly
        const lookZ = this.currentScrollZ - 6;
        this.camera.lookAt(0, 2.0, lookZ);

        this.mainScene.update(delta, this.currentScrollZ, this.mouse);
        this._updateHover();

        this.renderer.render(this.mainScene.scene, this.camera);
    }
}

window.addEventListener('DOMContentLoaded', () => new App());
