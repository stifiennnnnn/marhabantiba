const dropdownKota = document.querySelector('#pilih-kota');
const tabelBody = document.querySelector('#tabel-imsakiyah tbody');
const statusPesan = document.querySelector('#status-pesan');

async function updateJadwal(idKota) {
    const tahun = 2026;
    const urlFeb = `https://api.myquran.com/v2/sholat/jadwal/${idKota}/${tahun}/02`;
    const urlMar = `https://api.myquran.com/v2/sholat/jadwal/${idKota}/${tahun}/03`;

    try {
        tabelBody.innerHTML = '';
        statusPesan.innerText = "Memuat data imsakiyah...";
        statusPesan.style.color = "blue";

        const [resFeb, resMar] = await Promise.all([
            fetch(urlFeb).then(res => res.json()),
            fetch(urlMar).then(res => res.json())
        ]);

        if (!resFeb.status || !resMar.status) throw new Error("Gagal mengambil data");
        const semuaJadwal = [...resFeb.data.jadwal, ...resMar.data.jadwal];
        const jadwalFilter = semuaJadwal.filter(hari => {
            const tgl = hari.date;
            return tgl >= "2026-02-18" && tgl <= "2026-03-19";
        });

        statusPesan.innerText = "";
        renderTabel(jadwalFilter);

    } catch (error) {
        statusPesan.innerText = "Gagal memuat data. Periksa koneksi atau ID Kota.";
        statusPesan.style.color = "red";
    }
}

function renderTabel(data) {
    const hariIni = new Date().toLocaleDateString('en-CA'); 

    data.forEach(hari => {
        const isHariIni = hari.date === hariIni ? "style='background-color: #4d4b42; font-weight: bold;'" : "";
        const baris = `
            <tr ${isHariIni}>
                <td>${hari.tanggal}</td>
                <td>${hari.imsak}</td>
                <td>${hari.subuh}</td>
                <td>${hari.dzuhur}</td>
                <td>${hari.ashar}</td>
                <td>${hari.maghrib}</td>
                <td>${hari.isya}</td>
            </tr>
        `;
        tabelBody.insertAdjacentHTML('beforeend', baris);
    });
}

dropdownKota.addEventListener('change', (event) => {
    updateJadwal(event.target.value);
});


updateJadwal(dropdownKota.value);