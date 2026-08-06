const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(process.cwd(), 'index.html');
let content = fs.readFileSync(indexHtmlPath, 'utf8');

const scriptRegex = /<!-- Anti-Inspect Security Script -->\s*<script>[\s\S]*?<\/script>/;
if (scriptRegex.test(content)) {
  content = content.replace(scriptRegex, '');
  fs.writeFileSync(indexHtmlPath, content, 'utf8');
  console.log('Removed Anti-Inspect Security Script');
} else {
  console.log('Anti-Inspect Security Script not found');
}
