const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// 1. Hero
content = content.replace(
  '<div className="absolute inset-0">\n                          <img\n                              src={heroImg}',
  '<motion.div \n                          className="absolute inset-0"\n                          initial={{ scale: 1.1, opacity: 0.8 }}\n                          animate={{ scale: 1, opacity: 1 }}\n                          transition={{ duration: 1.5, ease: "easeOut" }}\n                      >\n                          <img\n                              src={heroImg}'
);
content = content.replace(
  '<div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70"></div>\n                      </div>',
  '<div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70"></div>\n                      </motion.div>'
);
content = content.replace(
  '<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-bold text-white mb-4 animate-fadeIn flex items-center justify-center gap-3 sm:gap-6 flex-wrap">',
  '<motion.h1 \n                                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-bold text-white mb-4 flex items-center justify-center gap-3 sm:gap-6 flex-wrap"\n                                  initial={{ opacity: 0, y: 40 }}\n                                  animate={{ opacity: 1, y: 0 }}\n                                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}\n                              >'
);
content = content.replace(
  'Find your forever\n                                  <HiHeart className="text-[#f44336] animate-pulse shrink-0" />\n                              </h1>',
  'Find your forever\n                                  <HiHeart className="text-[#f44336] animate-pulse shrink-0" />\n                              </motion.h1>'
);
content = content.replace(
  '<p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-10 animate-fadeIn stagger-1 font-medium italic">',
  '<motion.p \n                                  className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-10 font-medium italic"\n                                  initial={{ opacity: 0, y: 20 }}\n                                  animate={{ opacity: 1, y: 0 }}\n                                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}\n                              >'
);
content = content.replace(
  'Discover a world beyond matrimony\n                              </p>',
  'Discover a world beyond matrimony\n                              </motion.p>'
);
content = content.replace(
  '<div className="animate-fadeIn stagger-2">\n                                  <button',
  '<motion.div \n                                  initial={{ opacity: 0, scale: 0.9 }}\n                                  animate={{ opacity: 1, scale: 1 }}\n                                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}\n                              >\n                                  <button'
);
content = content.replace(
  'Find Your Match\n                                  </button>\n                              </div>',
  'Find Your Match\n                                  </button>\n                              </motion.div>'
);

// 2. Match Search Section
content = content.replace(
  '<div className="space-y-6">\n                <span className="inline-block px-4 py-1.5 rounded-full',
  '<motion.div \n                className="space-y-6"\n                initial={{ opacity: 0, x: -50 }}\n                whileInView={{ opacity: 1, x: 0 }}\n                viewport={{ once: true, amount: 0.3 }}\n                transition={{ duration: 0.7, ease: "easeOut" }}\n            >\n                <span className="inline-block px-4 py-1.5 rounded-full'
);
content = content.replace(
  'Family Trusted\n                    </div>\n                </div>\n            </div>\n\n            <div className="morphism-glass p-8 rounded-[32px] relative">',
  'Family Trusted\n                    </div>\n                </div>\n            </motion.div>\n\n            <motion.div \n                className="morphism-glass p-8 rounded-[32px] relative"\n                initial={{ opacity: 0, x: 50 }}\n                whileInView={{ opacity: 1, x: 0 }}\n                viewport={{ once: true, amount: 0.3 }}\n                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}\n            >'
);
content = content.replace(
  ' className="w-full h-32 object-cover rounded-2xl shadow-sm border border-white/40 hover:scale-105 transition-transform"\n                    />\n                </div>\n            </div>',
  ' className="w-full h-32 object-cover rounded-2xl shadow-sm border border-white/40 hover:scale-105 transition-transform"\n                    />\n                </div>\n            </motion.div>'
);

// 3. Premium Services
// It already uses motion.div and stagger variants! 
// Let's just adjust it to use whileInView for stagger fade-up.
// Lines 559-564: already has containerVariants, initial="hidden", whileInView="show". So it's fine!

