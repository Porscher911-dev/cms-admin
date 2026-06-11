const fs = require('fs');
const path = require('path');

const viJsonPath = path.join(__dirname, 'src', 'i18n', 'vi.json');
const enJsonPath = path.join(__dirname, 'src', 'i18n', 'en.json');
const srcDir = path.join(__dirname, 'src');

const viData = JSON.parse(fs.readFileSync(viJsonPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

// Regex to match t("namespace.key") or t('namespace.key') or t(\`namespace.key\`)
const tRegex = /t\(['"\`]?([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)['"\`]?\)/g;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      callback(path.join(dir, f));
    }
  });
}

const missingKeys = {};

walkDir(srcDir, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  while ((match = tRegex.exec(content)) !== null) {
    const namespace = match[1];
    const key = match[2];
    
    if (!viData[namespace]) {
      viData[namespace] = {};
      enData[namespace] = {};
    }
    
    if (viData[namespace][key] === undefined) {
      viData[namespace][key] = `${namespace}.${key}`;
      enData[namespace][key] = `${namespace}.${key}`;
      
      if (!missingKeys[namespace]) missingKeys[namespace] = [];
      if (!missingKeys[namespace].includes(key)) {
        missingKeys[namespace].push(key);
      }
    }
  }
});

fs.writeFileSync(viJsonPath, JSON.stringify(viData, null, 2), 'utf8');
fs.writeFileSync(enJsonPath, JSON.stringify(enData, null, 2), 'utf8');

console.log("Missing keys found and added:", missingKeys);
