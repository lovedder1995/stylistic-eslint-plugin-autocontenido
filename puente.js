const plugin = require('@stylistic/eslint-plugin');

// Obtenemos el objeto real del plugin (sea default export o module.exports)
const actual = plugin.default || plugin;

// Creamos el objeto final a exportar
const finalExport = {
    ...actual
};

// Aseguramos compatibilidad con ESM cuando esbuild agrega __esModule: true
// Node.js leerá module.exports.default como el "default import"
finalExport.default = finalExport;

module.exports = finalExport;
