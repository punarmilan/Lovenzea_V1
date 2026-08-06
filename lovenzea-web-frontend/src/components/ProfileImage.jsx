import React, { useState, useRef } from 'react';
import { Camera, Edit2, Plus, X } from 'lucide-react';

const ProfileWithImage = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const additionalFileInputRef = useRef(null);

    const handleImageUpload = (event, isAdditional = false) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (isAdditional) {
                    setAdditionalImages([...additionalImages, e.target.result]);
                } else {
                    setProfileImage(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAdditionalImage = (index) => {
        const newImages = [...additionalImages];
        newImages.splice(index, 1);
        setAdditionalImages(newImages);
    };

    const openFileDialog = (isAdditional = false) => {
        if (isAdditional) {
            additionalFileInputRef.current.click();
        } else {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="bg-theme-surface rounded-lg shadow-sm border p-6">
            {/* Profile Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                    {/* Main Profile Image with Upload */}
                    <div className="relative">
                        <div className="relative group">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    B
                                </div>
                            )}

                            {/* Upload Overlay */}
                            <div
                                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => openFileDialog(false)}
                            >
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        {/* Online Status */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-theme-success rounded-full border-3 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-theme-surface rounded-full"></div>
                        </div>
                    </div>

                    {/* Profile IDs */}
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-lg text-sm">
                                SH27142336
                                <h1>  SH27142336</h1>
                            </div>
                            <div className="text-xl font-bold text-gray-800">SH27142336</div>
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center text-theme-text-secondary hover:text-blue-600 text-sm"
                        >
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                        </button>
                    </div>
                </div>

                {/* Hidden file input for main image */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                />
            </div>

            {/* Additional Images Gallery */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-700">Additional Photos</h3>
                    <span className="text-sm text-theme-text-secondary">{additionalImages.length}/10</span>
                </div>

                <div className="flex space-x-3 overflow-x-auto pb-2">
                    {/* Add More Button */}
                    <div className="relative">
                        <button
                            onClick={() => openFileDialog(true)}
                            className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-colors"
                        >
                            <Plus className="w-6 h-6" />
                            <span className="text-xs mt-1">Add</span>
                        </button>
                        <input
                            type="file"
                            ref={additionalFileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true)}
                        />
                    </div>

                    {/* Additional Images */}
                    {additionalImages.map((img, index) => (
                        <div key={index} className="relative">
                            <img
                                src={img}
                                alt={`Additional ${index + 1}`}
                                className="w-16 h-16 rounded-lg object-cover border"
                            />
                            <button
                                onClick={() => removeAdditionalImage(index)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Account Type */}
            <div className="mb-4">
                <div className="text-sm text-theme-text-secondary mb-1">Account Type</div>
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-pink-600">Free Membership</div>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded text-sm font-medium">
                        Upgrade
                    </button>
                </div>
            </div>

            {/* Verification */}
            <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-theme-text-secondary mb-1">Standout with Verification</div>
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                            Get Blue Tick
                        </button>
                    </div>
                    <div className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-theme-success rounded-full mr-2"></div>
                        <span className="text-green-600 font-medium">Verified</span>
                    </div>
                </div>
            </div>

            {/* Edit Mode */}
            {isEditing && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-bold mb-3">Edit Profile</h4>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm text-theme-text-secondary mb-1">Display Name</label>
                            <input
                                type="text"
                                defaultValue="BIGITALIZER"
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-theme-text-secondary mb-1">Bio</label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-lg"
                                rows="2"
                                placeholder="Tell about yourself..."
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileWithImage;