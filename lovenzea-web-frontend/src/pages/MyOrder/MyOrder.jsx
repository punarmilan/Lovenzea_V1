import React from 'react';
import Sidebar from './Sidebar';

const MyOrder = () => {
    return (
        <div className="min-h-screen p-4 lg:p-8 bg-gradient-to-br">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-theme-surface rounded-2xl shadow-xl p-6 lg:p-8 border border-rose-100">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 font-serif">My Orders</h1>

                            <div className="space-y-6">
                                <p className="text-theme-text-secondary">This section provides details about orders for our Premium Services.</p>

                                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                                    <p className="text-gray-700 font-medium">You have not placed any orders with us.</p>
                                </div>

                                <p className="text-theme-text-secondary">Become a Premium member through any other following services and enjoy the benefits:</p>

                                {/* Premium Packages */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                        <h3 className="text-lg font-bold text-purple-900 mb-4 border-b border-purple-300 pb-2">Premium Packages:</h3>
                                        <ul className="space-y-2">
                                            <li>
                                                <a href="#" className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-colors">
                                                    Diamond Membership
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-colors">
                                                    Gold Membership
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                                        <div className="h-full flex flex-col">
                                            <div className="mb-4 invisible">Spacer</div>
                                            <ul className="space-y-2">
                                                <li>
                                                    <a href="#" className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-colors">
                                                        Platinum Plus Membership
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-colors">
                                                        Diamond Plus Membership
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-colors">
                                                        Gold Plus Membership
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Other Services */}
                                <div className="mt-8 bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                                    <h3 className="text-lg font-bold text-blue-900 mb-4 border-b border-blue-300 pb-2">Other services:</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <li>
                                            <a href="#" className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-colors">
                                                LovenZea.com Profile Blaster
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-colors">
                                                LovenZea.com Spotlight
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-colors">
                                                LovenZea.com Bold Listing
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-colors">
                                                AstroSoulMate Match
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                {/* Contact Information */}
                                <div className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-6">
                                    <p className="text-gray-700">
                                        If you need any further help or information please feel free to{' '}
                                        <a href="#" className="text-cyan-600 hover:text-cyan-800 font-semibold hover:underline">
                                            Write to Customer Support
                                        </a>{' '}
                                        or call us at{' '}
                                        <span className="font-bold text-rose-600">+91-8095031111</span> with your{' '}
                                        <span className="font-semibold">Order ID</span> and specifying the problem.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrder;