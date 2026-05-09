const formulario = document.getElementById('formulario');
const descripcion = document.getElementById('descripcion');
const monto = document.getElementById('monto');
const tipo = document.getElementById('tipo');
const listamovimientos = document.getElementById('listamovimientos');
const balance = document.getElementById('balance');
const totalIngresos = document.getElementById('totalingresos');
const totalgastos = document.getElementById('totalgastos');
const categoria = document.getElementById('categoria');
const totalmovimientos = document.getElementById('totalmovimientos');
const mayoringreso = document.getElementById('mayoringreso');
const mayorgasto = document.getElementById('mayorgasto');
const filtro = document.getElementById('filtro');
function guardarMovimientos() {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

let movimientos = JSON.parse(localStorage.getItem('movimientos')) || [];

formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    const nuevoMovimiento = {
        id: Date.now(),
        descripcion: descripcion.value,
        monto: Number(monto.value),
        tipo: tipo.value,
        categoria: categoria.value,
        fecha: new Date().toLocaleDateString()
    };
    movimientos.push(nuevoMovimiento);
    mostrarMovimientos();
    calcularbalance();
    calcularEstadisticas();
    actualizarGrafica();
    guardarMovimientos();
    formulario.reset();

});

filtro.addEventListener('change', mostrarMovimientos);

function mostrarMovimientos() {
    listamovimientos.innerHTML = "";
    const movimientosfiltrados = movimientos.filter(function (movimiento) {
        if (filtro.value === 'todos') {
            return true;
        }
        return movimiento.tipo === filtro.value;
    });

    movimientosfiltrados.forEach(function (movimiento) {

        const li = document.createElement('li');
        li.innerHTML = `
        <div>
            <strong>${movimiento.descripcion}</strong>
            <br>
            $${movimiento.monto} - ${movimiento.tipo}
            <br>
                Categoria: ${movimiento.categoria}
            <br>
            <small>${movimiento.fecha}</small>
        </div>

            <button onclick="eliminarMovimiento(${movimiento.id})">
                ❌
            </button>
        `;
        listamovimientos.appendChild(li);
    });
}

function calcularbalance() {
    let ingresos = 0;
    let gastos = 0;
    movimientos.forEach(function (movimiento) {
        if (movimiento.tipo === 'ingreso') {
            ingresos += movimiento.monto;
        } else {
            gastos += movimiento.monto;
        }

    });

    const total = ingresos - gastos;
    balance.textContent = `Balance: $${total}`;
    totalIngresos.textContent = `Total Ingresos: $${ingresos}`;
    totalgastos.textContent = `Total gastos: $${gastos}`;
}

function calcularEstadisticas() {
    totalmovimientos.textContent = movimientos.length;

    let ingresos = movimientos
        .filter(m => m.tipo === 'ingreso')
        .map(m => m.monto);

    let gastos = movimientos
        .filter(m => m.tipo === 'gasto')
        .map(m => m.monto);

    let ingresoMax = ingresos.length ? Math.max(...ingresos) : 0;
    let gastoMax = gastos.length ? Math.max(...gastos) : 0;

    mayoringreso.textContent = `$${ingresoMax}`;
    mayorgasto.textContent = `$${gastoMax}`;
}

function actualizarGrafica() {

    let ingresos = 0;

    let gastos = 0;


    movimientos.forEach(function (movimiento) {

        if (movimiento.tipo === 'ingreso') {

            ingresos += movimiento.monto;

        } else {

            gastos += movimiento.monto;

        }

    });


    migrafica.data.datasets[0].data = [ingresos, gastos];

    migrafica.update();

}

function eliminarMovimiento(id) {
    console.log("id recibido:", id);
    movimientos = movimientos.filter(function (movimiento) {
        return movimiento.id !== Number(id);
    });

    console.log(movimientos);
    guardarMovimientos();
    mostrarMovimientos();
    calcularbalance();
    calcularEstadisticas();
    actualizarGrafica();
}

const ctx = document.getElementById('migrafica');

let migrafica = new Chart(ctx, {

    type: 'doughnut',

    data: {

        labels: ['Ingresos', 'Gastos'],

        datasets: [{

            label: 'Finanzas',

            data: [0, 0],

            backgroundColor: [
                '#00ff88',
                '#ff4d4d'
            ],

            borderWidth: 1

        }]

    },

    options: {

        responsive: true

    }

});


mostrarMovimientos();

calcularbalance();

calcularEstadisticas();

actualizarGrafica();



