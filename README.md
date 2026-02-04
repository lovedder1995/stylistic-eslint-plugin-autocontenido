# @stylistic/eslint-plugin Autocontenido

Este proyecto compila una versión autocontenida de `@stylistic/eslint-plugin` utilizando exclusivamente dependencias de desarrollo.

## Filosofía del Proyecto

*   **Solo dependencias de desarrollo**: El plugin y `esbuild` se instalan como `devDependencies`.
*   **Compilación Autocontenida**: Usamos `esbuild` para empaquetar todo el código en un único archivo, eliminando la necesidad de `node_modules` en tiempo de ejecución para el paquete final.
*   **Integración Transparente**: Las dependencias se integran directamente en el bundle.
*   **Reemplazo Directo**: Configurado para funcionar como un reemplazo directo del paquete estándar.

## Requisitos Previos

*   Node.js instalado (v18+ recomendado).
*   Estar en la raíz del proyecto.
*   Instalar dependencias (en modo desarrollo):

```bash
npm install
```

## Pasos de Compilación

Para compilar el proyecto, utiliza el script automatizado que hemos preparado. Este script se encarga de empaquetar todas las dependencias y aplicar parches necesarios para la compatibilidad CommonJS/ESM.

```bash
node compilar.js
```

El script `compilar.js` toma `puente.js` como entrada y genera `dist/index.js`.

## Configuración del Paquete (package.json)

Este paquete ya está configurado para funcionar como un reemplazo directo:

```json
{
  "main": "./dist/index.js",
  "exports": {
    ".": "./dist/index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

## Verificación

Puedes verificar que el paquete compilado funciona correctamente ejecutando el script de prueba incluido:

```bash
node prueba.js
```

## Instalación

```bash
npm install --save-dev github:lovedder1995/stylistic-eslint-plugin-autocontenido#{última.fecha.de.publicación}
```
