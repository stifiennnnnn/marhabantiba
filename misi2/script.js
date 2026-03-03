const countangka = document.getElementById("angka");
const btndzikir = document.getElementById("dzikir");
const btnreset = document.getElementById("reset");
const toast = document.getElementById("notify")

let count = 0;
let notif = false;

function munculinnoti() {
    toast.style.display = "block"
    setInterval(() => {
        toast.style.display = "none";}, 3000);
    }

btndzikir.addEventListener("click", () => {
    count++;
    countangka.textContent = count;
    if (count===33 && !notif) {
        munculinnoti()
        notif = true;
    }
    if (notif) {
        countangka.textContent = count+" (Target Tercapai)";
    } else {
        countangka.textContent = count;
    }
});

btnreset.addEventListener("click", () => {
    count=0;
    countangka.textContent = count;
    notif = false;
});