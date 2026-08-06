import React from 'react';
import { User, Heart, MapPin, Briefcase, GraduationCap, Users } from 'lucide-react';

const DetailSection = ({ title, icon, children }) => (
    <div className="bg-theme-surface rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-[#6D4C41] font-serif">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {children}
        </div>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex flex-col mb-2">
        <span className="text-xs text-theme-text-secondary uppercase tracking-wider font-semibold mb-1">{label}</span>
        <span className="text-gray-800 font-medium">{value || 'Not Specified'}</span>
    </div>
);

export default function ProfileDetailsView({ profileData }) {
    return (
        <div className="w-full pb-10">
            <DetailSection title="Personal Information" icon={<User size={20} />}>
                <DetailRow label="Full Name" value={profileData.fullName} />
                <DetailRow label="Age" value={profileData.age ? `${profileData.age} Years` : ''} />
                <DetailRow label="Height" value={profileData.height} />
                <DetailRow label="Weight" value={profileData.weight ? `${profileData.weight} Kg` : ''} />
                <DetailRow label="Marital Status" value={profileData.maritalStatus} />
                <DetailRow label="Mother Tongue" value={profileData.motherTongue} />
            </DetailSection>

            <DetailSection title="Religious Information" icon={<Heart size={20} />}>
                <DetailRow label="Religion" value={profileData.religion} />
                <DetailRow label="Community / Caste" value={profileData.community} />
                <DetailRow label="Sub Caste" value={profileData.subCommunity} />
                <DetailRow label="Gotra" value={profileData.gotra} />
                <DetailRow label="Manglik Status" value={profileData.manglikStatus} />
                <DetailRow label="Time of Birth" value={profileData.timeOfBirth} />
                <DetailRow label="Place of Birth" value={profileData.placeOfBirth} />
                <DetailRow label="Nakshatra" value={profileData.nakshatra} />
                <DetailRow label="Rashi" value={profileData.rashi} />
            </DetailSection>

            <DetailSection title="Education & Career" icon={<GraduationCap size={20} />}>
                <DetailRow label="Education" value={profileData.education} />
                <DetailRow label="Education Field" value={profileData.educationField} />
                <DetailRow label="College" value={profileData.college} />
                <DetailRow label="Profession" value={profileData.profession} />
                <DetailRow label="Working With" value={profileData.workingWith} />
                <DetailRow label="Company" value={profileData.company} />
                <DetailRow label="Annual Income" value={profileData.income} />
            </DetailSection>

            <DetailSection title="Location" icon={<MapPin size={20} />}>
                <DetailRow label="Country" value={profileData.country} />
                <DetailRow label="State" value={profileData.state} />
                <DetailRow label="City" value={profileData.city} />
                <DetailRow label="Working City" value={profileData.workingCity} />
                <DetailRow label="Residency Status" value={profileData.residencyStatus} />
            </DetailSection>

            <DetailSection title="Family Details" icon={<Users size={20} />}>
                <DetailRow label="Father's Status" value={profileData.fatherStatus} />
                <DetailRow label="Mother's Status" value={profileData.motherStatus} />
                <DetailRow label="Brothers" value={profileData.brothersCount} />
                <DetailRow label="Sisters" value={profileData.sistersCount} />
                <DetailRow label="Family Location" value={profileData.familyLocation} />
            </DetailSection>
            
            <DetailSection title="About Me" icon={<User size={20} />}>
                <div className="col-span-1 md:col-span-2">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {profileData.aboutText || "No description provided."}
                    </p>
                </div>
            </DetailSection>
        </div>
    );
}
