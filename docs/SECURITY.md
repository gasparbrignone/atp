# SECURITY.md

# Seguridad

## Objetivo

El Portal ATP almacenará información interna de la agrupación.

Toda funcionalidad deberá diseñarse bajo el principio de **mínimo privilegio**, garantizando que cada usuario únicamente pueda acceder a la información necesaria para desempeñar su rol.

La seguridad tiene prioridad sobre la comodidad cuando exista conflicto entre ambas.

---

# Principios

Toda decisión relacionada con seguridad deberá respetar los siguientes principios:

- Autenticación obligatoria.
- Autorización basada en roles.
- Validación tanto en cliente como en servidor.
- Mínima exposición de datos.
- Auditoría de acciones importantes.
- Protección frente a errores humanos.

---

# Autenticación

La autenticación será gestionada mediante Firebase Authentication.

No se implementará un sistema propio de autenticación.

El sistema deberá permitir:

- inicio de sesión;
- cierre de sesión;
- recuperación de contraseña;
- cambio de contraseña;
- persistencia de sesión.

Nunca almacenar contraseñas en Firestore.

---

# Usuarios

Cada usuario tendrá:

- UID de Firebase.
- Perfil en Firestore.
- Rol.
- Estado.

El UID será la única identidad válida dentro del sistema.

Nunca utilizar correo electrónico o nombre como identificador principal.

---

# Autorización

Todos los permisos estarán definidos por el rol del usuario.

El frontend nunca deberá asumir permisos.

Toda operación sensible deberá validarse mediante reglas de Firestore y, cuando corresponda, Cloud Functions.

---

# Roles

Roles permitidos:

- admin
- coordinator
- member

No crear permisos ad hoc.

Toda ampliación deberá realizarse mediante nuevos roles claramente definidos.

---

# Firestore Rules

Toda colección deberá tener reglas explícitas.

Nunca utilizar reglas abiertas como:

allow read, write: if true

o equivalentes.

El acceso deberá concederse únicamente cuando exista una justificación funcional.

---

# Datos sensibles

Se consideran datos sensibles:

- actas de reuniones;
- tareas internas;
- calendario privado;
- información de usuarios;
- configuraciones;
- credenciales compartidas.

Toda lectura deberá estar protegida.

---

# Variables de entorno

Toda información confidencial deberá almacenarse en variables de entorno.

Nunca subir:

API Keys

Secrets

Tokens

Credenciales

Archivos `.env`

al repositorio.

---

# Validaciones

Toda escritura deberá validar:

- formato;
- permisos;
- consistencia;
- existencia de referencias.

Nunca confiar únicamente en las validaciones del cliente.

---

# Cloud Functions

Las operaciones críticas deberán ejecutarse mediante Cloud Functions.

Ejemplos:

- envío de correos;
- tareas programadas;
- procesos automáticos;
- operaciones administrativas.

Evitar exponer lógica sensible en el cliente.

---

# Auditoría

Las acciones importantes deberán registrar:

usuario;

fecha;

acción realizada.

Ejemplos:

- eliminación;
- cambio de permisos;
- modificación de configuraciones;
- creación de administradores.

---

# Soft Delete

Siempre que sea posible utilizar eliminación lógica.

Campos sugeridos:

deleted

deletedAt

deletedBy

Evitar la eliminación física de información importante.

---

# Archivos

Todo archivo subido al sistema deberá:

tener reglas de acceso;

validar tamaño;

validar tipo;

tener propietario.

---

# Correos electrónicos

Los correos automáticos deberán enviarse únicamente desde Cloud Functions.

Nunca exponer servicios SMTP en el frontend.

---

# Contraseñas compartidas

Las credenciales compartidas representan un caso especial.

Principios:

- acceso únicamente para usuarios autorizados;
- almacenamiento cifrado;
- auditoría de visualización;
- posibilidad de rotación;
- posibilidad de revocación.

Nunca almacenar contraseñas en texto plano.

---

# Logs

No registrar información sensible en:

console.log

errores visibles

mensajes al usuario

Evitar mostrar detalles técnicos.

---

# Errores

Los mensajes de error deben ser comprensibles.

Nunca revelar:

estructura interna;

consultas;

IDs internos;

información sensible.

---

# Rate Limiting

Toda operación susceptible de abuso deberá contemplar limitación de frecuencia cuando sea posible.

Ejemplos:

- recuperación de contraseña;
- creación de usuarios;
- envío de correos.

---

# Sesiones

Cerrar correctamente la sesión.

Eliminar información sensible del estado de la aplicación al cerrar sesión.

---

# Dependencias

Mantener las dependencias actualizadas.

Evitar librerías sin mantenimiento.

Eliminar dependencias no utilizadas.

---

# Principio de mínimo privilegio

Todo usuario deberá tener únicamente los permisos estrictamente necesarios.

Nunca otorgar permisos "por las dudas".

---

# Respaldo

La información crítica deberá poder recuperarse ante errores.

Se recomienda realizar exportaciones periódicas de Firestore.

---

# Seguridad futura

El diseño deberá permitir incorporar posteriormente:

- autenticación multifactor;
- registro de dispositivos;
- auditoría avanzada;
- alertas de seguridad;
- historial completo de accesos.

La arquitectura no deberá impedir estas mejoras.

---

# Regla principal

Toda nueva funcionalidad deberá responder a la siguiente pregunta:

¿Esta implementación expone más información de la necesaria?

Si la respuesta es sí, deberá rediseñarse antes de implementarse.
