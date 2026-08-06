// CompleteProfile.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Users,
  GraduationCap,
  MapPin,
  Heart,
  Sparkles,
} from "lucide-react";

import ProfileStepper from "../components/profile/ProfileStepper";

import ReligiousBackgroundForm from "../components/profile/ReligiousBackgroundForm";
import FamilyDetailsForm from "../components/profile/FamilyDetailsForm";
import EducationCareerForm from "../components/profile/EducationCareerForm";
import LocationForm from "../components/profile/LocationForm";
import LifestyleForm from "../components/profile/LifestyleForm";
import PartnerPreferenceForm from "../components/profile/PartnerPreferenceForm";

const steps = [
  {
    title: "Religious Background",
    icon: User,
  },
  {
    title: "Family",
    icon: Users,
  },
  {
    title: "Career",
    icon: GraduationCap,
  },
  {
    title: "Location",
    icon: MapPin,
  },
  {
    title: "Lifestyle",
    icon: Heart,
  },
  {
    title: "Preferences",
    icon: Sparkles,
  },
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = sessionStorage.getItem("completeProfileStep");
    return savedStep ? parseInt(savedStep, 10) : 0;
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      sessionStorage.setItem("completeProfileStep", next.toString());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>

          <p className="text-theme-text-secondary mt-3 text-lg">
            Find your perfect life partner ❤️
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-theme-surface/80 backdrop-blur-xl border border-pink-100 shadow-2xl rounded-[32px] overflow-hidden">

          {/* TOP GRADIENT */}
          <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400"></div>

          <div className="p-8 md:p-12">

            {/* STEPPER */}
            <ProfileStepper
              steps={steps}
              currentStep={currentStep}
            />

            {/* FORM AREA */}
            <div className="mt-14">

              {currentStep === 0 && (
                <ReligiousBackgroundForm onNext={nextStep} />
              )}

              {currentStep === 1 && (
                <FamilyDetailsForm onNext={nextStep} />
              )}

              {currentStep === 2 && (
                <EducationCareerForm onNext={nextStep} />
              )}

              {currentStep === 3 && (
                <LocationForm onNext={nextStep} />
              )}

              {currentStep === 4 && (
                <LifestyleForm onNext={nextStep} />
              )}

              {currentStep === 5 && (
                <PartnerPreferenceForm onNext={() => {
                  sessionStorage.removeItem("completeProfileStep");
                  navigate("/my-shadi");
                }} />
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}