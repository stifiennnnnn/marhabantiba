const countangka = document.getElementById("angka");
const btndzikir = document.getElementById("dzikir");
const btnreset = document.getElementById("reset");
const toast = document.getElementById("notify");
const kata = document.getElementById("selamat");
const totalHarian = document.getElementById("total-harian");
const persenDzikir = document.getElementById("persen-dzikir");
const statusDzikir = document.getElementById("status-dzikir");
let count = 0;
let notif = false;
const target = 33;

function munculinnoti() {
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function updateRingkasan() {
    let progres = Math.floor((count / target) * 100);
    if (persenDzikir) {
        persenDzikir.textContent = (progres > 100 ? 100 : progres) + "%";
    }

    if (statusDzikir) {
        if (count >= target) {
            statusDzikir.textContent = "Target Tercapai! Tabarakallah.";
        } else {
            statusDzikir.textContent = "Sedang Berproses...";
            statusDzikir.style.color = "white";
        }
    }
}

btndzikir.addEventListener("click", () => {
    count++;
    
    if (count === target && !notif) {
        munculinnoti();
        notif = true;
    }
    
    if (notif) {
        kata.textContent = "Target Tercapai!";
        kata.style.display = 'block';
        kata.style.opacity = '1';
        countangka.textContent = count;
    } else {
        countangka.textContent = count;
    }

    updateRingkasan();
});

btnreset.addEventListener("click", () => {
    count = 0;
    notif = false;
    countangka.textContent = count;
    kata.textContent = "";
    kata.style.display = 'none';
    
    toast.classList.remove("show"); 

    updateRingkasan();
    if (statusDzikir) statusDzikir.textContent = "Ayo Mulai Dzikir!";
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
