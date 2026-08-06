import React from 'react';
import { Lock, Shield, Users, HelpCircle } from 'lucide-react';

function FaqSection() {
    const faqs = [
        {
            id: 1,
            question: "What are some of the benefits of Premium plans?",
            answer: "As a Premium member, you can chat unlimited with your Matches, view their contact numbers and view hidden photos. You also get Premium Assistance on priority. These benefits will help you to accelerate your partner search."
        },
        {
            id: 2,
            question: "What offers and discounts can I avail?",
            answer: "We keep you informed from time to time whenever you are eligible for different discounts and offers. Login frequently to check and avail the best available offer."
        },
        {
            id: 3,
            question: "What payment options do you offer?",
            answer: "We offer multiple Online and Offline payment options for you to pick and choose from based on your location. Choose your preferred plan and move forward to see the various options available to you."
        },
        {
            id: 4,
            question: "How can I be safe on LovenZea.com?",
            answer: "We go to great lengths to make sure you get the best possible experience here. Every single profile is screened & your matches are tailored to your preferences. But if you still have any unpleasant experience please do report the same to us."
        }
    ];

    return (
        <div className="bg-transparent py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                        You have <span className="text-gray-900">questions.</span> We have the <span className="text-gray-900">answers...</span>
                    </h2>
                </div>

                {/* FAQ Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            className="dashboard-card-bg border border-white/50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {faq.question}
                            </h3>
                            <p className="text-theme-text-secondary leading-relaxed text-sm">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Help Link */}
                <div className="text-center mt-12">
                    <p className="text-theme-pink text-lg font-medium italic tracking-wide">
                        Didn't find what you are looking for? Find it on our{' '}
                        <a
                            href="#"
                            className="text-rose-600 hover:text-rose-700 font-bold hover:underline transition-colors"
                        >
                            Help page
                        </a>
                        .
                    </p>
                </div>

                {/* Trust Section */}
                <div className="mt-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-700 text-center mb-12">
                        The safest, smartest and the most secure<br />matchmaking service in India
                    </h2>

                    <div className="mt-20">
                    <div className="dashboard-card-bg border border-white/50 rounded-2xl shadow-sm p-12">
                        {/* Money Back Guarantee Badge */}
                        <div className="flex flex-col items-center mb-8">

                            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                Money Back Guarantee
                                <HelpCircle className="w-5 h-5 text-teal-500" />
                            </h3>
                            <p className="text-theme-text-secondary">
                                Get a full refund within 30 days if you don't find a match.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            {/* Best Matches */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                                    <Users className="w-8 h-8 text-teal-500" />
                                </div>
                                <h4 className="text-xl font-bold text-teal-600 mb-1">Best</h4>
                                <h4 className="text-xl font-bold text-teal-600">Matches</h4>
                            </div>

                            {/* 100% Privacy */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                                    <Lock className="w-8 h-8 text-teal-500" />
                                </div>
                                <h4 className="text-xl font-bold text-teal-600 mb-1">100%</h4>
                                <h4 className="text-xl font-bold text-teal-600">Privacy</h4>
                            </div>

                            {/* Verified Profiles */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                                    <Shield className="w-8 h-8 text-teal-500" />
                                </div>
                                <h4 className="text-xl font-bold text-teal-600 mb-1">Verified</h4>
                                <h4 className="text-xl font-bold text-teal-600">Profiles</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default FaqSection;
