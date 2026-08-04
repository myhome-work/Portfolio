// 1. VISITOR COUNTER (1 View per Sesi)
async function getVisitCount() {
    const hasVisited = sessionStorage.getItem("hasVisited");
    
    // Jika belum pernah berkunjung di sesi ini, panggil /up (tambah). Jika sudah, panggil / (cuma lihat angka)
    const endpoint = !hasVisited 
        ? 'https://api.counterapi.dev/v1/samuel_portfolio_2026/views/up'
        : 'https://api.counterapi.dev/v1/samuel_portfolio_2026/views/';

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        const visitorElement = document.getElementById("visitor-count");
        if (visitorElement && data.count !== undefined) {
            visitorElement.innerText = data.count.toLocaleString();
            
            // Tandai bahwa user sudah berkunjung
            if (!hasVisited) sessionStorage.setItem("hasVisited", "true");
        }
    } catch (error) {
        console.error("Error fetching visit count:", error);
        const visitorElement = document.getElementById("visitor-count");
        if (visitorElement) visitorElement.innerText = "-";
    }
}

// 2. LOAD PROJECTS DARI JSON & HITUNG PROYEK AUTOMATIS
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();

        // 1. Update counter 'Proyek Selesai' sesuai jumlah objek di projects.json
        const projectElement = document.getElementById('project-count');
        if (projectElement) {
            projectElement.innerText = projects.length;
        }

        // 2. Render 4 kartu proyek ke dalam grid
        const projectsContainer = document.getElementById('projects-grid');
        if (projectsContainer) {
            projectsContainer.innerHTML = '';

            projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';

                card.innerHTML = `
                    <div class="card-content">
                        <h3>${project.title} <span>(${project.lang})</span></h3>
                        <p>${project.desc}</p>
                    </div>
                    <div class="card-footer">
                        <a href="${project.link}" target="_blank" class="view-btn">View &rarr;</a>
                    </div>
                `;

                projectsContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Error fetching project json:", error);
        const projectElement = document.getElementById('project-count');
        if (projectElement) projectElement.innerText = "0";
    }
}

// 3. JALANKAN SAAT HALAMAN DIMUAT
document.addEventListener("DOMContentLoaded", () => {
    getVisitCount();
    loadProjects();
});

function toggleEdu(element) {
    const allItems = document.querySelectorAll('.timeline-item');
    const isAlreadyActive = element.classList.contains('active');

    // Tutup semua item lain saat salah satu diklik
    allItems.forEach(item => {
        item.classList.remove('active');
    });

    // Buka item yang diklik jika belum aktif
    if (!isAlreadyActive) {
        element.classList.add('active');
    }
}