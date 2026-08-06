const fs = require('fs');
const path = 'e:/punarmilamApp/PunarmilanNew/punarmilan-frontend/src/pages/myshadi/services/SpecialServices.jsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Add import statement
content = content.replace(
    "import api from '../../../services/api';",
    "import api from '../../../services/api';\nimport heroImage from '../../../assets/image/couples1.jpg';"
);

// 2. Replace image source
content = content.replace(
    'src="https://images.unsplash.com/photo-1583089892943-e02e52f17094?auto=format&fit=crop&q=80&w=800"',
    'src={heroImage}'
);

fs.writeFileSync(path, content);
console.log('Fixed image in SpecialServices.jsx');
