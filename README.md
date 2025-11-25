<figure align="center">
  <img src="public/icon.png" alt="Icono Velox" width="350" />
</figure>

# Velox

**¡Bienvenido al repositorio de Velox!**

Proyecto de aula para medir velocidad de red usando la librería @m-lab/ndt7.
Incluye integración con workers (download/upload), tipos TypeScript, y guards para validar mensajes.

## Contenido
- src/ — código fuente (React + TypeScript)
  - hooks/useNdt7.ts — hook para ejecutar pruebas NDT7
  - guards/ndt7.guard.ts — type guards para validar mensajes
  - types/ndt7.d.ts — definiciones de tipos y declaración del módulo `@m-lab/ndt7`
- public/ — archivos estáticos, aquí **deben** ir los workers ndt7 (ndt7-*.js)

## Requisitos
- Node.js 16+ (o LTS compatible)
- npm / pnpm / yarn

## Instalación
```bash
# desde la raíz del proyecto
npm install
```

## Desarrollo
```bash
npm run dev
```
- Abre http://localhost:5173 (o la URL que informe Vite).
- Asegúrate de que los archivos worker (ndt7-download-worker.min.js, ndt7-upload-worker.min.js) estén en `public/` para que sean servidos correctamente.

## Construcción
```bash
npm run build
npm run preview   # para ver la build estática localmente
```

## Tipos y integraciones importantes
- Agregué `src/types/ndt7.d.ts` con los tipos principales (TCPInfo, ClientMeasurementMsg, ServerMeasurementMsg, Ndt7Message).
- Usa `src/guards/ndt7.guard.ts` para validar los mensajes recibidos desde los workers antes de acceder a sus propiedades — evita errores de runtime.

## Depuración
- Si el navegador reporta `Unexpected token '<'` al cargar un worker, revisa la pestaña Network: la ruta del worker está devolviendo HTML (SPA fallback). Mueve el worker a `public/` y referencia con una ruta absoluta o relativa correcta.

## Créditos
- Basado en el ejemplo de Nikhil A. Digaz en Medium y la librería `@m-lab/ndt7` (Measurement Lab).
Fuente: https://medium.com/@nikhiladigaz/measure-your-internet-speed-programmatically-aad49f3f4738
