const usuario = JSON.parse(localStorage.getItem("usuario"));
const API_BASE = "http://localhost:3000/api/usuarios";

const btn = document.getElementById("btnCrear");

if (!usuario) {
  window.location.href = "login.html";
}

btn.addEventListener("click", async () => {
  const p1 = document.getElementById("password1").value.trim();
  const p2 = document.getElementById("password2").value.trim();
  const error = document.getElementById("error");

  error.textContent = "";

  if (!p1 || !p2) {
    error.textContent = "Completá ambos campos";
    return;
  }

  if (p1 !== p2) {
    error.textContent = "Las contraseñas no coinciden";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/activar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dni: usuario.dni,
        password: p1
      })
    });

    const data = await res.json();

    if (!res.ok) {
      error.textContent = data.error;
      return;
    }

    alert("Cuenta activada correctamente");

    localStorage.removeItem("usuario");

    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    error.textContent = "Error del servidor";
  }
});