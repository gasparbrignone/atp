# CLAUDE.md

# Instrucciones para Claude Code

Este documento contiene las reglas de trabajo para el desarrollo del Portal ATP.

Todas las instrucciones aquí descritas tienen prioridad sobre preferencias por defecto, siempre que no entren en conflicto con requisitos técnicos o de seguridad.

---

# Objetivo principal

Construir un producto profesional, escalable y mantenible.

No desarrollar únicamente para que "funcione".

Cada decisión debe considerar la evolución del proyecto a largo plazo.

---

# Comprender antes de implementar

Nunca comenzar a escribir código inmediatamente.

Primero:

- comprender el problema;
- revisar la documentación correspondiente;
- analizar el impacto;
- proponer un plan cuando la tarea sea compleja.

---

# La documentación es la fuente de verdad

Antes de implementar cualquier funcionalidad consultar la documentación de `/docs`.

En caso de contradicción:

1. La documentación prevalece.
2. Si la documentación es insuficiente o inconsistente, detener la implementación y proponer una corrección antes de continuar.

Nunca inventar comportamiento que no esté definido cuando afecte la lógica del sistema.

---

# Prioridades

Al tomar decisiones técnicas respetar el siguiente orden:

1. Correctitud.
2. Seguridad.
3. Simplicidad.
4. Mantenibilidad.
5. Escalabilidad.
6. Consistencia.
7. Rendimiento.

Nunca sacrificar claridad únicamente para reducir algunas líneas de código.

---

# Filosofía de desarrollo

El Portal ATP deberá sentirse como un único producto.

No como una colección de herramientas independientes.

Cada módulo debe integrarse naturalmente con el resto del sistema.

---

# Arquitectura

Respetar estrictamente la arquitectura definida.

No introducir nuevos patrones arquitectónicos sin una razón técnica clara.

No crear estructuras paralelas.

---

# Componentes

Antes de crear un componente nuevo:

- revisar si ya existe uno similar;
- evaluar si puede generalizarse;
- evitar duplicación.

Preferir componentes reutilizables.

---

# Código

Todo el código deberá ser:

- legible;
- consistente;
- tipado;
- modular;
- fácil de mantener.

Nunca escribir código deliberadamente complejo.

---

# Firebase

Toda interacción con Firebase deberá pasar por la capa de servicios correspondiente.

No acceder directamente a Firestore desde componentes de interfaz.

---

# Base de datos

Respetar el modelo definido en `DATABASE.md`.

No modificar colecciones ni estructuras sin justificar la decisión.

---

# Diseño

Toda nueva interfaz deberá respetar `DESIGN_SYSTEM.md`.

No crear estilos específicos que rompan la consistencia visual.

---

# Mobile First

Todas las interfaces deberán diseñarse pensando primero en teléfonos móviles.

El escritorio será una adaptación.

No diseñar primero para pantallas grandes.

---

# Validaciones

Toda entrada del usuario deberá validarse.

No asumir nunca que la información recibida es correcta.

---

# Errores

Toda operación deberá contemplar:

- loading;
- éxito;
- error;
- ausencia de datos.

Nunca dejar estados indefinidos.

---

# Accesibilidad

Toda funcionalidad nueva deberá mantener un nivel básico de accesibilidad.

Evitar componentes difíciles de utilizar desde dispositivos móviles.

---

# Performance

Optimizar únicamente cuando exista evidencia de un problema real.

No introducir complejidad innecesaria.

---

# Dependencias

Antes de instalar una nueva librería responder:

- ¿Existe una solución con las herramientas actuales?
- ¿La dependencia realmente aporta valor?
- ¿Justifica aumentar el tamaño del proyecto?

Evitar instalar librerías innecesarias.

---

# Refactorización

Si durante una implementación detectas una mejora importante:

- explicar el problema;
- proponer la mejora;
- estimar el impacto.

No realizar refactorizaciones masivas sin aprobación.

---

# Cuando exista más de una solución

Si varias soluciones son técnicamente correctas:

- elegir la más simple;
- elegir la más mantenible;
- justificar brevemente la elección.

---

# Si detectas un problema de arquitectura

No ignorarlo.

Explicar:

- cuál es el problema;
- por qué puede generar dificultades;
- cuál sería la mejor alternativa;
- qué impacto tendría modificarlo.

---

# Si un requerimiento contradice la arquitectura

No improvisar.

Explicar el conflicto.

Proponer alternativas.

Esperar confirmación antes de modificar la arquitectura.

---

# Implementaciones grandes

Cuando una funcionalidad sea demasiado grande:

Dividirla en pequeñas tareas.

Implementarlas de forma incremental.

Verificar cada etapa antes de continuar.

---

# Finalización de tareas

Antes de considerar terminada una implementación verificar:

- compila correctamente;
- sin errores de TypeScript;
- responsive;
- accesible;
- consistente;
- reutilizable;
- correctamente documentada.

---

# Documentación

Cuando una implementación modifique:

- arquitectura;
- modelo de datos;
- comportamiento esperado;
- flujo de usuario;

actualizar inmediatamente la documentación correspondiente.

---

# Comunicación

Al finalizar cada tarea importante proporcionar un breve resumen que incluya:

- qué se implementó;
- archivos modificados;
- decisiones relevantes;
- posibles mejoras futuras.

Evitar resúmenes extensos.

---

# Lo que NO debe hacerse

No duplicar código.

No utilizar `any`.

No crear componentes gigantes.

No acceder directamente a Firebase desde la UI.

No hardcodear rutas.

No hardcodear roles.

No hardcodear nombres de colecciones.

No agregar dependencias sin justificación.

No romper el Design System.

No romper la arquitectura existente.

---

# Principio final

Cada línea de código debe escribirse pensando que este proyecto continuará creciendo durante muchos años.

La prioridad siempre será construir una base sólida, clara y mantenible antes que avanzar rápidamente.
