let calendar;

document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'es',
    firstDay: 1, // Lunes
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today'
    },
    height: 'auto'
  });
  calendar.render();

  auth.onAuthStateChanged(user => {
    if(user) cargarEventos();
  });
});

async function cargarEventos() {
  try {
    const snapshot = await db.ref('eventos').once('value');
    const data = snapshot.val();
    const eventos = [];
    
    if (data) {
      Object.keys(data).forEach(key => {
        const ev = data[key];
        eventos.push({
          id: key,
          title: ev.titulo,
          start: ev.fecha,
          color: ev.tipo === 'reunion' ? '#E91E8C' : '#0A2463'
        });
      });
    }
    calendar.removeAllEvents();
    calendar.addEventSource(eventos);
  } catch (error) {
    console.error("Error cargando eventos:", error);
  }
}

function abrirModalEvento() {
  document.getElementById('evento-modal').classList.remove('hidden');
}

function cerrarModalEvento() {
  document.getElementById('evento-modal').classList.add('hidden');
  document.getElementById('evento-form').reset();
}

document.getElementById('evento-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('ev-titulo').value;
  const fecha = document.getElementById('ev-fecha').value;
  const tipo = document.getElementById('ev-tipo').value;

  try {
    await db.ref('eventos').push({
      titulo, fecha, tipo,
      creadoPor: auth.currentUser.uid,
      creadoEl: firebase.database.ServerValue.TIMESTAMP
    });
    cerrarModalEvento();
    cargarEventos(); 
  } catch (error) {
    alert("Error al guardar el evento.");
  }
});