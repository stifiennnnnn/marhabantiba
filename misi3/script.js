document.addEventListener('DOMContentLoaded', function() {
    const selector = document.getElementById('selectform');
    const calcpenghasilan = document.getElementById('calcpenghasilan');
    const calcemas = document.getElementById('calcemas');
    const inputs = [
        document.getElementById('inputgaji'),
        document.getElementById('inputlain'),
        document.getElementById('inputemas')
    ];

    function koma(angka) {
        if (!angka || isNaN(angka)) return "0";
        let bersih = Math.floor(angka).toString();
        return bersih.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function bilangan(teks) {
        if (!teks) return 0;
        return parseInt(teks.replace(/\./g, '')) || 0;
    }

    function displayupd() {
        const selection = selector.value;
        if (calcpenghasilan) calcpenghasilan.style.display = selection === 'penghasilan' ? 'block' : 'none';
        if (calcemas) calcemas.style.display = selection === 'emas' ? 'block' : 'none';

        if (typeof window.reset === 'function') {
            window.reset();
        }
    }

    selector.addEventListener('change', displayupd);
    displayupd();

    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', function() {
                let nilai = this.value.replace(/[^0-9]/g, '');
                this.value = koma(nilai);
            });
        }
    });

    window.itung = function() {
        const selection = selector.value;
        let totalharta = 0;
        let zakatnya = 0;
        let nisabangka = 0;
        let statuszakat = "";

        if (selection === 'penghasilan') {
            const nomgaji = bilangan(document.getElementById("inputgaji").value);
            const nomlain = bilangan(document.getElementById("inputlain").value);
            const hargaberas = 14636; 
            nisabangka = 522 * hargaberas;
            
            totalharta = nomgaji + nomlain;
            
            if (totalharta >= nisabangka) {
                zakatnya = totalharta * 0.025;
                statuszakat = "Wajib Zakat";
            } else {
                statuszakat = "Tidak Wajib Zakat";
            }
        } else {
            const nomemas = bilangan(document.getElementById("inputemas").value);
            const hargaemas = 1078608; 
            nisabangka = hargaemas * 85;
            totalharta = nomemas * hargaemas;

            if (nomemas >= 85) {
                zakatnya = totalharta * 0.025;
                statuszakat = "Wajib Zakat";
            } else {
                statuszakat = "Tidak Wajib Zakat";
            }
        }

        document.getElementById("total").innerText = "Rp. " + koma(totalharta);
        document.getElementById("nisab").innerText = "Rp. " + koma(nisabangka);
        document.getElementById("status").innerText = statuszakat;
        document.getElementById("hasil").innerText = "Rp. " + koma(zakatnya);
    };

    window.reset = function() {
        inputs.forEach(input => {
            if (input) input.value = "";
        });
        document.getElementById("total").innerText = "";
        document.getElementById("nisab").innerText = "";
        document.getElementById("status").innerText = "";
        document.getElementById("hasil").innerText = "";
    };
});