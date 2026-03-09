function showToast() {
    const toast = document.getElementById("toast");
    toast.className = "toast show";
    setTimeout(function() { 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

function updateQuran() {
    const targetInput = document.getElementById('target-hal');
    const bacaInput = document.getElementById('baca-hal');
    
    if (targetInput.value > 604) targetInput.value = 604;
    if (bacaInput.value > 604) bacaInput.value = 604;

    const target = parseFloat(targetInput.value) || 0;
    const dibaca = parseFloat(bacaInput.value) || 0;
    
    const bar = document.getElementById('quran-bar');
    const statusTeks = document.getElementById('status-otomatis');
    const globalPercent = document.getElementById('global-progress-percent');
    const motivasi = document.getElementById('global-motivation-status');

    let persen = 0;
    if (target > 0) {
        persen = Math.min((dibaca / target) * 100, 100);
    }

    bar.style.width = persen + "%";
    if (globalPercent) globalPercent.innerText = Math.round(persen);

    if (persen >= 100) {
        statusTeks.innerText = "Target tercapai";
        if (motivasi) motivasi.innerText = "Khatam! MasyaAllah luar biasa!";
    } else if (persen >= 50) {
        statusTeks.innerText = "Hampir selesai";
        if (motivasi) motivasi.innerText = "Semangat, tinggal separuh lagi!";
    } else {
        statusTeks.innerText = "Masih bisa ditambah";
        if (motivasi) motivasi.innerText = "Yuk, cicil lagi bacaannya!";
    }
}

document.querySelector('.btn-simpan').addEventListener('click', function() {
    const data = {
        target: document.getElementById('target-hal').value,
        dibaca: document.getElementById('baca-hal').value
    };
    localStorage.setItem('quranProgress', JSON.stringify(data));
    
    showToast();
});

window.onload = function() {
    const savedData = localStorage.getItem('quranProgress');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        document.getElementById('target-hal').value = parsed.target;
        document.getElementById('baca-hal').value = parsed.dibaca;
        updateQuran();
    }
};

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
