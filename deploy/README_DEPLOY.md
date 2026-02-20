# Guía de Despliegue - JCR Motos

## 1. Configuración de la Base de Datos

1. Inicia sesión en el panel de control de tu hosting (cPanel, etc.).
2. Dirígete a **phpMyAdmin** o **Bases de Datos MySQL**.
3. Crea una nueva base de datos (ej. `mechanic_db`).
4. Importa el archivo `database.sql` ubicado en la raíz de este proyecto (o ejecuta los comandos SQL de tu `db.sql` local si los tienes).
   - *Nota: Asegúrate de que las tablas `users`, `motorcycles`, `maintenance_records`, `inventory` y `sales` existan. Si no tienes el archivo .sql completo, puedes generarlo exportándolo desde tu phpMyAdmin local.*

## 2. Configuración de la API

1. Abre el archivo `api/db_connect.php`.
2. Actualiza las credenciales para que coincidan con la base de datos de tu hosting:

   ```php
   $servername = "localhost";
   $username = "TU_USUARIO_BD";
   $password = "TU_CONTRASEÑA_BD";
   $dbname = "NOMBRE_DE_TU_BD";
   ```

## 3. Configuración del Frontend (¡Importante!)

Los archivos del frontend están optimizados. Sin embargo, si tu dominio NO es la raíz (ej. `tusitio.com/app` en lugar de `tusitio.com`), podrías necesitar ajustar las rutas base.

- Tal como está configurado actualmente, el sistema espera llamar a las APIs en `http://tudominio.com/jcr/api/` (o la ruta que hayas definido).
- **CRÍTICO**: La compilación actual apunta a `http://localhost/jcr/api/`.
- Para corregir esto para producción, deberías haber actualizado la URL base de la API en el código fuente antes de compilar.
- **Solución Rápida**: Como la compilación ya está hecha, es posible que necesites recompilar si la URL de la API está "quemada" (hardcoded).
  - Ve a `src/config.js` (si existe) o busca donde se hacen las llamadas `fetch`.
  - Cambia `http://localhost/jcr/api` por `/api` (ruta relativa) o tu dominio completo.
  - Vuelve a ejecutar `npm run build` en tu entorno local y sube los archivos de nuevo.

## 4. Subir Archivos

1. Sube todos los archivos **dentro** de la carpeta `deploy` a la carpeta `public_html` (o subcarpeta) de tu servidor.
   - El archivo `index.html` y la carpeta `assets` deben estar en el directorio al que accede el navegador.
   - La carpeta `api` debe ser accesible en `tudominio.com/api` (o la ruta correspondiente).

## 5. Permisos

- Asegúrate de que la carpeta `api/uploads` (si se usa para imágenes) tenga permisos de Escritura (755 o 777 dependiendo del hosting).

## 6. Pruebas

- Visita tu URL.
- Intenta iniciar sesión.
- Si las APIs fallan, abre las Herramientas de Desarrollador (F12) -> pestaña Red (Network) para ver si las URLs de las peticiones son correctas.


facnetco_jcr_db
facnetco_jcr
6PVu!7_M0h59-0tF
104.156.49.50