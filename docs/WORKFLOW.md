# WORKFLOW.md

# Flujo de trabajo para el desarrollo

## Objetivo

Este documento define el proceso obligatorio que debe seguirse durante el desarrollo del Portal ATP.

El objetivo es mantener un desarrollo ordenado, incremental y con la menor cantidad posible de retrabajo.

La prioridad es construir una base sólida antes de incorporar nuevas funcionalidades.

---

# Principios generales

Todo el desarrollo deberá respetar los siguientes principios:

- comprender antes de modificar;
- planificar antes de implementar;
- implementar antes de optimizar;
- validar antes de finalizar;
- documentar antes de continuar.

Nunca avanzar directamente al código sin entender completamente el problema.

---

# Antes de comenzar una tarea

Antes de escribir cualquier línea de código se deberá:

1. Leer la documentación relevante dentro de `/docs`.
2. Comprender el objetivo funcional.
3. Revisar la arquitectura existente.
4. Identificar componentes reutilizables.
5. Detectar posibles impactos sobre otros módulos.

Si existe alguna ambigüedad, deberá aclararse antes de implementar.

---

# Planificación

Antes de desarrollar una funcionalidad nueva se deberá elaborar un plan técnico.

El plan deberá responder:

- ¿Qué problema se resuelve?
- ¿Qué módulos intervienen?
- ¿Qué componentes nuevos serán necesarios?
- ¿Qué componentes existentes podrán reutilizarse?
- ¿Qué cambios en la base de datos serán necesarios?
- ¿Existen riesgos o dependencias?

Solo después de validar el plan deberá comenzar la implementación.

---

# Implementación incremental

Las funcionalidades deberán desarrollarse en pequeñas etapas.

Nunca intentar desarrollar un módulo completo en una sola sesión.

Ejemplo:

Autenticación

↓

Dashboard

↓

Mesita

↓

Reuniones

↓

Calendario

↓

Tareas

↓

Notificaciones

↓

Administración

Cada etapa deberá quedar completamente funcional antes de continuar.

---

# Alcance de cada sesión

Cada sesión debe enfocarse en un único objetivo principal.

Ejemplos:

- Implementar autenticación.
- Crear el layout principal.
- Construir el Dashboard.
- Implementar la vista semanal de Mesita.

Evitar mezclar múltiples funcionalidades sin relación.

---

# Reutilización

Antes de crear cualquier elemento nuevo se deberá verificar si ya existe uno reutilizable.

Esto aplica a:

- componentes;
- hooks;
- servicios;
- tipos;
- validaciones;
- utilidades.

La reutilización siempre tiene prioridad sobre la duplicación.

---

# Cambios de arquitectura

No modificar la arquitectura existente salvo que exista una razón técnica clara.

Toda modificación arquitectónica deberá:

- justificarse;
- documentarse;
- minimizar el impacto sobre módulos existentes.

---

# Refactorización

Las refactorizaciones deberán ser pequeñas y controladas.

No realizar refactorizaciones masivas mientras se desarrolla una funcionalidad.

Solo refactorizar cuando:

- mejore claramente el código;
- reduzca complejidad;
- no introduzca riesgos.

---

# Validaciones

Antes de finalizar cualquier tarea verificar:

- funcionamiento;
- tipado;
- responsive;
- accesibilidad;
- manejo de errores;
- estados vacíos;
- estados de carga.

Una funcionalidad no estará terminada hasta completar esta revisión.

---

# Documentación

Si una implementación modifica el comportamiento esperado del sistema deberá actualizarse inmediatamente la documentación correspondiente.

La documentación nunca debe quedar desactualizada respecto al código.

---

# Calidad

Antes de considerar terminada una funcionalidad verificar:

- ¿Es realmente simple?
- ¿Puede entenderse rápidamente?
- ¿Existe código duplicado?
- ¿Se reutilizaron componentes?
- ¿Respeta el Design System?
- ¿Respeta la arquitectura?

Si alguna respuesta es negativa, revisar la implementación.

---

# Performance

Optimizar únicamente cuando exista una necesidad real.

No introducir complejidad para resolver problemas inexistentes.

La legibilidad tiene prioridad sobre las microoptimizaciones.

---

# Dependencias

Antes de instalar una nueva dependencia responder:

- ¿Ya existe una solución en el proyecto?
- ¿React lo resuelve?
- ¿La nueva librería aporta un beneficio real?

Evitar aumentar innecesariamente el número de dependencias.

---

# Manejo de errores

Toda operación asíncrona deberá contemplar:

- loading;
- éxito;
- error;
- reintento cuando corresponda.

Nunca dejar estados indefinidos.

---

# Revisión final

Antes de cerrar una tarea realizar una revisión completa.

Checklist:

- Compila correctamente.
- Sin errores de TypeScript.
- Sin advertencias importantes.
- Responsive.
- Accesible.
- Código consistente.
- Documentación actualizada.

---

# Si aparece un problema inesperado

Cuando durante una implementación aparezca un problema no previsto:

1. Detener la implementación.
2. Analizar la causa.
3. Evaluar alternativas.
4. Elegir la solución más simple.
5. Documentar la decisión si afecta a la arquitectura.

Evitar soluciones rápidas que generen deuda técnica.

---

# Prioridad de decisiones

Cuando existan varias alternativas, seguir este orden de prioridad:

1. Correctitud.
2. Seguridad.
3. Simplicidad.
4. Mantenibilidad.
5. Reutilización.
6. Rendimiento.
7. Optimización.

---

# Finalización de una funcionalidad

Una funcionalidad solo podrá considerarse terminada cuando:

- cumpla todos los requisitos funcionales;
- respete la arquitectura;
- utilice componentes reutilizables;
- mantenga consistencia visual;
- funcione correctamente en dispositivos móviles;
- contemple estados de error y carga;
- tenga documentación actualizada.

---

# Regla principal

Desarrollar el Portal ATP como si fuera un producto que deberá mantenerse y evolucionar durante muchos años.

Cada decisión debe favorecer un código claro, modular y fácil de ampliar.