// 4. Trusted Couples
content = content.replace(
  '<div className="relative group">\n            <div className="absolute inset-0 bg-gradient-to-tr',
  '<motion.div \n            className="relative group"\n            initial={{ opacity: 0, scale: 0.95 }}\n            whileInView={{ opacity: 1, scale: 1 }}\n            viewport={{ once: true, amount: 0.3 }}\n            transition={{ duration: 0.8, ease: "easeOut" }}\n          >\n            <div className="absolute inset-0 bg-gradient-to-tr'
);
content = content.replace(
  ' className="w-full h-[500px] rounded-[32px] object-cover" />\n            </div>\n          </div>\n          <div className="space-y-8">',
  ' className="w-full h-[500px] rounded-[32px] object-cover" />\n            </div>\n          </motion.div>\n          <div className="space-y-8">'
);
content = content.replace(
  '<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">\n              {["Amazing experience',
  '<motion.div \n                className="grid grid-cols-1 sm:grid-cols-2 gap-6"\n                variants={containerVariants}\n                initial="hidden"\n                whileInView="show"\n                viewport={{ once: true, amount: 0.2 }}\n              >\n              {["Amazing experience'
);
content = content.replace(
  '                  <div className="relative z-10">\n                      <div className="flex gap-1 text-amber-400 mb-3 text-lg">',
  '                  <div className="relative z-10">\n                      <div className="flex gap-1 text-amber-400 mb-3 text-lg">'
);
content = content.replace(
  '              {["Amazing experience and genuine profiles.", "Easy to use and very helpful support.", "Found the right match for our family.", "Best platform for serious marriage search."].map((txt, i) => (\n                <div className="relative p-6 morphism-glass border border-amber-200/50 rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-amber-400/30 transition-all duration-300 group overflow-hidden bg-white/60" key={i}>',
  '              {["Amazing experience and genuine profiles.", "Easy to use and very helpful support.", "Found the right match for our family.", "Best platform for serious marriage search."].map((txt, i) => (\n                <motion.div variants={cardVariants} className="relative p-6 morphism-glass border border-amber-200/50 rounded-2xl shadow-lg hover:-translate-y-2 hover:shadow-amber-400/30 transition-all duration-300 group overflow-hidden bg-white/60" key={i}>'
);
content = content.replace(
  '<h4 className="font-bold text-[#291907] text-xs uppercase tracking-wider">Happy Member</h4>\n                  </div>\n                </div>\n              ))}',
  '<h4 className="font-bold text-[#291907] text-xs uppercase tracking-wider">Happy Member</h4>\n                  </div>\n                </motion.div>\n              ))}'
);
content = content.replace(
  '</div>\n          </div>\n        </div>\n      </section>',
  '</motion.div>\n          </div>\n        </div>\n      </section>'
);

// 5. Why Choose Us
content = content.replace(
  '<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">\n          {[\n            ["🏅", "Genuine Profiles"',
  '<motion.div \n            className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"\n            variants={containerVariants}\n            initial="hidden"\n            whileInView="show"\n            viewport={{ once: true, amount: 0.2 }}\n          >\n          {[\n            ["🏅", "Genuine Profiles"'
);
content = content.replace(
  '            ["💍", "2000+ Weddings", "Thousands of successful matches and happy couples."],\n          ].map((item, i) => (\n            <div className="relative p-8 morphism-glass !bg-white/5 border border-amber-500/30 rounded-[32px] text-center shine-hover hover:-translate-y-2 transition-transform duration-500 group shadow-[0_10px_40px_rgba(0,0,0,0.5)]" key={i}>',
  '            ["💍", "2000+ Weddings", "Thousands of successful matches and happy couples."],\n          ].map((item, i) => (\n            <motion.div variants={cardVariants} className="relative p-8 morphism-glass !bg-white/5 border border-amber-500/30 rounded-[32px] text-center transition-all duration-500 group shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-2 hover:shadow-[0_15px_50px_rgba(196,140,70,0.4)]" key={i}>'
);
content = content.replace(
  '<p className="text-amber-100/70 font-medium leading-relaxed">{item[2]}</p>\n            </div>\n          ))}\n        </div>',
  '<p className="text-amber-100/70 font-medium leading-relaxed">{item[2]}</p>\n            </motion.div>\n          ))}\n        </motion.div>'
);

