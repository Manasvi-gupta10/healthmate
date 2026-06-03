const fs = require('fs');
const path = require('path');

function fixFile(file, componentName) {
  const filePath = path.join(__dirname, 'src', 'routes', '_authenticated', file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace createFileRoute
  content = content.replace(/export\s+const\s+Route\s*=\s*createFileRoute\([^)]*\)\({\s*component:\s*\(\)\s*=>\s*\{/g, `export default function ${componentName}() {`);
  content = content.replace(/\},\s*\}\);?\s*$/g, '}');

  // Clean up unused imports
  content = content.replace(/import\s*\{\s*createFileRoute\s*\}\s*from\s*['"]@tanstack\/react-router['"];?/g, '');
  
  // Remove standalone semicolons that might have been left over
  content = content.replace(/^;\s*$/gm, '');

  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log('Fixed', file);
}

fixFile('diet.tsx', 'Diet');
fixFile('interactions.tsx', 'Interactions');
fixFile('medicine.tsx', 'Medicine');
fixFile('remedies.tsx', 'Remedies');
fixFile('symptoms.tsx', 'Symptoms');
