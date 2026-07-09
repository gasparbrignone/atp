let actasGlobal = [];

document.addEventListener('DOMContentLoaded', async () => {
  auth.onAuthStateChanged(async (user) => {
    if(user) cargarActas();
  });
});

async function cargarActas() {
  try {
    const snapshot = await db.ref('actas').orderByChild('fecha').once('value');
    const data = snapshot.val();
    actasGlobal = [];
    
    if (data) {
      Object.keys(data).forEach(key => {
        actasGlobal.push({ id: key, ...data[key] });
      });
      // Ordenar: la más reciente arriba
      actasGlobal.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }
    
    renderizarActas(actasGlobal);
  } catch (error) {
    console.error("Error obteniendo actas: ", error);
    document.getElementById('lista-actas').innerHTML = '<p style="color:red">Error al cargar el historial.</p>';
  }
}

function renderizarActas(actas) {
  const contenedor = document.getElementById('lista-actas');
  contenedor.innerHTML = '';

  if (actas.length === 0) {
    contenedor.innerHTML = '<p>No hay actas registradas.</p>';
    return;
  }

  actas.forEach(acta => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const listaPresentes = Array.isArray(acta.presentes) ? acta.presentes : [];
    const presentesResumen = listaPresentes.slice(0, 3).join(', ') + (listaPresentes.length > 3 ? '...' : '');
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 style="margin-bottom: 0.5rem;">Acta - ${acta.fecha}</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem;"><strong>Presentes:</strong> ${presentesResumen}</p>
          <p style="font-size: 0.9rem;"><strong>Próxima reunión:</strong> ${acta.proximaReunion || 'No definida'}</p>
        </div>
        <button class="btn btn-outline" style="padding: 6px 12px; min-height: auto;" onclick="verDetalle('${acta.id}')">Ver Detalle</button>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function verDetalle(id) {
  const acta = actasGlobal.find(a => a.id === id);
  if(!acta) return;

  document.getElementById('modal-fecha').innerText = `Acta - ${acta.fecha}`;
  
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <p><strong>Presentes:</strong> ${Array.isArray(acta.presentes) ? acta.presentes.join(', ') : '-'}</p>
    <p><strong>Ausentes:</strong> ${Array.isArray(acta.ausentes) ? acta.ausentes.join(', ') : '-'}</p>
    <hr style="margin: 1rem 0; border: 0; border-top: 1px solid #eee;">
    <p><strong>Laburo de la semana:</strong>\n${acta.laburoSemana}</p>
    <br>
    <p><strong>Temas Discutidos:</strong>\n${acta.temasDiscutidos}</p>
    <br>
    <p><strong>Decisiones Tomadas:</strong>\n${acta.decisionesTomadas}</p>
    <br>
    <p><strong>Tareas Asignadas:</strong>\n${acta.tareasAsignadas}</p>
  `;

  document.getElementById('acta-modal').classList.remove('hidden');
}

function cerrarModal() {
  document.getElementById('acta-modal').classList.add('hidden');
}

document.getElementById('buscador').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtradas = actasGlobal.filter(acta => 
    (acta.temasDiscutidos && acta.temasDiscutidos.toLowerCase().includes(term)) || 
    (acta.decisionesTomadas && acta.decisionesTomadas.toLowerCase().includes(term)) ||
    (acta.fecha && acta.fecha.includes(term))
  );
  renderizarActas(filtradas);
});