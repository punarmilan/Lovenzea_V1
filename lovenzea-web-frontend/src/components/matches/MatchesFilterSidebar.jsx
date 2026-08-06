import React, { useState } from "react";
import {
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Ruler,
  Languages,
  Heart
} from "lucide-react";

const FilterSection = ({
  title,
  icon,
  options,
  expanded,
  onToggle
}) => {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-gray-800">
            {title}
          </span>
        </div>

        {expanded ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 accent-pink-500"
              />
              <span className="text-sm text-theme-text-secondary">
                {option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default function MatchesFilterSidebar({
  isOpen,
  onClose
}) {
  const [expanded, setExpanded] = useState({
    marital: true,
    religion: false,
    caste: false,
    tongue: false,
    education: false,
    profession: false,
    income: false,
    location: false,
    height: false,
  });

  const toggle = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}

      <div
        className="fixed inset-0 bg-black/40 z-[9998]"
        onClick={onClose}
      />

      {/* Sidebar */}

      <div className="fixed top-0 right-0 h-screen w-full max-w-[360px] max-w-[90vw] bg-theme-surface z-[9999] shadow-2xl flex flex-col">

        {/* Header */}

        <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-pink-500 to-rose-500 text-white">

          <div className="flex items-center gap-2">
            <Filter size={20} />
            <h2 className="font-bold text-lg">
              Match Filters
            </h2>
          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        {/* Quick Filters */}

        <div className="p-4 border-b">

          <h3 className="font-semibold mb-3">
            Quick Filters
          </h3>

          <div className="flex flex-wrap gap-2">

            {[
              "Verified",
              "Premium",
              "With Photo",
              "Online Now",
              "Recently Active",
              "New Profiles"
            ].map((item) => (
              <button
                key={item}
                className="px-3 py-2 rounded-full bg-pink-50 text-pink-600 text-sm hover:bg-pink-100"
              >
                {item}
              </button>
            ))}

          </div>

        </div>

        {/* Filters */}

        <div className="flex-1 overflow-y-auto">

          <FilterSection
            title="Marital Status"
            icon={<Heart size={18} />}
            expanded={expanded.marital}
            onToggle={() => toggle("marital")}
            options={[
              "Never Married",
              "Divorced",
              "Widowed",
              "Awaiting Divorce"
            ]}
          />

          <FilterSection
            title="Religion"
            icon={<Heart size={18} />}
            expanded={expanded.religion}
            onToggle={() => toggle("religion")}
            options={[
              "Hindu",
              "Buddhist",
              "Jain",
              "Sikh",
              "Muslim",
              "Christian"
            ]}
          />

          <FilterSection
            title="Caste"
            icon={<Heart size={18} />}
            expanded={expanded.caste}
            onToggle={() => toggle("caste")}
            options={[
              "Maratha",
              "Kunbi",
              "Brahmin",
              "Jain",
              "SC",
              "ST",
              "OBC"
            ]}
          />

          <FilterSection
            title="Mother Tongue"
            icon={<Languages size={18} />}
            expanded={expanded.tongue}
            onToggle={() => toggle("tongue")}
            options={[
              "Marathi",
              "Hindi",
              "English",
              "Gujarati",
              "Kannada",
              "Telugu"
            ]}
          />

          <FilterSection
            title="Education"
            icon={<GraduationCap size={18} />}
            expanded={expanded.education}
            onToggle={() => toggle("education")}
            options={[
              "Graduate",
              "Post Graduate",
              "Engineer",
              "Doctor",
              "MBA",
              "PhD"
            ]}
          />

          <FilterSection
            title="Profession"
            icon={<Briefcase size={18} />}
            expanded={expanded.profession}
            onToggle={() => toggle("profession")}
            options={[
              "Software Engineer",
              "Doctor",
              "Teacher",
              "Business",
              "Government Job"
            ]}
          />

          <FilterSection
            title="Income"
            icon={<IndianRupee size={18} />}
            expanded={expanded.income}
            onToggle={() => toggle("income")}
            options={[
              "0-5 LPA",
              "5-10 LPA",
              "10-20 LPA",
              "20-50 LPA",
              "50+ LPA"
            ]}
          />

          <FilterSection
            title="Location"
            icon={<MapPin size={18} />}
            expanded={expanded.location}
            onToggle={() => toggle("location")}
            options={[
              "Pune",
              "Mumbai",
              "Nagpur",
              "Nashik",
              "Delhi",
              "Bangalore"
            ]}
          />

          <FilterSection
            title="Height"
            icon={<Ruler size={18} />}
            expanded={expanded.height}
            onToggle={() => toggle("height")}
            options={[
              "4'10\" - 5'2\"",
              "5'3\" - 5'5\"",
              "5'6\" - 5'8\"",
              "5'9\" - 6'0\"",
              "6'+"
            ]}
          />

        </div>

        {/* Footer */}

        <div className="border-t p-4 bg-theme-surface">

          <div className="flex gap-3">

            <button
              className="flex-1 border rounded-xl py-1 font-medium"
            >
              Reset
            </button>

            <button
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl py-1 font-medium"
            >
              Apply Filters
            </button>

          </div>

        </div>

      </div>
    </>
  );
}