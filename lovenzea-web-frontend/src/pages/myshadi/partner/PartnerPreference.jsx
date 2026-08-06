import React, { useState, useEffect } from 'react';
import { ChevronRight, Globe, MapPin, Target, GraduationCap, Briefcase, Building, Wallet, Plus, ChevronDown, User, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerPreferences, updatePartnerPreferences } from '../../../Slice/ProfileSlice';

const PartnerPreferencesMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { preferences: reduxPreferences, loading } = useSelector((state) => state.profile);

  const [preferences, setPreferences] = useState({
    // Basic Details
    ageRange: '22 to 26',
    heightRange: "5' 0\" to 5' 8\"",
    maritalStatus: 'Never Married',
    // Community
    religion: 'Sikh, Christian, Hindu',
    community: 'Open to All',
    motherTongue: 'Marathi, Hindi, English',
    // Location
    country: 'India',
    state: 'Maharashtra',
    city: 'Open to All',
    // Education & Career
    qualification: 'Open to All',
    workingWith: 'Open to All',
    profession: 'Open to All',
    annualIncome: 'Open to All',
    diet: 'Open to All',
    managedBy: 'Open to All'
  });

  useEffect(() => {
    dispatch(fetchPartnerPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (reduxPreferences) {
      setPreferences({
        ageRange: `${reduxPreferences.minAge || 18} to ${reduxPreferences.maxAge || 35}`,
        heightRange: `${reduxPreferences.minHeight || "4' 5\""} to ${reduxPreferences.maxHeight || "7' 0\""}`,
        maritalStatus: reduxPreferences.maritalStatus || 'Open to All',
        religion: reduxPreferences.preferredReligion || 'Open to All',
        community: reduxPreferences.preferredCaste || 'Open to All',
        motherTongue: reduxPreferences.preferredMotherTongue || 'Open to All',
        country: reduxPreferences.preferredCountry || 'Open to All',
        state: reduxPreferences.preferredState || 'Open to All',
        city: reduxPreferences.preferredCity || 'Open to All',
        qualification: reduxPreferences.minEducationLevel || 'Open to All',
        workingWith: reduxPreferences.workingWith || 'Open to All',
        profession: reduxPreferences.occupation || 'Open to All',
        annualIncome: reduxPreferences.minAnnualIncome || 'Open to All',
        diet: reduxPreferences.preferredDiet || 'Open to All',
        managedBy: reduxPreferences.profileManagedBy || 'Open to All'
      });
    }
  }, [reduxPreferences]);

  const [showMore, setShowMore] = useState(false);

  const updatePreference = async (field, value) => {
    try {
      await dispatch(updatePartnerPreferences({ [field]: value })).unwrap();
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  // Suggested cities
  const suggestedCities = ['Delhi', 'Bengaluru / Bangalore', 'Kolkata'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Your Partner Preferences
          </h1>
          <p className="text-theme-text-secondary text-sm sm:text-base mb-1">
            You will see Matches based on Preferences you have set
          </p>
          <p className="text-theme-text-secondary text-xs sm:text-sm italic">
            Tap on the field to edit
          </p>
        </div>

        {/* Basic Details Card */}
        <div className="bg-theme-surface rounded-2xl shadow-md mb-6 overflow-hidden">
          <div className="p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Basic Details
            </h2>

            <div className="space-y-4">
              {/* Age Range */}
              <button
                onClick={() => navigate('/my-shadi/partner-preferences/age-range')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm text-theme-text-secondary mb-0.5">Age Range</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                      {preferences.ageRange}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-theme-text-secondary transition-colors flex-shrink-0 w-5 h-5" />
              </button>

              {/* Height Range */}
              <button
                onClick={() => navigate('/my-shadi/partner-preferences/height-range')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm text-theme-text-secondary mb-0.5">Height Range</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                      {preferences.heightRange}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-theme-text-secondary transition-colors flex-shrink-0 w-5 h-5" />
              </button>

              {/* Marital Status */}
              <button
                onClick={() => navigate('/my-shadi/partner-preferences/maritalstatus')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm text-theme-text-secondary mb-0.5">Marital Status</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                      {preferences.maritalStatus}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-theme-text-secondary transition-colors flex-shrink-0 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Community Card */}
        <div className="bg-theme-surface rounded-2xl shadow-md mb-6 overflow-hidden">
          <div className="p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Community
            </h2>

            <div className="space-y-4">
              {/* Religion */}
              <button
                onClick={() => navigate('/my-shadi/partner-preferences/religion')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm text-theme-text-secondary mb-0.5">Religion</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                      {preferences.religion}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-theme-text-secondary transition-colors flex-shrink-0 w-5 h-5" />
              </button>

              {/* Community */}
              <button
                onClick={() => navigate('/my-shadi/partner-preferences/community')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm text-theme-text-secondary mb-0.5">Community</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800">
                      {preferences.community}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-theme-text-secondary transition-colors flex-shrink-0 w-5 h-5" />
              </button>

              {/* Mother Tongue */}
              <button
                onClick={() => navigate('/my-shadi/partner-preferences/mothertongue')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm text-theme-text-secondary mb-0.5">Mother Tongue</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-1">
                      {preferences.motherTongue}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-theme-text-secondary transition-colors flex-shrink-0 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* More Button - Shows/Hides Additional Sections */}
        {!showMore && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowMore(true)}
              className="inline-flex items-center gap-2 text-theme-text-secondary hover:text-gray-800 font-medium transition-colors px-6 py-2 rounded-full hover:bg-theme-surface"
            >
              <span>More</span>
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Additional Sections - Location & Education/Career */}
        {showMore && (
          <>
            {/* Location Section */}
            <div className="bg-theme-surface rounded-2xl shadow-md mb-6 overflow-hidden">
              <div className="p-5 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  Location
                </h2>

                <div className="space-y-3">
                  {/* Country */}
                  <button
                    onClick={() => navigate('/my-shadi/partner-preferences/country')}
                    className="w-full flex items-center justify-between p-4 hover:bg-purple-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                        <Globe className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm text-theme-text-secondary mb-0.5">Country Living In</p>
                        <p className="text-base font-semibold text-gray-800">{preferences.country}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </button>

                  {/* State */}
                  <button
                    onClick={() => navigate('/my-shadi/partner-preferences/state')}
                    className="w-full flex items-center justify-between p-4 hover:bg-pink-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-pink-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm text-theme-text-secondary mb-0.5">State Living In</p>
                        <p className="text-base font-semibold text-gray-800">{preferences.state}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
                  </button>

                  {/* City */}
                  <button
                    onClick={() => navigate('/my-shadi/partner-preferences/city')}
                    className="w-full flex items-center justify-between p-4 hover:bg-orange-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                          <Target className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm text-theme-text-secondary mb-0.5">City / District</p>
                          <p className="text-base font-semibold text-gray-800">{preferences.city}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </div>
                  </button>

                  {/* Suggested Cities */}
                  <div className="pt-2">
                    <p className="text-sm text-theme-text-secondary font-medium mb-3 px-2">Suggested for you</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => updatePreference('city', city)}
                          className="flex items-center gap-2 px-4 py-2 bg-theme-surface border-2 border-purple-200 rounded-full text-sm font-medium text-gray-700 hover:border-purple-400 hover:bg-purple-50 transition-all"
                        >
                          {city}
                          <Plus className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education & Career Section */}
            <div className="bg-theme-surface rounded-2xl shadow-md mb-6 overflow-hidden">
              <div className="p-5 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  Education & Career
                </h2>

                <div className="space-y-3">
                  {/* Qualification */}
                  <button
                    onClick={() => navigate('/my-shadi/partner-preferences/qualification')}
                    className="w-full flex items-center justify-between p-4 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm text-theme-text-secondary mb-0.5">Qualification</p>
                        <p className="text-base font-semibold text-gray-800">{preferences.qualification}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </button>

                  {/* Working With */}
                  <button
                    onClick={() => navigate('/my-shadi/partner-preferences/working')}
                    className="w-full flex items-center justify-between p-4 hover:bg-cyan-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm text-theme-text-secondary mb-0.5">Working With</p>
                        <p className="text-base font-semibold text-gray-800">{preferences.workingWith}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition-colors" />
                  </button>

                  {/* Profession */}
                  <button
                    onClick={() => navigate('/my-shadi/partner-preferences/profession')}
                    className="w-full flex items-center justify-between p-4 hover:bg-teal-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-teal-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm text-theme-text-secondary mb-0.5">Profession</p>
                        <p className="text-base font-semibold text-gray-800">{preferences.profession}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors" />
                  </button>

                  {/* Annual Income */}
                  <button
                    onClick={() => navigate('/my-shadi/partner-preferences/annulincome')}
                    className="w-full flex items-center justify-between p-4 hover:bg-green-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm text-theme-text-secondary mb-0.5">Annual Income</p>
                        <p className="text-base font-semibold text-gray-800">{preferences.annualIncome}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </button>

                  {/* Profile Managed By */}
                  <button
                    onClick={() => navigate('/my-shadi/partner-preferences/profile')}
                    className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm text-theme-text-secondary">Profile Managed By</div>
                      <div className="text-base text-gray-900 font-medium">{preferences.managedBy}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-theme-text-secondary transition-colors flex-shrink-0" />
                  </button>

                  {/* Diet */}
                  <button
                    onClick={() => navigate('/my-shadi/partner-preferences/diet')}
                    className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm text-theme-text-secondary">Diet</div>
                      <div className="text-base text-gray-900 font-medium">{preferences.diet}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-theme-text-secondary transition-colors flex-shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            {/* Show Less Button */}
            <div className="mb-6 text-center">
              <button
                onClick={() => setShowMore(false)}
                className="inline-flex items-center gap-2 text-theme-text-secondary hover:text-gray-800 font-medium transition-colors px-6 py-2 rounded-full hover:bg-theme-surface"
              >
                <span>Show Less</span>
                <ChevronDown className="w-5 h-5 transform rotate-180" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PartnerPreferencesMain;