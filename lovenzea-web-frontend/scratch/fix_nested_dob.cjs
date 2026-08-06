const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldInputBlock = `                        ) : (
                          <input
                            type={key === 'dateOfBirth' ? 'date' : 'text'}
                            value={value || ''}
                            onChange={(e) => handleModalDataChange(key, e.target.value)}
                            readOnly={key === 'age'}
                            placeholder={key === 'dateOfBirth' ? 'YYYY-MM-DD' : key === 'timeOfBirth' ? 'HH:MM AM/PM' : ''}
                            className={\`w-full px-4 py-3 bg-gray-50/50 border rounded-xl focus:bg-theme-surface focus:ring-2 focus:ring-theme-magenta focus:border-transparent outline-none transition-all text-sm font-medium \${errors[key] ? 'border-red-500' : 'border-theme-border'} \${key === 'age' ? 'bg-gray-100 text-theme-text-secondary' : 'text-gray-800'}\`}
                          />
                        )}`;

const newInputBlock = `                        ) : (
                          <div className="relative">
                            <input
                              type={key === 'dateOfBirth' ? 'date' : 'text'}
                              value={value || ''}
                              onChange={(e) => handleModalDataChange(key, e.target.value)}
                              readOnly={key === 'age'}
                              max={key === 'dateOfBirth' ? maxDate18YearsAgo : undefined}
                              placeholder={key === 'dateOfBirth' ? 'YYYY-MM-DD' : key === 'timeOfBirth' ? 'HH:MM AM/PM' : ''}
                              className={\`w-full px-5 py-3.5 bg-[#fffaf7] border rounded-xl focus:bg-white focus:ring-2 focus:ring-[#df5f78] focus:border-transparent outline-none transition-all text-sm font-medium \${errors[key] ? 'border-red-500' : 'border-[#f1d8d1]/60'} \${key === 'age' ? 'bg-gray-100 text-theme-text-secondary' : 'text-[#3d2930]'}\`}
                              style={key === 'dateOfBirth' ? { colorScheme: 'light' } : undefined}
                            />
                            {key === 'dateOfBirth' && (
                              <p className="text-[11px] text-[#b83f5d]/70 mt-1.5 ml-1 font-medium">* You must be at least 18 years old.</p>
                            )}
                          </div>
                        )}`;

content = content.replace(oldInputBlock, newInputBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed nested DOB input.');
