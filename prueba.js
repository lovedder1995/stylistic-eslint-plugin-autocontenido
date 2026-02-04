const plugin = require('./dist/index.js');

console.log('Plugin cargado exitosamente');
console.log('Exports:', Object.keys(plugin));

const actualPlugin = plugin.default || plugin;

if (actualPlugin.rules) {
    console.log('Reglas encontradas:', Object.keys(actualPlugin.rules).length);
    console.log('Ejemplo de regla:', Object.keys(actualPlugin.rules)[0]);
} else {
    console.error('No se encontraron reglas!');
    process.exit(1);
}

if (actualPlugin.configs) {
    console.log('Configuraciones encontradas:', Object.keys(actualPlugin.configs).length);
}
