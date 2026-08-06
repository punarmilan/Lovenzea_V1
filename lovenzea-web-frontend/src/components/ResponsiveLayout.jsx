import React from 'react'
import Header from './Headers';
import SecondNav from './SecondNav';

const ResponsiveLayout = ({ children, showSecondNav = true }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Profile included */}
            <Header />

            {/* Second Navigation */}
            {showSecondNav && <SecondNav />}

            {/* Main Content */}
            <main className="pt-14 xs:pt-16 sm:pt-20 md:pt-24 pb-20 md:pb-8">
                <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
                    {/* Children content from pages */}
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ResponsiveLayout;