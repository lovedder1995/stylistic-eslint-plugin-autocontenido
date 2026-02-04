const plugin = require('./dist/index.js');

console.log('--- Verificación del Plugin Autocontenido ---');
console.log('Carga del módulo: OK');

// Intentar obtener el plugin real (manejando interop ESM/CJS si fuera necesario)
const actualPlugin = plugin.default || plugin;

// Verificar reglas
if (actualPlugin.rules) {
    const rules = Object.keys(actualPlugin.rules);
    console.log(`\n[Reglas]`);
    console.log(`  Total encontradas: ${rules.length}`);
    if (rules.length > 0) {
        console.log(`  Ejemplos: ${rules.slice(0, 5).join(', ')}...`);
    }
} else {
    console.error('\n[ERROR] No se encontró la propiedad "rules" en el plugin.');
    process.exit(1);
}

// Verificar configuraciones
if (actualPlugin.configs) {
    const configs = Object.keys(actualPlugin.configs);
    console.log(`\n[Configuraciones]`);
    console.log(`  Total encontradas: ${configs.length}`);
    console.log(`  Nombres: ${configs.join(', ')}`);
} else {
    console.log('\n[Nota] No se encontraron configuraciones (configs).');
}

// Verificar meta (opcional pero común)
if (actualPlugin.meta) {
    console.log(`\n[Meta]`);
    console.log(`  Nombre: ${actualPlugin.meta.name || 'N/A'}`);
    console.log(`  Versión: ${actualPlugin.meta.version || 'N/A'}`);
}

console.log('\n--- Verificación completada exitosamente ---');
