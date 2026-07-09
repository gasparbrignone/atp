document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fecha').valueAsDate = new Date();
    const borrador = localStorage.getItem('acta_borrador');
    if (borrador) {
        const data = JSON.parse(borrador);
        Object.keys(data).forEach(key => {
            if(document.getElementById(key)) document.getElementById(key).value = data[key];
        });
    }
});

function obtenerDatosFormulario() {
    return {
        fecha: document.getElementById('fecha').value,
        presentes: document.getElementById('presentes').value.split('\n').filter(Boolean),
        ausentes: document.getElementById('ausentes').value.split('\n').filter(Boolean),
        laburoSemana: document.getElementById('laburoSemana').value,
        pendientes: document.getElementById('pendientes').value,
        temasDiscutidos: document.getElementById('temasDiscutidos').value,
        decisionesTomadas: document.getElementById('decisionesTomadas').value,
        tareasAsignadas: document.getElementById('tareasAsignadas').value,
        proximaReunion: document.getElementById('proximaReunion').value,
        observaciones: document.getElementById('observaciones').value,
        creadoPor: auth.currentUser ? auth.currentUser.uid : 'anonimo',
        creadoEl: firebase.database.ServerValue.TIMESTAMP
    };
}

function guardarBorrador() {
    const data = obtenerDatosFormulario();
    delete data.creadoEl;
    localStorage.setItem('acta_borrador', JSON.stringify(data));
    alert('Borrador guardado localmente en tu dispositivo.');
}

document.getElementById('acta-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-guardar');
    btn.disabled = true;
    btn.innerText = 'Guardando...';

    const datos = obtenerDatosFormulario();

    try {
        await db.ref('actas').push(datos);
        localStorage.removeItem('acta_borrador');
        alert('✅ Acta guardada correctamente en el historial.');
        window.location.href = 'historial.html';
    } catch (error) {
        console.error("Error:", error);
        alert('❌ Error al guardar en la base de datos: ' + error.message);
        btn.disabled = false;
        btn.innerText = 'Guardar en Historial';
    }
});

async function generarYGuardarPDF() {
    if(!document.getElementById('acta-form').checkValidity()) {
        document.getElementById('acta-form').reportValidity();
        return;
    }
    
    const datos = obtenerDatosFormulario();

    try {
        await db.ref('actas').push(datos);
        localStorage.removeItem('acta_borrador');
    } catch (e) {
        console.warn("No se pudo guardar en la nube, pero generaremos el PDF igual.");
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(22);
    doc.setTextColor(233, 30, 140); 
    doc.text("ATP - Acta de Reunión", 20, y);
    y += 15;

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);

    const sections = [
        { t: "Fecha:", c: datos.fecha },
        { t: "Presentes:", c: datos.presentes.join(', ') },
        { t: "Ausentes:", c: datos.ausentes.join(', ') },
        { t: "Laburo de la Semana:", c: datos.laburoSemana },
        { t: "Temas Discutidos:", c: datos.temasDiscutidos },
        { t: "Decisiones:", c: datos.decisionesTomadas },
        { t: "Tareas:", c: datos.tareasAsignadas },
        { t: "Próxima Reunión:", c: datos.proximaReunion }
    ];

    sections.forEach(s => {
        doc.setFont("helvetica", "bold");
        doc.text(s.t, 20, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(s.c || "Sin datos", 170);
        doc.text(lines, 20, y);
        y += (lines.length * 6) + 5;
        if(y > 275) { doc.addPage(); y = 20; }
    });

    doc.save(`Acta_ATP_${datos.fecha}.pdf`);
    alert('✅ PDF generado y acta enviada.');
    window.location.href = 'historial.html';
}