import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User as UserIcon, BookOpen, Users, Star, Heart, Image as ImageIcon, ArrowLeft, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

// --- DUMMY DATA (To be replaced with API calls later) ---
const dummyMobileUsers = {
    101: {
        id: 101,
        name: "Rahul Sharma",
        email: "rahul.s@example.com",
        mobileNumber: "9876543210",
        status: "ACTIVE",
        details: {
            basic: { age: 28, height: "5'10\"", religion: "Hindu", caste: "Brahmin", maritalStatus: "Never Married", diet: "Vegetarian", smoke: "No", drink: "No" },
            education: { level: "Masters", occupation: "Software Engineer", income: "₹15,00,000", company: "Tech Solutions", location: "Bangalore" },
            family: { fatherStatus: "Retired", motherStatus: "Homemaker", brothers: 1, sisters: 0, familyType: "Nuclear", familyValues: "Moderate" },
            astro: { manglik: "No", gotra: "Bharadwaj", timeOfBirth: "14:30", placeOfBirth: "Delhi" },
            preferences: { ageRange: "24-28", heightRange: "5'2\" - 5'7\"", religion: "Hindu", education: "Bachelors or higher", occupation: "Professional" },
            photos: [
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            ]
        }
    },
    102: {
        id: 102,
        name: "Priya Patel",
        email: "priya.p@example.com",
        mobileNumber: "9123456789",
        status: "INACTIVE",
        details: {
            basic: { age: 26, height: "5'4\"", religion: "Hindu", caste: "Patel", maritalStatus: "Never Married", diet: "Vegetarian", smoke: "No", drink: "Occasionally" },
            education: { level: "Bachelors", occupation: "Marketing Manager", income: "₹9,00,000", company: "Creative Agency", location: "Mumbai" },
            family: { fatherStatus: "Business", motherStatus: "Homemaker", brothers: 0, sisters: 1, familyType: "Joint", familyValues: "Traditional" },
            astro: { manglik: "Yes", gotra: "Kashyap", timeOfBirth: "08:15", placeOfBirth: "Ahmedabad" },
            preferences: { ageRange: "27-31", heightRange: "5'8\" - 6'0\"", religion: "Hindu", education: "Masters", occupation: "Business/Professional" },
            photos: [
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
            ]
        }
    }
};

const MobileUserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        // SIMULATE FETCHING FROM DATABASE
        const fetchedUser = dummyMobileUsers[id];
        if (fetchedUser) {
            setUser(fetchedUser);
        } else {
            toast.error("User not found!");
            navigate('/admin/mobile-users');
        }
    }, [id, navigate]);

    const handleSaveDetails = (e) => {
        e.preventDefault();
        // Here you would make an API call to save the data for the specific tab
        toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} details updated successfully!`);
    };

    if (!user) return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div></div>;

    const renderField = (label, value, key) => (
        <div className="space-y-1.5" key={key}>
            <label className="text-xs font-black text-theme-text-secondary uppercase tracking-widest ml-1">{label}</label>
            <input 
                type="text" 
                defaultValue={value}
                className="w-full px-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-sm font-bold focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
        </div>
    );

    const tabs = [
        { id: 'basic', label: 'Basic Details', icon: <UserIcon size={18} /> },
        { id: 'education', label: 'Education & Career', icon: <BookOpen size={18} /> },
        { id: 'family', label: 'Family', icon: <Users size={18} /> },
        { id: 'astro', label: 'Astro Details', icon: <Star size={18} /> },
        { id: 'preferences', label: 'Preferences', icon: <Heart size={18} /> },
        { id: 'photos', label: 'Photos', icon: <ImageIcon size={18} /> },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-12 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 bg-theme-surface p-6 rounded-[32px] shadow-sm border border-gray-100">
                <button 
                    onClick={() => navigate('/admin/mobile-users')}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-theme-text-secondary"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name}'s Profile</h2>
                    <p className="text-sm text-theme-text-secondary font-bold tracking-wide mt-1">ID: {user.id} • {user.mobileNumber}</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Tabs Sidebar */}
                <div className="w-full lg:w-72 bg-theme-surface rounded-[32px] shadow-sm border border-gray-100 p-4 shrink-0 h-fit lg:sticky lg:top-6">
                    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto hide-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                                    activeTab === tab.id 
                                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200' 
                                        : 'text-theme-text-secondary hover:bg-gray-50'
                                }`}
                            >
                                <span className={activeTab === tab.id ? 'text-white' : 'text-gray-400'}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content Area */}
                <div className="flex-1 bg-theme-surface rounded-[32px] shadow-sm border border-gray-100 p-6 sm:p-8">
                    <form onSubmit={handleSaveDetails} className="flex flex-col h-full min-h-[500px]">
                        
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    {tabs.find(t => t.id === activeTab)?.icon}
                                    {tabs.find(t => t.id === activeTab)?.label}
                                </h3>
                            </div>

                            {activeTab !== 'photos' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-300">
                                    {Object.entries(user.details[activeTab]).map(([key, val]) => 
                                        renderField(key.replace(/([A-Z])/g, ' $1').trim(), val, key)
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in slide-in-from-right-4 duration-300">
                                    {user.details.photos.map((photo, index) => (
                                        <div key={index} className="relative group rounded-2xl overflow-hidden aspect-[3/4] shadow-md border border-theme-border">
                                            <img src={photo} alt="User" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button type="button" className="p-2 bg-theme-surface text-rose-500 rounded-lg hover:bg-rose-50 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-300 transition-colors cursor-pointer aspect-[3/4]">
                                        <ImageIcon size={32} className="mb-2" />
                                        <span className="font-bold text-sm text-center px-4">Upload New Photo</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-12 pt-6 border-t border-gray-100 flex justify-end">
                            <button 
                                type="submit" 
                                className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 shadow-xl shadow-gray-200 active:scale-95 transition-all"
                            >
                                <Save size={18} />
                                Save {tabs.find(t => t.id === activeTab)?.label}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MobileUserDetails;
