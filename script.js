// REEMPLAZE ESTA URL POR LA DE SU IMPLEMENTACIÓN DE GOOGLE APPS SCRIPT
const WEB_APP_URL = "SU_URL_DE_EXEC_AQUÍ";

const rolSelector = document.getElementById('rolSelector');
const camposDinamicos = document.getElementById('camposDinamicos');
const btnIngresar = document.getElementById('btnIngresar');
const loginForm = document.getElementById('loginForm');
const mensaje = document.getElementById('mensaje');

// Manejo de la Interfaz Dinámica
rolSelector.addEventListener('change', () => {
    const rol = rolSelector.value;
    camposDinamicos.innerHTML = '';
    btnIngresar.style.display = rol ? 'block' : 'none';

    if (rol === 'Profesor' || rol === 'Coordinacion') {
        camposDinamicos.innerHTML = `
            <div class="form-group">
                <label>Nombre:</label>
                <input type="text" id="usuario" placeholder="Ingrese su nombre" required>
            </div>
            <div class="form-group">
                <label>Contraseña:</label>
                <input type="password" id="pass" placeholder="••••••••" required>
            </div>`;
    } else if (rol === 'Estudiante') {
        camposDinamicos.innerHTML = `
            <div class="form-group">
                <label>Curso:</label>
                <select id="curso" required>
                    <option value="">Seleccione...</option>
                    <option value="4to">4to de Secundaria</option>
                    <option value="5to">5to de Secundaria</option>
                </select>
            </div>
            <div class="form-group">
                <label>Nombre del Estudiante:</label>
                <input type="text" id="usuario" placeholder="Nombre completo" required>
            </div>
            <div class="form-group">
                <label>Contraseña:</label>
                <input type="password" id="pass" placeholder="Contraseña de curso" required>
            </div>`;
    }
});

// Envío de Datos al Google Sheet
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    mensaje.innerHTML = "Verificando credenciales...";
    btnIngresar.disabled = true;

    const payload = {
        rol: rolSelector.value,
        usuario: document.getElementById('usuario').value,
        pass: document.getElementById('pass').value
    };

    try {
        // Usamos mode: 'no-cors' no es necesario si devolvemos el JSON correctamente desde Apps Script
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if (res.status === "success") {
            mensaje.style.color = "green";
            mensaje.innerHTML = "¡Acceso concedido! Redirigiendo...";
            setTimeout(() => window.location.href = res.url, 1500);
        } else {
            mensaje.style.color = "red";
            mensaje.innerHTML = res.message;
            btnIngresar.disabled = false;
        }
    } catch (error) {
        mensaje.style.color = "red";
        mensaje.innerHTML = "Error de conexión. Verifique la URL de la API.";
        btnIngresar.disabled = false;
    }
});