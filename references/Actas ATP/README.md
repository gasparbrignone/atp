# Sistema de Gestión de Actas - ATP

Plataforma mobile-first diseñada en Vanilla JS, HTML5 y CSS3 para el manejo de actas y calendario de la agrupación. Sin dependencias locales, todo corre vía CDN.

## 🚀 Instalación y Configuración

1. **Configurar Firebase:**
   - Ve a [Firebase Console](https://console.firebase.google.com/) y crea un nuevo proyecto.
   - Entra a "Authentication" y habilita el proveedor de **Correo electrónico/Contraseña**.
   - Entra a "Firestore Database", crea una base de datos en modo producción.
   - En la configuración de tu proyecto (rueda dentada), registra una app web `</>`.
   - Copia el objeto `firebaseConfig` que te da Firebase y pégalo en el archivo `firebase-config.js` de este proyecto.

2. **Reglas de Seguridad en Firestore:**
   Ve a la pestaña "Reglas" en Firestore y pega esto para asegurar que solo la agrupación acceda:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }