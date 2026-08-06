import React from 'react';

const RequestEmpty = ({ message, submessage }) => {
    return (
        <div className="text-center py-16 px-4">
            <div className="w-48 h-48 mx-auto mb-8 relative animate-float">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full relative shadow-lg">
                    {/* Character Head */}
                    <div className="absolute top-7 left-1/2 -translate-x-1/2 w-20 h-20 bg-theme-surface border-4 border-gray-800 rounded-full">
                        {/* Eyes */}
                        <div className="absolute top-7 left-1/2 -translate-x-1/2 flex gap-4">
                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                        </div>
                        {/* Smile */}
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-8 h-4 border-3 border-gray-800 border-t-0 rounded-b-full"></div>
                    </div>

                    {/* Body */}
                    <div className="absolute top-28 left-1/2 -translate-x-1/2 w-16 h-10 bg-teal-400 border-4 border-gray-800 rounded-xl"></div>

                    {/* Laptop */}
                    <div className="absolute top-36 left-1/2 -translate-x-1/2 w-12 h-9 bg-gray-700 border-3 border-gray-800 rounded">
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-5 bg-blue-300 rounded"></div>
                    </div>

                    {/* Mail Icon */}
                    <div className="absolute top-2 right-7 w-10 h-10 bg-lime-400 border-4 border-gray-800 rounded-lg flex items-center justify-center text-xl animate-bounce">
                        ✉
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>
                    </div>
                </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3 font-playfair">{message}</h2>
            <p className="text-theme-text-secondary text-base">{submessage}</p>
        </div>
    );
};

export default RequestEmpty;