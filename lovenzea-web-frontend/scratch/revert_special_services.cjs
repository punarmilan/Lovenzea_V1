const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'services', 'SpecialServices.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldSubmitLogic = `      const selectedPackage = dbPackages.find(p => p.name === formData.packageType) || dbPackages[0];
      const planId = selectedPackage?.id || 1;
      const price = selectedPackage?.rawPrice || getPackagePrice(formData.packageType);
      
      const { data: orderResponse } = await api.post(\`/payments/create-order/\${planId}\`).catch(async (err) => {
          console.warn('Order creation failed, falling back to dummy UI order');
          return await api.post(\`/payments/create-order/1\`);
      });`;

const newSubmitLogic = `      const price = getPackagePrice(formData.packageType);
      
      const { data: orderResponse } = await api.post('/payments/create-vip-order', {
          amount: price,
          packageType: formData.packageType
      }).catch(async (err) => {
          console.warn('VIP order endpoint missing, using fallback plan for UI demonstration');
          return await api.post(\`/payments/create-order/1\`);
      });`;

content = content.replace(oldSubmitLogic, newSubmitLogic);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Restored SpecialServices.jsx VIP endpoint.');
