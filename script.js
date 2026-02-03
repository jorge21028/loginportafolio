// IMPORTANTE: Pegue aquí su URL de "Implementación de Aplicación Web"
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyGOtGBmFQ8KCQEGQ2e_N2EUSOlYYs5xLsYv09E2Dxd4OK9tCPPVCi8jCqVFEoR5BrY8Q/exec";

const rolSelector = document.getElementById('rolSelector');
const camposDinamicos = document.getElementById('camposDinamicos');
const btnIngresar = document.getElementById('btnIngresar');
const mensaje = document.getElementById('mensaje');

// Carga nombres desde el Excel según el rol/curso
async function cargarNombres() {
    const rol = rolSelector.value;
    const curso = document.getElementById('curso') ? document.getElementById('curso').value : null;
    const selectUser = document.getElementById('usuario');

    if (!rol || (rol === 'Estudiante' && !curso)) return;

    selectUser.innerHTML = '<option>Cargando lista...</option>';
    selectUser.disabled = true;

    try {
        let fetchUrl = `${WEB_APP_URL}?rol=${rol}`;
        if (curso) fetchUrl += `&curso=${curso}`;

        const resp = await fetch(fetchUrl);
        const nombres = await resp.json();

        selectUser.innerHTML = '<option value="">-- Seleccione su nombre --</option>';
        nombres.forEach(n => {
            let opt = document.createElement('option');
            opt.value = n;
            opt.textContent = n;
            selectUser.appendChild(opt);
        });
        selectUser.disabled = false;
    } catch (e) {
        mensaje.innerHTML = "Error al conectar con la base de datos.";
    }
}

// Configura el formulario según el rol
rolSelector.addEventListener('change', () => {
    const rol = rolSelector.value;
    camposDinamicos.innerHTML = '';
    btnIngresar.style.display = rol ? 'block' : 'none';

    if (rol === 'Profesor' || rol === 'Coordinacion') {
        camposDinamicos.innerHTML = `
            <div class="form-group"><label>Usuario:</label><select id="usuario" required></select></div>
            <div class="form-group"><label>Contraseña:</label><input type="password" id="pass" required></div>`;
        cargarNombres();
    } else if (rol === 'Estudiante') {
        camposDinamicos.innerHTML = `
            <div class="form-group"><label>Curso:</label><select id="curso" onchange="cargarNombres()" required>
                <option value="">-- Seleccione curso --</option>
				<option value="4to B">4to B de Secundaria</option>
                <option value="4to C">4to C de Secundaria</option>
                <option value="5to B">5to B de Secundaria</option>
				<option value="6to B">6to B de Secundaria</option>
            </select></div>
            <div class="form-group"><label>Nombre:</label><select id="usuario" required disabled><option>Elija curso...</option></select></div>
            <div class="form-group"><label>Contraseña:</label><input type="password" id="pass" required></div>`;
    }
});

// Proceso de Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    mensaje.style.color = "var(--primary-color)";
    mensaje.innerHTML = "Validando acceso...";
    
    const payload = {
        rol: rolSelector.value,
        usuario: document.getElementById('usuario').value,
        pass: document.getElementById('pass').value
    };

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const res = await response.json();

        if (res.status === "success") {
            mensaje.innerHTML = "Acceso correcto. Entrando...";
            window.location.href = res.url;
        } else {
            mensaje.style.color = "red";
            mensaje.innerHTML = res.message;
        }
    } catch (err) {
        mensaje.innerHTML = "Error de conexión.";
    }
});
