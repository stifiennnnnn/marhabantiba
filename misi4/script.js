const checkboxes = document.querySelectorAll('.shalat-check');
const barFill = document.getElementById('shalat-bar-fill');
const percentText = document.getElementById('shalat-percent');
const countText = document.getElementById('shalat-count');
const globalPercent = document.getElementById('global-progress-percent');
const modal = document.getElementById('custom-modal');

    function updateShalatProgress() {
        const total = checkboxes.length;
        const checked = document.querySelectorAll('.shalat-check:checked').length;
        const percentage = (checked / total) * 100;

        barFill.style.width = percentage + "%";
        percentText.innerText = Math.round(percentage);
        countText.innerText = checked;
        
        if(globalPercent) globalPercent.innerText = Math.round(percentage);

        const savedState = Array.from(checkboxes).map(cb => cb.checked);
        localStorage.setItem('shalatData', JSON.stringify(savedState));
    }

    function resetShalat() {
        modal.classList.add('active');
    }

    function tutupModal() {
        modal.classList.remove('active');
    }

    function eksekusiReset() {
        checkboxes.forEach(cb => cb.checked = false);
        updateShalatProgress();
        tutupModal();
    }

    window.onload = () => {
        const data = JSON.parse(localStorage.getItem('shalatData'));
        if (data) {
            checkboxes.forEach((cb, i) => {
                if(data[i] !== undefined) cb.checked = data[i];
            });
            updateShalatProgress();
        }
    };

    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateShalatProgress);
    });

window.onload = function() {
    const tombolMenu = document.getElementById('menu-mobile');
    const daftarNav = document.getElementById('nav-list');

    if (tombolMenu) {
        tombolMenu.onclick = function() {
            daftarNav.classList.toggle('active');
            console.log("Navbar berhasil dibuka/tutup!");
        };
    } else {
        console.error("Tombol menu-mobile tidak ditemukan di HTML!");
    }
};