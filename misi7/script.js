const dropdownKota = document.querySelector('#pilih-kota');
const tabelBody = document.querySelector('#tabel-imsakiyah tbody');
const statusPesan = document.querySelector('#status-pesan');

const countangka = document.getElementById("angka");
const btndzikir = document.getElementById("dzikir");
const btnreset = document.getElementById("reset");
const toast = document.getElementById("notify");
const targetMsg = document.getElementById("target-msg");
const percentDzikir = document.getElementById("percent-dzikir");
const statusDzikir = document.getElementById("status-dzikir");

const checkboxes = document.querySelectorAll('.shalat-check');
const barFill = document.getElementById('shalat-bar-fill');
const percentText = document.getElementById('shalat-percent');
const countText = document.getElementById('shalat-count');
const globalPercent = document.getElementById('global-progress-percent');
const modal = document.getElementById('custom-modal');

const selector = document.getElementById('selectform');
const inputs = [
    document.getElementById('inputgaji'),
    document.getElementById('inputlain'),
    document.getElementById('inputemas')
];

const calendarGrid = document.getElementById('calendar-grid');
const totalPuasaDisplay = document.getElementById('total-puasa');
let puasaData = JSON.parse(localStorage.getItem('puasaDays')) || [];

function koma(angka) {
    if (!angka || isNaN(angka)) return "0";
    let bersih = Math.floor(angka).toString();
    return bersih.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function bilangan(teks) {
    if (!teks) return 0;
    return parseInt(teks.toString().replace(/\./g, '')) || 0;
}

async function updateJadwal(idKota) {
    if (!tabelBody) return;
    const tahun = 2026;
    const urlFeb = `https://api.myquran.com/v2/sholat/jadwal/${idKota}/${tahun}/02`;
    const urlMar = `https://api.myquran.com/v2/sholat/jadwal/${idKota}/${tahun}/03`;

    try {
        tabelBody.innerHTML = '';
        if (statusPesan) {
            statusPesan.innerText = "Memuat data imsakiyah...";
            statusPesan.style.color = "var(--gold)";
        }

        const [resFeb, resMar] = await Promise.all([
            fetch(urlFeb).then(res => res.json()),
            fetch(urlMar).then(res => res.json())
        ]);

        const semuaJadwal = [...resFeb.data.jadwal, ...resMar.data.jadwal];
        const jadwalFilter = semuaJadwal.filter(hari => {
            const tgl = hari.date;
            return tgl >= "2026-02-18" && tgl <= "2026-03-19";
        });

        if (statusPesan) statusPesan.innerText = "";
        renderTabel(jadwalFilter);
    } catch (error) {
        if (statusPesan) {
            statusPesan.innerText = "Gagal memuat data.";
            statusPesan.style.color = "#ff4d4d";
        }
    }
}

function renderTabel(data) {
    const hariIni = new Date().toLocaleDateString('en-CA'); 
    let htmlContent = '';
    data.forEach(hari => {
        const isHariIni = hari.date === hariIni ? "style='background-color: rgba(255, 215, 0, 0.2); font-weight: bold; color: #ffd700;'" : "";
        htmlContent += `
            <tr ${isHariIni}>
                <td>${hari.tanggal}</td>
                <td>${hari.imsak}</td>
                <td>${hari.subuh}</td>
                <td>${hari.dzuhur}</td>
                <td>${hari.ashar}</td>
                <td>${hari.maghrib}</td>
                <td>${hari.isya}</td>
            </tr>`;
    });
    tabelBody.innerHTML = htmlContent;
}

let count = 0;
let notif = false;
if (btndzikir) {
    btndzikir.addEventListener("click", () => {
        count++;
        let progres = Math.min(Math.round((count / 33) * 100), 100);
        if (percentDzikir) percentDzikir.textContent = progres + "%";
        if (count === 33 && !notif) {
            if (toast) {
                toast.style.display = "block";
                setTimeout(() => { toast.style.display = "none"; }, 3000);
            }
            notif = true;
            if (targetMsg) targetMsg.style.display = "block";
            if (statusDzikir) statusDzikir.textContent = "Target Tercapai! Tabarakallah.";
        }
        if (countangka) countangka.textContent = count;
    });
    btnreset.addEventListener("click", () => {
        count = 0;
        notif = false;
        if (countangka) countangka.textContent = count;
        if (percentDzikir) percentDzikir.textContent = "0%";
        if (statusDzikir) statusDzikir.textContent = "Ayo Mulai Dzikir!";
        if (targetMsg) targetMsg.style.display = "none";
    });
}

function updateShalatProgress() {
    const total = checkboxes.length;
    const checked = document.querySelectorAll('.shalat-check:checked').length;
    const percentage = total > 0 ? (checked / total) * 100 : 0;

    if (barFill) barFill.style.width = percentage + "%";
    if (percentText) percentText.innerText = Math.round(percentage);
    if (countText) countText.innerText = checked;
    if (globalPercent) globalPercent.innerText = Math.round(percentage);

    const savedState = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem('shalatData', JSON.stringify(savedState));
}

window.resetShalat = function() { if (modal) modal.style.display = 'flex'; };
window.tutupModal = function() { if (modal) modal.style.display = 'none'; };
window.eksekusiReset = function() {
    checkboxes.forEach(cb => cb.checked = false);
    updateShalatProgress();
    tutupModal();
};

window.itung = function() {
    if (!selector) return;
    const selection = selector.value;
    let totalharta = 0, zakatnya = 0, nisabangka = 0, statuszakat = "";
    if (selection === 'penghasilan') {
        const nomgaji = bilangan(document.getElementById("inputgaji").value);
        const nomlain = bilangan(document.getElementById("inputlain").value);
        nisabangka = 522 * 14636; 
        totalharta = nomgaji + nomlain;
    } else {
        const nomemas = bilangan(document.getElementById("inputemas").value);
        nisabangka = 1078608 * 85;
        totalharta = nomemas * 1078608;
    }
    if (totalharta >= nisabangka) {
        zakatnya = totalharta * 0.025;
        statuszakat = "Wajib Zakat";
    } else {
        statuszakat = "Tidak Wajib Zakat";
    }
    const resTotal = document.getElementById("total");
    const resNisab = document.getElementById("nisab");
    const resStatus = document.getElementById("status");
    const resHasil = document.getElementById("hasil");
    if (resTotal) resTotal.innerText = "Rp. " + koma(totalharta);
    if (resNisab) resNisab.innerText = "Rp. " + koma(nisabangka);
    if (resStatus) resStatus.innerText = statuszakat;
    if (resHasil) resHasil.innerText = "Rp. " + koma(zakatnya);
};

window.reset = function() {
    inputs.forEach(input => { if (input) input.value = ""; });
    ["total", "nisab", "status", "hasil"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = "Rp 0";
    });
};

