const countangka = document.getElementById("angka");
const btndzikir = document.getElementById("dzikir");
const btnreset = document.getElementById("reset");
const toast = document.getElementById("notify");
const kata = document.getElementById("selamat");

let count = 0;
let notif = false;

function munculinnoti() {
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

btndzikir.addEventListener("click", () => {
    count++;
    
    if (count === 33 && !notif) {
        munculinnoti();
        notif = true;
    }
    
    if (notif) {
        selamat.textContent = "Target Tercapai";
        selamat.style.display = 'block';
        countangka.textContent = count;
    } else {
        countangka.textContent = count;
    }
});

btnreset.addEventListener("click", () => {
    count = 0;
    notif = false;
    countangka.textContent = count;
    selamat.textContent = "";
    selamat.style.display = 'none';

    toast.classList.remove("show"); 
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