import React from 'react';
import Swal from 'sweetalert2';
import Sidebar from './Sidebar';

const SecurityPage = () => {
    const securityTips = [
        {
            icon: '🔐',
            title: 'Protect Your Password',
            tips: [
                'Use a strong, unique password with uppercase, lowercase, numbers, and special characters',
                'Never share your password with anyone, including support staff',
                'Change your password regularly (every 3-6 months)',
                'Enable two-factor authentication for added security',
                'Don\'t use the same password across multiple sites'
            ]
        },
        {
            icon: '👤',
            title: 'Profile Privacy',
            tips: [
                'Control who can view your profile using privacy settings',
                'Be careful about sharing personal information like phone numbers or addresses',
                'Report suspicious profiles immediately',
                'Review your privacy settings regularly',
                'Don\'t share sensitive documents or financial information'
            ]
        },
        {
            icon: '💬',
            title: 'Safe Communication',
            tips: [
                'Keep conversations on the platform initially',
                'Never send money to anyone you meet online',
                'Be cautious of requests for personal photos or videos',
                'Trust your instincts - if something feels wrong, it probably is',
                'Verify the identity of people before sharing personal details'
            ]
        },
        {
            icon: '🤝',
            title: 'Meeting Safely',
            tips: [
                'Always meet in public places for first meetings',
                'Inform family or friends about your plans and location',
                'Arrange your own transportation to and from meetings',
                'Video call before meeting in person to verify identity',
                'Stay sober and alert during first meetings'
            ]
        },
        {
            icon: '🚨',
            title: 'Red Flags to Watch',
            tips: [
                'Requests for money or financial assistance',
                'Overly romantic or intense declarations too quickly',
                'Refusal to video chat or meet in person',
                'Inconsistencies in their stories or profile information',
                'Pressure to move communication off the platform quickly'
            ]
        },
        {
            icon: '🛡️',
            title: 'Account Security',
            tips: [
                'Log out from shared or public computers',
                'Use secure internet connections (avoid public WiFi)',
                'Keep your device and apps updated',
                'Review login activity regularly',
                'Contact support immediately if you notice suspicious activity'
            ]
        }
    ];

    const emergencyContacts = [
        { name: 'Customer Support', number: '+91-8095031111', icon: '📞' },
        { name: 'Email Support', email: 'support@LovenZea.com', icon: '✉️' },
        { name: 'Report Abuse', email: 'abuse@LovenZea.com', icon: '🚨' },
    ];

    return (
        <div className="min-h-screen p-4 lg:p-8 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <Sidebar />
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-theme-surface rounded-2xl shadow-xl p-6 lg:p-8 border border-rose-100">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 font-serif">Security Tips</h1>

                            {/* Main Alert */}
                            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">🛡️ Your Safety is Our Priority</h2>
                                <p className="text-gray-700">Follow these important security guidelines to ensure a safe and positive experience on our platform. If something doesn't feel right, trust your instincts and contact us immediately.</p>
                            </div>

                            {/* Security Tips Grid */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Essential Security Guidelines</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {securityTips.map((section, index) => (
                                        <div key={index} className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-lg border border-amber-200 p-6 hover:shadow-2xl transition-all duration-300">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="text-4xl">{section.icon}</span>
                                                <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                                            </div>
                                            <ul className="space-y-2">
                                                {section.tips.map((tip, tipIndex) => (
                                                    <li key={tipIndex} className="flex items-start gap-2">
                                                        <span className="text-rose-500 mt-1 flex-shrink-0">✓</span>
                                                        <span className="text-gray-700 text-sm">{tip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* What to Do if Something Goes Wrong */}
                            <div className="mb-8 bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">⚠️ What to Do if Something Goes Wrong</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-theme-surface rounded-lg p-4 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-2">🚫 Block the User</h3>
                                        <p className="text-theme-text-secondary text-sm">Use the block feature to prevent further contact from suspicious users</p>
                                    </div>
                                    <div className="bg-theme-surface rounded-lg p-4 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-2">📢 Report to Us</h3>
                                        <p className="text-theme-text-secondary text-sm">Report suspicious activity or profiles immediately to our support team</p>
                                    </div>
                                    <div className="bg-theme-surface rounded-lg p-4 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-2">💾 Save Evidence</h3>
                                        <p className="text-theme-text-secondary text-sm">Take screenshots of suspicious messages or behavior</p>
                                    </div>
                                    <div className="bg-theme-surface rounded-lg p-4 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-2">👮 Contact Authorities</h3>
                                        <p className="text-theme-text-secondary text-sm">For serious threats or crimes, contact local law enforcement</p>
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contacts */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 font-serif">Emergency Contacts</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {emergencyContacts.map((contact, index) => (
                                        <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                                            <div className="text-3xl mb-3">{contact.icon}</div>
                                            <h3 className="font-bold text-gray-800 mb-2">{contact.name}</h3>
                                            {contact.number && (
                                                <a href={`tel:${contact.number}`} className="text-blue-600 hover:text-blue-800 font-semibold hover:underline block">
                                                    {contact.number}
                                                </a>
                                            )}
                                            {contact.email && (
                                                <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800 font-semibold hover:underline block break-all">
                                                    {contact.email}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Report Issue Button */}
                            <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl p-6 text-white">
                                <h3 className="text-xl font-bold mb-3">Need to Report Something?</h3>
                                <p className="mb-4">If you encounter any suspicious activity, feel unsafe, or need to report a profile or behavior, please contact us immediately. We take all reports seriously and will investigate promptly.</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => Swal.fire({ text: 'Opening report form...', confirmButtonColor: '#8C6D39' })}
                                        className="flex-1 bg-theme-surface text-rose-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        🚨 Report an Issue
                                    </button>
                                    <button
                                        onClick={() => Swal.fire({ text: 'Opening live chat for urgent help...', confirmButtonColor: '#8C6D39' })}
                                        className="flex-1 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors duration-200"
                                    >
                                        💬 Emergency Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;