// 6. Welcome section (Floating image, stats count-up, CTA pulse hover)
content = content.replace(
  '<div className="relative h-[600px]">\n            <div className="absolute top-0 left-0 w-3/4 h-[450px] morphism-glass',
  '<motion.div \n            className="relative h-[600px]"\n            initial={{ opacity: 0, y: 50 }}\n            whileInView={{ opacity: 1, y: 0 }}\n            viewport={{ once: true, amount: 0.3 }}\n            transition={{ duration: 0.8, ease: "easeOut" }}\n          >\n            <motion.div \n                className="absolute top-0 left-0 w-3/4 h-[450px] morphism-glass'
);
content = content.replace(
  'className="w-full h-full object-cover rounded-[24px]"\n              />\n            </div>\n            <div className="absolute bottom-0 right-0 w-3/4 h-[450px] morphism-glass',
  'className="w-full h-full object-cover rounded-[24px]"\n              />\n            </motion.div>\n            <motion.div \n                className="absolute bottom-0 right-0 w-3/4 h-[450px] morphism-glass'
);
content = content.replace(
  'className="w-full h-full object-cover rounded-[24px]"\n              />\n            </div>\n          </div>\n\n          <div className="space-y-8">',
  'className="w-full h-full object-cover rounded-[24px]"\n              />\n            </motion.div>\n          </motion.div>\n\n          <motion.div \n            className="space-y-8"\n            initial={{ opacity: 0, x: 50 }}\n            whileInView={{ opacity: 1, x: 0 }}\n            viewport={{ once: true, amount: 0.3 }}\n            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}\n          >'
);
content = content.replace(
  '<button onClick={openRegister} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full font-bold shadow-[0_10px_20px_rgba(233,30,99,0.3)] hover:-translate-y-1 transition-all shine-hover">\n              Start your profile now\n            </button>',
  '<motion.button \n              onClick={openRegister} \n              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full font-bold shadow-[0_10px_20px_rgba(233,30,99,0.3)] transition-all shine-hover"\n              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(233,30,99,0.5)" }}\n              whileTap={{ scale: 0.95 }}\n            >\n              Start your profile now\n            </motion.button>'
);
content = content.replace(
  '<p className="text-[#5c4a3d] font-semibold text-sm uppercase tracking-widest">{stat[1]}</p>\n                </div>\n              ))}\n            </div>\n          </div>',
  '<p className="text-[#5c4a3d] font-semibold text-sm uppercase tracking-widest">{stat[1]}</p>\n                </div>\n              ))}\n            </div>\n          </motion.div>'
);

// 7. Recent Couples
content = content.replace(
  '<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 perspective-[1000px]">\n          {[\n            "https://images.unsplash.com',
  '<motion.div \n            className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 perspective-[1000px]"\n            variants={containerVariants}\n            initial="hidden"\n            whileInView="show"\n            viewport={{ once: true, amount: 0.2 }}\n          >\n          {[\n            "https://images.unsplash.com'
);
content = content.replace(
  '          ].map((img, i) => (\n            <div className="relative group" key={i}>\n              <div className={`relative bg-white p-3 pb-20 rounded-xl shadow-xl border border-gray-100 transform transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-105 ${i%2===0 ? \'rotate-[-2deg] group-hover:rotate-[2deg]\' : \'rotate-[2deg] group-hover:rotate-[-2deg]\'}`}>',
  '          ].map((img, i) => (\n            <motion.div variants={cardVariants} className="relative group" key={i}>\n              <div className={`relative bg-white p-3 pb-20 rounded-xl shadow-xl border border-gray-100 transform transition-transform duration-500 group-hover:-translate-y-4 group-hover:scale-105 ${i%2===0 ? \'rotate-[-2deg] group-hover:rotate-[2deg]\' : \'rotate-[2deg] group-hover:rotate-[-2deg]\'}`}>'
);
content = content.replace(
  '<p className="text-[#5c4a3d] text-xs font-semibold tracking-wider uppercase">Pune, Maharashtra</p>\n                </div>\n              </div>\n            </div>\n          ))}\n        </div>',
  '<p className="text-[#5c4a3d] text-xs font-semibold tracking-wider uppercase">Pune, Maharashtra</p>\n                </div>\n              </div>\n            </motion.div>\n          ))}\n        </motion.div>'
);

// 8. Memories section
content = content.replace(
  '<div className="relative w-full overflow-hidden z-10 py-10">\n          <div className="animate-marquee flex gap-6">',
  '<motion.div \n            className="relative w-full overflow-hidden z-10 py-10"\n            initial={{ opacity: 0 }}\n            whileInView={{ opacity: 1 }}\n            viewport={{ once: true, amount: 0.1 }}\n            transition={{ duration: 1 }}\n          >\n          <div className="animate-marquee flex gap-6">'
);
content = content.replace(
  'className="w-[400px] h-[250px] object-cover rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 hover:border-white/30 transition-colors"\n                />\n              </div>\n            ))}\n          </div>\n        </div>',
  'className="w-[400px] h-[250px] object-cover rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-110"\n                />\n              </div>\n            ))}\n          </div>\n        </motion.div>'
);

// Write changes
fs.writeFileSync('src/pages/Home.jsx', content);
console.log('Successfully added framer-motion animations to Home.jsx');
