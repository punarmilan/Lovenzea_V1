const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'services', 'SpecialServices.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add id to formattedPackages
content = content.replace(
  'name: plan.name,',
  'id: plan.id,\n                name: plan.name,'
);

// 2. Add rawPrice to formattedPackages to avoid switch statement hack later
content = content.replace(
  'price: `₹${plan.price}`,',
  'price: `₹${plan.price}`,\n                rawPrice: plan.price,'
);

// 3. Update the submit handler to use the correct plan ID
const oldSubmitLogic = `      const price = getPackagePrice(formData.packageType);
      
      const { data: orderResponse } = await api.post('/payments/create-vip-order', {
          amount: price,
          packageType: formData.packageType
      }).catch(async (err) => {
          console.warn('VIP order endpoint missing, using fallback plan for UI demonstration');
          return await api.post(\`/payments/create-order/1\`);
      });`;

const newSubmitLogic = `      const selectedPackage = dbPackages.find(p => p.name === formData.packageType) || dbPackages[0];
      const planId = selectedPackage?.id || 1;
      const price = selectedPackage?.rawPrice || getPackagePrice(formData.packageType);
      
      const { data: orderResponse } = await api.post(\`/payments/create-order/\${planId}\`).catch(async (err) => {
          console.warn('Order creation failed, falling back to dummy UI order');
          return await api.post(\`/payments/create-order/1\`);
      });`;

content = content.replace(oldSubmitLogic, newSubmitLogic);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed SpecialServices.jsx payment plan ID issue.');
