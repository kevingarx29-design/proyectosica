/**
 * S.I.C.A. - LÓGICA FINAL Y OPTIMIZADA
 */

const loginSection = document.getElementById('login-section');
const invSection = document.getElementById('inventario-section');
const formulario = document.getElementById('form-producto');
const tablaInventario = document.getElementById('tabla-inventario');
const campoProducto = document.getElementById('producto');
const campoLote = document.getElementById('lote');

// 1. FUNCIÓN LOGIN
function login() {
    const nombre = document.getElementById('user-name').value;
    const edad = document.getElementById('user-age').value;
    
    if(nombre && edad) {
        localStorage.setItem('usuario', nombre);
        loginSection.style.display = 'none';
        invSection.style.display = 'block';
        inicializarDashboard();
    } else {
        alert("Por favor, llena ambos campos.");
    }
}

// 2. INICIALIZAR DASHBOARD
function inicializarDashboard() {
    const fecha = new Date();
    document.getElementById('fecha-actual').innerText = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('nombre-empleado').innerText = localStorage.getItem('usuario');
}

// 3. GENERADOR DE LOTE
function generarLoteAutomatico(nombre) {
    const prefijo = nombre.substring(0, 3).toUpperCase();
    const fecha = new Date();
    return `${prefijo}-${fecha.getFullYear()}${fecha.getMonth() + 1}${fecha.getDate()}`;
}

// Evento para generar lote al presionar ENTER
campoProducto.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        if(campoProducto.value && !campoLote.value) {
            campoLote.value = generarLoteAutomatico(campoProducto.value);
        }
        document.getElementById('proveedor').focus();
    }
});

// FUNCIÓN AUXILIAR DE VALIDACIÓN
function esFechaVencida(cad) {
    const venci = new Date(cad + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    return venci < hoy;
}

// FUNCIONES PARA MENSAJES (ALERTAS Y CIERRE)
function mostrarAlerta() {
    document.getElementById('custom-alert').style.display = 'flex';
}

function cerrarAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

// 4. PROCESAMIENTO E INSERCIÓN
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    
    const producto = campoProducto.value;
    let lote = campoLote.value || generarLoteAutomatico(producto);
    const proveedor = document.getElementById('proveedor').value;
    const fechaCaducidad = document.getElementById('caducidad').value;
    const ubicacion = document.getElementById('ubicacion').value;
    const unidad = document.getElementById('unidad').value;
    
    if (esFechaVencida(fechaCaducidad)) {
        mostrarAlerta(); 
        return; 
    }
    
    agregarFilaInventario(producto, lote, proveedor, fechaCaducidad, ubicacion, unidad);
    
    setTimeout(() => { 
        formulario.reset(); 
        campoLote.value = ""; 
    }, 500);
});

// 5. AGREGAR FILA
function agregarFilaInventario(prod, lote, prov, cad, ubic, uni) {
    const venci = new Date(cad + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const dias = Math.ceil((venci - hoy) / (1000 * 60 * 60 * 24));
    
    let claseFila = dias <= 3 ? 'alerta-critico' : 'alerta-seguro';
    let estadoTexto = dias <= 3 ? 'CRÍTICO' : 'ACTIVO';
    
    const row = document.createElement('tr');
    row.className = claseFila;
    
    row.innerHTML = `
        <td>${prod}</td>
        <td>${lote}</td>
        <td>${prov}</td>
        <td>${dias}</td>
        <td>${estadoTexto}</td>
        <td>${ubic}</td>
        <td>${uni}</td>
    `;
    
    tablaInventario.insertBefore(row, tablaInventario.firstChild);
    actualizarTotal();
}

// 6. CONTADOR TOTAL
function actualizarTotal() {
    const total = tablaInventario.getElementsByTagName('tr').length;
    const elementoTotal = document.getElementById('kpi-total');
    if(elementoTotal) {
        elementoTotal.innerText = total;
    }
}

// 7. GESTIÓN DE SALIDA (LOGOUT CON MENSAJE DE GRACIAS)
document.getElementById('btn-login').addEventListener('click', login);

document.getElementById('btn-salir').addEventListener('click', () => {
    // Mostrar modal de agradecimiento
    document.getElementById('thanks-modal').style.display = 'flex';
    
    // Esperar 2 segundos y reiniciar
    setTimeout(() => {
        localStorage.removeItem('usuario');
        location.reload();
    }, 2000);
});