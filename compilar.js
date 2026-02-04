const esbuild = require('esbuild');
const fs = require('fs');

async function build() {
    console.log('Limpiando dist...');
    if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true });
    }

    console.log('Compilando...');
    try {
        await esbuild.build({
            entryPoints: ['puente.js'],
            outfile: 'dist/index.js',
            bundle: true,
            platform: 'node',
            target: 'node18',
            format: 'cjs',
            legalComments: 'none',
            minify: false, 
        });
        
        console.log('Post-procesando...');
        let code = fs.readFileSync('dist/index.js', 'utf8');
        
        // Corrección para createRequire(import.meta.url) -> createRequire(__filename)
        // Coincide con: (0, import_node_module.createRequire)(import_meta.url)
        // Usamos una expresión regular para capturar el nombre de la variable si es necesario,
        // pero un reemplazo simple funciona si apuntamos a la estructura.
        
        // Patrón: .createRequire)(ALGO.url)
        const regex = /\.createRequire\)\([^)]+\.url\)/g;
        
        if (regex.test(code)) {
            console.log('Aplicando parche para createRequire...');
            code = code.replace(regex, (match) => {
                return match.replace(/\([^)]+\.url\)/, '(__filename)');
            });
            fs.writeFileSync('dist/index.js', code);
        } else {
            console.warn('No se encontró el patrón createRequire(...) para parchar. Puede que no sea necesario o el código cambió.');
        }

        console.log('Compilación exitosa: dist/index.js');
    } catch (e) {
        console.error('Error en la compilación:', e);
        process.exit(1);
    }
}

build();