function updateQuranProgress() {
    const targetInput = document.getElementById('target-hal');
    const bacaInput = document.getElementById('baca-hal');
    const quranBar = document.getElementById('quran-bar-fill'); 
    const quranPercent = document.getElementById('quran-percent');
    const statusOto = document.getElementById('status-otomatis');
    const motivasi = document.getElementById('status-motivasi');
    
    if (!targetInput || !bacaInput) return;

    if (parseInt(targetInput.value) > 604) targetInput.value = 604;
    if (parseInt(bacaInput.value) > 604) bacaInput.value = 604;

    const target = parseFloat(targetInput.value) || 0;
    const dibaca = parseFloat(bacaInput.value) || 0;
    let persentase = 0;

    if (target > 0) {
        persentase = Math.min(Math.round((dibaca / target) * 100), 100);
    }

    if (quranBar) quranBar.style.width = persentase + "%";
    if (quranPercent) quranPercent.innerText = persentase;

    if (statusOto) {
        if (persentase >= 100) {
            statusOto.innerText = "Selesai";
            if (motivasi) motivasi.innerText = "MasyaAllah, Target Tercapai!";
        } else if (persentase > 0) {
            statusOto.innerText = "Sedang Berjalan";
            if (motivasi) motivasi.innerText = "Semangat! Teruskan bacaanmu.";
        } else {
            statusOto.innerText = "-";
            if (motivasi) motivasi.innerText = "Ayo mulai membaca hari ini!";
        }
    }
}

