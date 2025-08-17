const fs = require('fs');
const path = require('path');

console.log('🔒 Starting code obfuscation...');

// Function to obfuscate JavaScript
function obfuscateJS(code) {
    // Simple obfuscation techniques
    return code
        .replace(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, 'function _' + Math.random().toString(36).substr(2, 9) + '_$1(')
        .replace(/const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, 'const _' + Math.random().toString(36).substr(2, 9) + '_$1=')
        .replace(/let\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, 'let _' + Math.random().toString(36).substr(2, 9) + '_$1=')
        .replace(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, 'var _' + Math.random().toString(36).substr(2, 9) + '_$1=');
}

// Function to obfuscate HTML
function obfuscateHTML(code) {
    return code
        .replace(/class="([^"]*)"/g, (match, classes) => {
            // Randomize class names
            const newClasses = classes.split(' ').map(cls => 
                cls + '_' + Math.random().toString(36).substr(2, 5)
            ).join(' ');
            return `class="${newClasses}"`;
        })
        .replace(/id="([^"]*)"/g, (match, id) => {
            // Randomize IDs
            return `id="${id}_${Math.random().toString(36).substr(2, 5)}"`;
        });
}

// Process files
const filesToObfuscate = [
    'src/protection.js',
    'chat.js',
    'index.html',
    'about.html',
    'whatwedo.html',
    'contact.html'
];

filesToObfuscate.forEach(file => {
    if (fs.existsSync(file)) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            let obfuscated;
            
            if (file.endsWith('.js')) {
                obfuscated = obfuscateJS(content);
            } else if (file.endsWith('.html')) {
                obfuscated = obfuscateHTML(content);
            }
            
            if (obfuscated) {
                // Create obfuscated version
                const obfuscatedPath = file.replace(/\.(js|html)$/, '.obfuscated.$1');
                fs.writeFileSync(obfuscatedPath, obfuscated);
                console.log(`✅ Obfuscated: ${file} -> ${obfuscatedPath}`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
        }
    }
});

console.log('🔒 Code obfuscation completed!');
console.log('📝 Use obfuscated files for production deployment');
