const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace imports
  content = content.replace(/import\s+\{([^}]*)\}\s+from\s+["']@tanstack\/react-router["']/g, (match, imports) => {
    // Keep Link and useNavigate/useRouter, change to react-router-dom
    let newImports = imports
      .replace(/createFileRoute,?\s*/, '')
      .replace(/useRouter,?\s*/, 'useNavigate, ')
      .trim();
    if (newImports.endsWith(',')) newImports = newImports.slice(0, -1);
    if (newImports.length > 0) {
      return `import { ${newImports} } from "react-router-dom"`;
    }
    return '';
  });

  // Remove Route definition
  content = content.replace(/export\s+const\s+Route\s*=\s*createFileRoute\([^)]*\)\({\s*component:\s*([a-zA-Z0-9_]+),?\s*}\);?/g, '');
  
  // Make main function default export
  content = content.replace(/function\s+(Landing|AuthPage|Dashboard|Diet|Interactions|Medicine|Remedies|Symptoms)\s*\(/g, 'export default function $1(');

  // Fix router.navigate -> navigate
  content = content.replace(/const\s+router\s*=\s*useRouter\(\)/g, 'const navigate = useNavigate()');
  content = content.replace(/router\.navigate\(\{\s*to:\s*(['"`][^'"`]+['"`])\s*\}\)/g, 'navigate($1)');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${filePath}`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === '__root.tsx' || file.includes('.old.')) continue;
    
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(routesDir);