function createCalendar() {
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';
    for (let i = 1; i <= 30; i++) {
        const dayBox = document.createElement('div');
        dayBox.classList.add('day-box');
        dayBox.innerText = i;
        if (puasaData.includes(i)) dayBox.classList.add('completed');
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
    localStorage.setItem('puasaDays', JSON.stringify(puasaData));
}

function updateSummary() {
    if (totalPuasaDisplay) {
        const totalHari = puasaData.length;
        totalPuasaDisplay.innerText = totalHari;

        const persentase = Math.round((totalHari / 30) * 100);
        
        const puasaBar = document.getElementById('puasa-bar-fill');
        const puasaPercent = document.getElementById('puasa-percent');
        
        if (puasaBar) puasaBar.style.width = persentase + "%";
        if (puasaPercent) puasaPercent.innerText = persentase;

        const motivasi = document.getElementById('global-motivation-status');
        if (motivasi) {
            if (persentase >= 100) motivasi.innerText = "MasyaAllah, Ramadhan penuh! Selamat hari raya.";
            else if (persentase >= 50) motivasi.innerText = "Setengah jalan terlewati, istiqomah ya!";
            else if (persentase > 0) motivasi.innerText = "Semangat! Setiap hari adalah berkah.";
            else motivasi.innerText = "Niatkan puasa karena Allah.";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createCalendar();

    const menuToggle = document.getElementById('menu-mobile');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '☰';
            }
        });
    }

    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                let nilai = this.value.replace(/[^0-9]/g, '');
                this.value = koma(nilai);
            });
        }
    });

    if (selector) {
        selector.addEventListener('change', () => {
            const cp = document.getElementById('calcpenghasilan');
            const ce = document.getElementById('calcemas');
            if (cp) cp.style.display = selector.value === 'penghasilan' ? 'block' : 'none';
            if (ce) ce.style.display = selector.value === 'emas' ? 'block' : 'none';
            window.reset();
        });
    }

    const shalatData = JSON.parse(localStorage.getItem('shalatData'));
    if (shalatData && checkboxes.length > 0) {
        checkboxes.forEach((cb, i) => {
            if (shalatData[i] !== undefined) cb.checked = shalatData[i];
        });
        updateShalatProgress();
    }
    checkboxes.forEach(cb => cb.addEventListener('change', updateShalatProgress));

    const targetInput = document.getElementById('target-hal');
    const bacaInput = document.getElementById('baca-hal');
    const btnSimpanQuran = document.getElementById('btn-simpan-quran');

    if (targetInput && bacaInput) {
        const savedQuran = JSON.parse(localStorage.getItem('quranData'));
        if (savedQuran) {
            targetInput.value = savedQuran.target || "";
            bacaInput.value = savedQuran.dibaca || "";
        }
        targetInput.addEventListener('input', updateQuranProgress);
        bacaInput.addEventListener('input', updateQuranProgress);
        updateQuranProgress(); 
    }

    if (btnSimpanQuran) {
        btnSimpanQuran.addEventListener('click', () => {
            localStorage.setItem('quranData', JSON.stringify({
                target: targetInput.value,
                dibaca: bacaInput.value
            }));
            if (toast) {
                toast.style.display = "block";
                setTimeout(() => { toast.style.display = "none"; }, 3000);
            }
        });
    }

    if (dropdownKota) {
        dropdownKota.addEventListener('change', (e) => updateJadwal(e.target.value));
        updateJadwal(dropdownKota.value);
    }
});