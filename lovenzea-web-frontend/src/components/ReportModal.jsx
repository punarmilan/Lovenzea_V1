import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { submitReport, resetReportState } from '../Slice/ReportSlice';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const reportCategories = [
    {
        id: 'fake',
        title: 'Fake/Misleading Profile',
        reasons: [
            'Incorrect Profile information',
            'Phone number is incorrect/unreachable',
            'More than one Profile on LovenZea.com',
            'Photo belongs to someone else',
            'Not responding'
        ]
    },
    {
        id: 'behaviour',
        title: 'Inappropriate/Unacceptable behaviour',
        reasons: [
            'Member uses abusive/indecent language',
            'Member calls/texts me repeatedly',
            'Looking for dating/casual relationship',
            'Asking for money/Scammer'
        ]
    },
    {
        id: 'married',
        title: 'Member is already married/engaged',
        reasons: [
            'I know this person',
            'Told by Member over chat/phone',
            'Found through social media/acquaintance'
        ]
    },
    {
        id: 'photo',
        title: 'Photo related',
        reasons: [
            'Irrelevant Photo',
            'Inappropriate/Indecent Photo',
            'Photo belongs to someone else'
        ]
    }
];

const ReportModal = ({ isOpen, onClose, reportedUser }) => {
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector((state) => state.report);

    const [expandedCategory, setExpandedCategory] = useState(null);
    const [selectedReasons, setSelectedReasons] = useState({}); // { categoryId: [reasons] }

    useEffect(() => {
        if (success) {
            toast.success('Report submitted successfully.');
            handleClose();
        }
        if (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to submit report');
            dispatch(resetReportState());
        }
    }, [success, error, dispatch]);

    const handleClose = () => {
        setExpandedCategory(null);
        setSelectedReasons({});
        dispatch(resetReportState());
        onClose();
    };

    const toggleCategory = (id) => {
        setExpandedCategory(expandedCategory === id ? null : id);
    };

    const handleReasonChange = (categoryId, reason) => {
        setSelectedReasons(prev => {
            const current = prev[categoryId] || [];
            if (current.includes(reason)) {
                return { ...prev, [categoryId]: current.filter(r => r !== reason) };
            } else {
                return { ...prev, [categoryId]: [...current, reason] };
            }
        });
    };

    const handleSubmit = () => {
        const categoriesWithSelection = Object.keys(selectedReasons).filter(catId => selectedReasons[catId].length > 0);

        if (categoriesWithSelection.length === 0) {
            toast.error('Please select at least one reason for reporting');
            return;
        }

        const consolidatedReason = categoriesWithSelection
            .map(catId => {
                const category = reportCategories.find(c => c.id === catId);
                return `${category.title}: ${selectedReasons[catId].join(', ')}`;
            })
            .join(' | ');

        dispatch(submitReport({
            reportedUserId: reportedUser?.id,
            reason: consolidatedReason,
            description: `Auto-generated report from categories: ${consolidatedReason}`
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-theme-surface rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-theme-surface sticky top-0 z-10">
                    <h3 className="text-[17px] font-semibold text-gray-700">
                        Report {reportedUser?.profileId || reportedUser?.id} to our Security Team
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-300 hover:text-theme-text-secondary transition-colors"
                    >
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Categories List */}
                <div className="flex-1 overflow-y-auto subtle-scrollbar p-0">
                    {reportCategories.map((category) => {
                        const isExpanded = expandedCategory === category.id;
                        const hasSelected = (selectedReasons[category.id] || []).length > 0;

                        return (
                            <div key={category.id} className="border-b border-gray-100">
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className={`w-full flex justify-between items-center p-5 text-left transition-colors hover:bg-gray-50/50 ${isExpanded ? 'bg-theme-surface' : ''}`}
                                >
                                    <span className={`text-[15px] font-normal transition-colors ${isExpanded || hasSelected ? 'text-rose-500' : 'text-theme-text-secondary'}`}>
                                        {category.title}
                                    </span>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-300" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-300" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden bg-theme-surface"
                                        >
                                            <div className="px-5 pb-5 space-y-4">
                                                {category.reasons.map((reason) => {
                                                    const isChecked = (selectedReasons[category.id] || []).includes(reason);
                                                    return (
                                                        <label
                                                            key={reason}
                                                            className="flex items-center gap-4 cursor-pointer group"
                                                        >
                                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isChecked ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                                {isChecked && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="w-2.5 h-2.5 bg-theme-surface rounded-sm"
                                                                    />
                                                                )}
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={isChecked}
                                                                onChange={() => handleReasonChange(category.id, reason)}
                                                            />
                                                            <span className="text-[14px] text-theme-text-secondary font-normal">
                                                                {reason}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-6 bg-theme-surface border-t border-gray-50 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#00BCD4] text-white px-10 py-2.5 rounded shadow-sm hover:bg-[#00ACC1] transition-all font-semibold text-[15px] disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ReportModal;

