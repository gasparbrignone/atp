// app.js
// Rutas que requieren autenticación
const protectedRoutes = ['/nueva-acta.html', '/historial.html', '/calendario.html', '/proyectos.html'];

auth.onAuthStateChanged(user => {
  const currentPath = window.location.pathname;
  const isProtected = protectedRoutes.some(route => currentPath.includes(route));

  if (user) {
    // Usuario logueado
    if (document.getElementById('login-section')) {
      document.getElementById('login-section').classList.add('hidden');
      document.getElementById('dashboard-section').classList.remove('hidden');
      document.getElementById('user-email').textContent = user.email;
    }
  } else {
    // No hay usuario
    if (isProtected) {
      window.location.href = 'index.html'; // Redirigir al login
    } else if (document.getElementById('login-section')) {
      document.getElementById('login-section').classList.remove('hidden');
      document.getElementById('dashboard-section').classList.add('hidden');
    }
  }
});

// Función de Login (para index.html)
if(document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    try {
      await auth.signInWithEmailAndPassword(email, pass);
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  });
}

// Función de Logout
function logout() {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
}