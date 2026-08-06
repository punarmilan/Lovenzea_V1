// ProfileStepper.jsx

import { Check } from "lucide-react";

export default function ProfileStepper({
  steps,
  currentStep,
}) {
  return (
    <div className="w-full">

      {/* PROGRESS BAR */}
      <div className="relative mb-12">

        <div className="absolute top-5 left-0 w-full h-1 bg-pink-100 rounded-full"></div>

        <div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        <div className="relative flex justify-between">

          {steps.map((step, index) => {
            const Icon = step.icon;

            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div
                key={index}
                className="flex flex-col items-center relative z-10"
              >

                {/* STEP CIRCLE */}
                <div
                  className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center
                    transition-all duration-300 shadow-lg border-4

                    ${
                      isCompleted
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 border-pink-100 text-white"
                        : isActive
                        ? "bg-theme-surface border-pink-500 text-pink-600 scale-110"
                        : "bg-theme-surface border-theme-border text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>

                {/* LABEL */}
                <p
                  className={`
                    mt-3 text-sm font-semibold text-center transition-all duration-300

                    ${
                      isActive
                        ? "text-pink-600"
                        : isCompleted
                        ? "text-gray-700"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.title}
                </p>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}