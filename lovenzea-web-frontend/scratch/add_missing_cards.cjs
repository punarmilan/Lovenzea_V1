const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'myshadi', 'myProfile', 'MyProfile.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const personalDetailsRegex = /\{\/\* Personal Details \*\/\}([\s\S]*?)\{\/\* Education & Career \*\/\}/;
const personalMatch = content.match(personalDetailsRegex);

const newPersonalDetails = `
              {/* Personal Details */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaUserCircle className="text-rose-400" /> Personal Details
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('person')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Personal Details"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Date of Birth', value: profileData.dob || profileData.lifestyle?.dob || profileData.religiousBackground?.dob || 'N/A' },
                    { label: 'Time of Birth', value: profileData.timeOfBirth || profileData.religiousBackground?.timeOfBirth || 'N/A' },
                    { label: 'Height', value: profileData.height || profileData.lifestyle?.height || 'N/A' },
                    { label: 'Weight', value: profileData.weight || profileData.lifestyle?.weight || 'N/A' },
                    { label: 'Manglik', value: profileData.manglikStatus || profileData.religiousBackground?.manglikChevvai || 'N/A' },
                    { label: 'Marital Status', value: profileData.maritalStatus || profileData.lifestyle?.maritalStatus || 'N/A' }
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Religious Background */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaStar className="text-rose-400" /> Religious Background
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('religious')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Religious Background"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Religion', value: profileData.religion || profileData.religiousBackground?.religion || 'N/A' },
                    { label: 'Community', value: profileData.caste || profileData.religiousBackground?.community || 'N/A' },
                    { label: 'Sub-Community', value: profileData.subCaste || profileData.religiousBackground?.subCommunity || 'N/A' },
                    { label: 'Gothra', value: profileData.gotra || profileData.religiousBackground?.gothra || 'N/A' },
                    { label: 'Mother Tongue', value: profileData.motherTongue || profileData.religiousBackground?.motherTongue || 'N/A' },
                    { label: 'City of Birth', value: profileData.cityOfBirth || profileData.religiousBackground?.cityOfBirth || 'N/A' },
                    { label: 'Nakshatra', value: profileData.nakshatra || profileData.religiousBackground?.nakshatra || 'N/A' },
                    { label: 'Rashi', value: profileData.rashi || profileData.religiousBackground?.rashi || 'N/A' },
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family Details */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaUsers className="text-rose-400" /> Family Details
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('family')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Family Details"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Father Status', value: profileData.fatherStatus || profileData.familyDetails?.father || 'N/A' },
                    { label: 'Mother Status', value: profileData.motherStatus || profileData.familyDetails?.mother || 'N/A' },
                    { label: 'Family Location', value: profileData.familyLocation || profileData.familyDetails?.familyLocation || 'N/A' },
                    { label: 'Financial Status', value: profileData.familyAnnualIncome || profileData.familyDetails?.financialStatus || 'N/A' },
                    { label: 'No. Of Brothers', value: profileData.numberOfBrothers || profileData.familyDetails?.brothers || 'N/A' },
                    { label: 'No. Of Sisters', value: profileData.numberOfSisters || profileData.familyDetails?.sisters || 'N/A' }
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              `;

content = content.replace(personalDetailsRegex, newPersonalDetails + '\n              {/* Education & Career */}');

const eduRegex = /\{\/\* Education & Career \*\/\}([\s\S]*?)\{\/\* Lifestyle \*\/\}/;
const eduMatch = content.match(eduRegex);

const newEdu = `
              {/* Education & Career */}
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaGraduationCap className="text-rose-400" /> Education & Career
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('education')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Education & Career"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Education', value: profileData.educationLevel || profileData.education || profileData.educationCareer?.highestQualification || 'N/A' },
                    { label: 'Education Field', value: profileData.educationField || profileData.educationCareer?.educationField || 'N/A' },
                    { label: 'College', value: profileData.college || profileData.educationCareer?.collegeAttended || 'N/A' },
                    { label: 'Working With', value: profileData.workingWith || profileData.educationCareer?.workingWith || 'N/A' },
                    { label: 'Profession', value: profileData.occupation || profileData.profession || profileData.educationCareer?.workingAs || 'N/A' },
                    { label: 'Company', value: profileData.company || profileData.educationCareer?.employerName || 'N/A' },
                    { label: 'Working City', value: profileData.workingCity || profileData.educationCareer?.workingCity || 'N/A' },
                    { label: 'Annual Income', value: profileData.annualIncome || profileData.income || profileData.educationCareer?.annualIncome || 'N/A' },
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

`;

content = content.replace(eduRegex, newEdu + '\n              {/* Lifestyle */}');

const contactRegex = /\{\/\* Contact Information \*\/\}([\s\S]*?)\{\/\* Interests \(Mock\) \*\/\}/;

const newContact = `
            {/* Location & Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaMapMarkerAlt className="text-rose-400" /> Location Details
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('location')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Location Details"><FaEdit size={16}/></button>}
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Address', value: profileData.address || profileData.locationInfo?.address || 'N/A' },
                    { label: 'City', value: profileData.city || profileData.locationInfo?.city || 'N/A' },
                    { label: 'State', value: profileData.state || profileData.locationInfo?.state || 'N/A' },
                    { label: 'Country', value: profileData.country || profileData.locationInfo?.country || 'N/A' },
                    { label: 'Residency Status', value: profileData.residencyStatus || profileData.locationInfo?.residencyStatus || 'N/A' },
                    { label: 'Zip/Pin Code', value: profileData.zipCode || profileData.locationInfo?.zipCode || 'N/A' }
                  ].map((item, i) => (
                    <div key={i} className="flex text-sm">
                      <span className="w-5/12 text-theme-text-secondary">{item.label}</span>
                      <span className="w-7/12 font-semibold text-gray-800 truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card-bg rounded-2xl shadow-sm border border-white/50 p-6 relative group">
                <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-serif">
                    <FaPhone className="text-rose-400" /> Contact Information
                  </h3>
                  {isEditing && <button onClick={() => handleOpenEditModal('location')} className="text-theme-text-secondary hover:text-gray-900 p-1 transition-colors" title="Edit Contact Information"><FaEdit size={16}/></button>}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'Mobile Number', value: profileData.mobileNumber || 'N/A', verified: !!profileData.mobileNumber },
                    { label: 'Email ID', value: profileData.email || 'N/A', verified: !!profileData.email }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center text-sm py-1">
                      <span className="w-full sm:w-5/12 text-theme-text-secondary mb-0.5 sm:mb-0">{item.label}</span>
                      <div className="w-full sm:w-7/12 flex items-center gap-2 overflow-hidden">
                        <span className="font-semibold text-gray-800 truncate text-[13px]" title={item.value}>
                          {item.value}
                        </span>
                        {item.verified && <span className="text-green-500 text-[10px] font-bold uppercase tracking-wider shrink-0">Verified</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

`;

content = content.replace(contactRegex, newContact + '\n              {/* Interests (Mock) */}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Added missing cards and robust mappings to MyProfile.jsx');
