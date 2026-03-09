const calendarGrid = document.getElementById('calendar-grid');
const totalPuasaDisplay = document.getElementById('total-puasa');
let puasaData = JSON.parse(localStorage.getItem('puasaDays')) || [];

function createCalendar() {
    for (let i = 1; i <= 30; i++) {
        const dayBox = document.createElement('div');
        dayBox.classList.add('day-box');
        dayBox.innerText = i;

        if (puasaData.includes(i)) {
            dayBox.classList.add('completed');
        }

        dayBox.onclick = () => toggleDay(i, dayBox);
        calendarGrid.appendChild(dayBox);
    }
    updateSummary();
}

function toggleDay(day, element) {
    if (puasaData.includes(day)) {
        puasaData = puasaData.filter(d => d !== day);
        element.classList.remove('completed');
    } else {
        puasaData.push(day);
        element.classList.add('completed');
    }
    updateSummary();
}

function updateSummary() {
    totalPuasaDisplay.innerText = puasaData.length;
}

function showToast() {
    const toast = document.getElementById("toast");
    toast.className = "toast show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

function savePuasa() {
    localStorage.setItem('puasaDays', JSON.stringify(puasaData));
    showToast();
}

window.onload = function() {
    createCalendar()

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
