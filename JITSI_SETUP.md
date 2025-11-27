# Guía de Configuración - Jitsi JaaS

Esta documentación detalla la configuración necesaria para implementar Jitsi JaaS en tu aplicación.

## 📋 Tabla de Contenidos

1. [Obtener Credenciales de JaaS](#obtener-credenciales-de-jaas)
2. [Configuración del Dominio Host](#configuración-del-dominio-host)
3. [Variables de Entorno](#variables-de-entorno)
4. [Verificar la Integración](#verificar-la-integración)
5. [Solución de Problemas](#solución-de-problemas)

---

## 1. Obtener Credenciales de JaaS

### Paso 1: Crear Cuenta en Jitsi JaaS

1. Ve a [https://jaas.8x8.vc/](https://jaas.8x8.vc/)
2. Regístrate o inicia sesión con tu cuenta
3. Si es tu primera vez, selecciona el **plan Free** (hasta 25 participantes)

### Paso 2: Crear un Nuevo Proyecto

1. En el dashboard, haz clic en **"Create New App"** o **"New Project"**
2. Asigna un nombre a tu proyecto (ej: "Oficina Virtual")
3. El sistema generará automáticamente tu **APP_ID**

### Paso 3: Copiar el APP_ID

Tu `APP_ID` tendrá un formato similar a:
```
vpaas-magic-cookie-abc123def456789
```

> [!IMPORTANT]
> **Guarda este APP_ID de forma segura. Lo necesitarás para la configuración.**

---

## 2. Configuración del Dominio Host

Cuando el panel de Jitsi JaaS te pida el **"Domain Host"** o **"Allowed Domains"**, debes configurarlo según tu entorno:

### Desarrollo Local

Para pruebas locales en tu máquina:
```
localhost
```

O si especifica puerto:
```
http://localhost:5173
```

> [!NOTE]
> **Nota**: El puerto `5173` es el puerto por defecto de Vite. Si usas otro puerto, ajústalo.

### Producción

Para tu aplicación en producción, ingresa el dominio donde se alojará:

**Ejemplos:**
- Si usas Netlify: `tuapp.netlify.app` o tu dominio personalizado
- Si usas Vercel: `tuapp.vercel.app` o tu dominio personalizado
- Dominio propio: `app.miempresa.com`

> [!WARNING]
> **Importante para Producción:**
> - **NO** incluyas el protocolo (`https://`)
> - JaaS requiere **HTTPS** en producción (Netlify/Vercel lo proveen automáticamente)
> - Puedes agregar múltiples dominios separados por comas

---

## 3. Variables de Entorno

### Archivo `.env`

Ya existe un archivo `.env` en la raíz del proyecto. Ábrelo y reemplaza el valor de `VITE_JAAS_APP_ID`:

```env
VITE_JAAS_APP_ID=vpaas-magic-cookie-abc123def456789
```

Sustituye `vpaas-magic-cookie-abc123def456789` con tu APP_ID real.

### Archivo `.env.example`

El archivo `.env.example` sirve como plantilla. **NO modifiques este archivo**, solo el `.env`.

### Seguridad

> [!CAUTION]
> **NUNCA subas el archivo `.env` a repositorios públicos.**
> 
> El archivo `.gitignore` ya está configurado para ignorar `.env`, pero siempre verifica antes de hacer commit.

---

## 4. Verificar la Integración

### Paso 1: Reiniciar el Servidor de Desarrollo

Después de configurar las variables de entorno, reinicia el servidor:

```powershell
# Detener el servidor actual (Ctrl + C)
# Luego iniciar nuevamente:
npm run dev
```

### Paso 2: Probar la Funcionalidad

1. **Navega a la aplicación** en tu navegador (`http://localhost:5173`)

2. **Verifica el botón de videoconferencia:**
   - Por defecto, el botón estará **deshabilitado** (gris)
   - Tooltip debe mostrar: *"Necesitas 2+ personas para iniciar videoconferencia"*

3. **Simular 2+ usuarios:**

   Para probar, necesitas editar temporalmente el estado de usuarios en [`Home.tsx`](file:///c:/Users/villa/Documents/Simulator-Kumospace/src/pages/Home.tsx):

   - Busca la línea ~52 donde se define el array `users`
   - Cambia el `currentLocation` de al menos un usuario al mismo workspace donde estás
   
   **Ejemplo:**
   ```tsx
   {
     id: '1',
     name: 'María González',
     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
     status: 'online',
     currentLocation: 'private-current', // ← Cambiar a 'private-current' o tu workspace actual
     locationType: 'shared'
   }
   ```

4. **Hacer clic en el botón de videoconferencia:**
   - El botón debe activarse (color verde)
   - Debe aparecer el overlay de Jitsi
   - Debes ver la interfaz de la videollamada cargándose

5. **Probar controles:**
   - Activar/desactivar micrófono dentro de Jitsi
   - Activar/desactivar cámara dentro de Jitsi
   - Minimizar/maximizar la ventana de Jitsi
   - Cerrar la videollamada (botón X)

---

## 5. Solución de Problemas

### Error: "No se pudo iniciar la videoconferencia"

**Posibles causas:**
1. **APP_ID incorrecto** - Verifica que el APP_ID en `.env` sea correcto
2. **Dominio no autorizado** - Asegúrate de haber agregado `localhost` en la configuración de JaaS
3. **Servidor no reiniciado** - Reinicia el servidor después de cambiar `.env`

**Solución:**
```powershell
# 1. Verificar el archivo .env
cat .env

# 2. Reiniciar el servidor
npm run dev
```

### El botón no se habilita

**Causa:**
- No hay 2+ usuarios en el workspace actual

**Solución:**
- Edita el array `users` en `Home.tsx` para tener usuarios en el mismo `currentLocation`

### La videollanade no carga

**Posibles causas:**
1. **Bloqueador de scripts** - Algunos bloqueadores de anuncios bloquean el script de Jitsi
2. **Problema de red** - Verifica tu conexión a internet
3. **Dominio no autorizado en JaaS**

**Solución:**
1. Deshabilita temporalmente bloqueadores de anuncios
2. Verifica la consola del navegador (F12) para errores específicos
3. Revisa la configuración de dominios permitidos en el panel de JaaS

### Error de CORS en producción

**Causa:**
- El dominio de producción no está agregado en la configuración de JaaS

**Solución:**
1. Ve al panel de JaaS
2. Agrega el dominio de producción a la lista de dominios permitidos
3. Espera unos minutos para que los cambios se propaguen

---

## Información Adicional

### Límites del Plan Free

- **Participantes simultáneos**: 25 en total (no por sala)
- **Duración**: Sin límite de tiempo
- **Grabaciones**: No disponible en plan free
- **Marca de agua**: Incluye marca de agua de Jitsi
- **Soporte**: Soporte comunitario

### Actualizar a Plan Pago

Si necesitas más participantes o funciones adicionales:
1. Ve a [https://jaas.8x8.vc/](https://jaas.8x8.vc/)
2. Selecciona tu proyecto
3. Haz clic en "Upgrade Plan"
4. Elige el plan que se ajuste a tus necesidades

### Próximos Pasos

- [ ] Implementar sincronización en tiempo real para usuarios (WebSocket/Firebase)
- [ ] Agregar notificaciones cuando alguien inicia una videollamada
- [ ] Permitir invitaciones directas a videollamadas
- [ ] Integrar grabación de llamadas (requiere plan pago)
- [ ] Personalizar la interfaz de Jitsi con tu branding

---

**¿Tienes preguntas?**
Consulta la [documentación oficial de Jitsi JaaS](https://developer.8x8.com/jaas/docs) para más información.
