const N = 980;
const K = 7;
const PRECIO = 25;
const SIMS = 10000;
const MIN_SOBRES = 140;

// ---------------- UI ----------------

function mostrarModo(modo) {
    document.getElementById("menu").style.display = "none";
    document.getElementById("modoCosto").style.display = modo === "costo" ? "block" : "none";
    document.getElementById("modoPorcentaje").style.display = modo === "porcentaje" ? "block" : "none";
    document.getElementById("resultado").innerHTML = "";
    document.getElementById("barra").style.width = "0%";
}

function volverMenu() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("modoCosto").style.display = "none";
    document.getElementById("modoPorcentaje").style.display = "none";
    document.getElementById("resultado").innerHTML = "";
    document.getElementById("barra").style.width = "0%";
}

function actualizarValor() {
    document.getElementById("valorPorcentaje").innerText =
        document.getElementById("porcentaje").value + "%";
}

// ---------------- SIMULACIÓN ----------------

function abrirSobre(album) {
    for (let i = 0; i < K; i++) {
        album.add(Math.floor(Math.random() * N) + 1);
    }
}

// ---------------- MODO COSTO ----------------

async function simularCosto() {
    let porcentaje = parseFloat(document.getElementById("porcentaje").value);
    let barra = document.getElementById("barra");

    let resultados = [];

    for (let i = 0; i < SIMS; i++) {
        let objetivo = Math.floor(N * (porcentaje / 100));
        let album = new Set();
        let sobres = 0;

        while (album.size < objetivo) {
            abrirSobre(album);
            sobres++;
        }

        resultados.push(sobres);

        if (i % 50 === 0) {
            barra.style.width = (i / SIMS) * 100 + "%";
            await new Promise(r => setTimeout(r, 0));
        }
    }

    let promedio = resultados.reduce((a,b)=>a+b,0)/SIMS;
    let sobresFinal = Math.max(promedio, MIN_SOBRES);
    let costo = sobresFinal * PRECIO;

    let compra = Math.floor(N * (porcentaje / 100));
    let intercambio = N - compra;

    document.getElementById("resultado").innerHTML = `
        Necesitas <b>${sobresFinal.toFixed(0)}</b> sobres<br>
        Costo estimado: <b>$${costo.toFixed(0)} MXN</b><br><br>
        Compra: <b>${compra}</b> | Intercambio: <b>${intercambio}</b>
    `;
}

// ---------------- MODO PORCENTAJE ----------------

async function simularPorcentaje() {
    let sobresObjetivo = parseInt(document.getElementById("sobresInput").value);
    let barra = document.getElementById("barra");

    let resultados = [];

    for (let i = 0; i < SIMS; i++) {
        let album = new Set();

        for (let s = 0; s < sobresObjetivo; s++) {
            abrirSobre(album);
        }

        resultados.push(album.size);

        if (i % 50 === 0) {
            barra.style.width = (i / SIMS) * 100 + "%";
            await new Promise(r => setTimeout(r, 0));
        }
    }

    let promedio = resultados.reduce((a,b)=>a+b,0)/SIMS;
    let porcentaje = (promedio / N) * 100;

    document.getElementById("resultado").innerHTML = `
        Con <b>${sobresObjetivo}</b> sobres llenas aproximadamente <b>${porcentaje.toFixed(2)}%</b>
    `;
}
