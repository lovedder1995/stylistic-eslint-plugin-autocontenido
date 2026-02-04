const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Plugin para reemplazar __require("...") por require("...") en @stylistic/eslint-plugin
// Esto permite que esbuild detecte las dependencias ocultas y las empaquete.
const replaceRequirePlugin = {
    name: 'replace-require',
    setup(build) {
        build.onLoad({ filter: /vendor\.js$/ }, async (args) => {
            console.log(`[Plugin] Procesando: ${args.path}`);
            let contents = await fs.promises.readFile(args.path, 'utf8');
            
            // Buscamos patrones como __require("@eslint-community/eslint-utils")
            const regex = /__require\("([^"]+)"\)/g;
            if (regex.test(contents)) {
                console.log(`[Plugin] Parcheando imports en: ${path.basename(args.path)}`);
                contents = contents.replace(regex, 'require("$1")');
            }
            
            return { contents, loader: 'js' };
        });
    },
};

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
            minify: false, // Keep it readable for now, or true for smaller size
            plugins: [replaceRequirePlugin],
            // external: [], // No externals, we want self-contained
        });
        
        console.log('Post-procesando...');
        let code = fs.readFileSync('dist/index.js', 'utf8');
        
        // Reemplazo manual de import.meta.url si quedó algo
        if (code.includes('import.meta.url')) {
             console.log('Reemplazando import.meta.url residual...');
             code = code.replace(/import\.meta\.url/g, 'require("url").pathToFileURL(__filename).toString()');
        }

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
