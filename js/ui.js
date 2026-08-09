// ─── ui.js — Modal and Filter Logic ────────────────────────────
export class UI {
    constructor(app) {
        this.app = app;
        this.modal = document.getElementById('detail-modal');
        this.modalBody = document.getElementById('modal-body');
        
        this.currentDomain = 'all';
        this.currentSearch = '';
        
        this._bindEvents();
    }

    _bindEvents() {
        // Modal close
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('modal-backdrop').addEventListener('click', () => this.closeModal());

        // Escape key to close modal
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });

        // Filters
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');
                
                this.currentDomain = target.getAttribute('data-filter');
                this._applyFilters();
            });
        });

        // Search Text
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase();
                this._applyFilters();
            });
        }
    }

    _applyFilters() {
        if (this.app.mainScene) {
            this.app.mainScene.filterProjects(this.currentDomain, this.currentSearch);
            this.app._clampScroll();
        }
    }

    openModal(type, data) {
        let html = '';

        if (type === 'project') {
            const bulletsHTML = data.bullets.map((b) => `<li>${b}</li>`).join('');
            const tagsHTML = data.tags.map((t) => `<span class="modal-tag">${t}</span>`).join('');
            
            // Build media HTML
            let mediaHTML = '';
            if (data.media && data.media.length > 0) {
                const mediaItems = data.media.map(src => {
                    const ext = src.split('.').pop().toLowerCase();
                    if (ext === 'mp4' || ext === 'mov') {
                        return `<video class="modal-media" src="${src}" controls loop muted playsinline preload="metadata"></video>`;
                    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                        return `<img class="modal-media" src="${src}" alt="Project Media" loading="lazy" />`;
                    } else if (ext === 'pdf') {
                        return `<a href="${src}" target="_blank" class="modal-pdf-link">📄 View Documentation (PDF)</a>`;
                    }
                    return '';
                }).join('');
                mediaHTML = `<div class="modal-media-grid">${mediaItems}</div>`;
            }

            html = `
                <h2 class="modal-title">${data.title}</h2>
                <span class="modal-date">${data.date}</span>
                <ul class="modal-bullets">${bulletsHTML}</ul>
                <div class="modal-tags">${tagsHTML}</div>
                ${mediaHTML}
            `;
        } else if (type === 'journey') {
            const title = data.school || data.org;
            const subtitle = data.degree || data.title;
            const bulletsHTML = data.bullets ? data.bullets.map((b) => `<li>${b}</li>`).join('') : '';
            
            html = `
                <h2 class="modal-title">${title}</h2>
                <h3 class="modal-subtitle">${subtitle}</h3>
                <span class="modal-date">${data.date} | ${data.location}</span>
                ${data.gpa ? `<p style="color:rgba(255,255,255,0.8); margin-bottom:12px;"><strong>GPA:</strong> ${data.gpa}</p>` : ''}
                ${bulletsHTML ? `<ul class="modal-bullets">${bulletsHTML}</ul>` : ''}
            `;
        }

        this.modalBody.innerHTML = html;
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }
}
