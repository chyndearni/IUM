"use client";
import React, { useEffect, useState } from "react";
import UserProfileForm from "@/components/resume/UserProfileForm";
import LocationForm from "@/components/resume/LocationForm";
import SummaryForm from "@/components/resume/SummaryForm";
import EducationForm from "@/components/resume/EducationForm";
import ExperienceForm from "@/components/resume/ExperienceForm";
import TrainingForm from "@/components/resume/TrainingForm";
import CertificationForm from "@/components/resume/CertificationForm";
import SkillsForm from "@/components/resume/SkillsForm";
import LanguageSkillsForm from "@/components/resume/LanguageSkillsForm";
import AchievementForm from "@/components/resume/AchievementForm";

import {
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  FileText,
  GraduationCap,
  Briefcase,
  Award,
  Shield,
  Zap,
  Globe,
  Trophy,
} from "lucide-react";
// import ResumeStepSkeleton from "@/skeleton/ResumeStepSkeleton";

const StepComponent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []); // Empty dependency array - runs once

  if (loading) {
    // return <ResumeStepSkeleton />;
    return "Loading...";
  }

  const stepData = [
    { title: "Profile", icon: User, description: "Informasi dasar" },
    { title: "Lokasi", icon: MapPin, description: "Lokasi tempat tinggal" },
    {
      title: "Ringkasan Pribadi",
      icon: FileText,
      description: "Tentang diri Anda",
    },
    {
      title: "Pendidikan",
      icon: GraduationCap,
      description: "Riwayat pendidikan",
    },
    {
      title: "Pengalaman Kerja",
      icon: Briefcase,
      description: "Karir profesional",
    },
    { title: "Pelatihan", icon: Award, description: "Program pelatihan" },
    {
      title: "Sertifikasi",
      icon: Shield,
      description: "Sertifikat yang dimiliki",
    },
    { title: "Keterampilan", icon: Zap, description: "Skill dan kemampuan" },
    { title: "Bahasa", icon: Globe, description: "Kemampuan bahasa" },
    {
      title: "Pencapaian",
      icon: Trophy,
      description: "Prestasi dan penghargaan",
    },
  ];

  const stepComponents = [
    <UserProfileForm key="step-1" />,
    <LocationForm key="step-2" />,
    <SummaryForm key="step-3" />,
    <EducationForm key="step-4" />,
    <ExperienceForm key="step-5" />,
    <TrainingForm key="step-6" />,
    <CertificationForm key="step-7" />,
    <SkillsForm key="step-8" />,
    <LanguageSkillsForm key="step-9" />,
    <AchievementForm key="step-10" />,
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  return (
    <div className="transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Lengkap Profile Anda
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Step {currentStep} of {totalSteps} -{" "}
            {stepData[currentStep - 1].description}
          </p>

          {/* Progress Bar */}
          <div className="max-w-xl mx-auto">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(getProgressPercentage())}% Selesai
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="w-full mx-auto mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stepData.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              const IconComponent = step.icon;

              return (
                <div
                  key={stepNumber}
                  onClick={() => goToStep(stepNumber)}
                  className="group cursor-pointer"
                >
                  {/* Step Card */}
                  <div
                    className={`
                    relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105
                    ${
                      isActive
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 border-transparent text-white shadow-xl shadow-blue-500/25"
                        : isCompleted
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 border-transparent text-white shadow-lg shadow-green-500/20"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg"
                    }
                  `}
                  >
                    {/* Icon */}
                    <div className="flex justify-center mb-2 sm:mb-3">
                      <div
                        className={`
                        p-2 sm:p-3 rounded-xl transition-all duration-300
                        ${
                          isActive || isCompleted
                            ? "bg-white/20 backdrop-blur-sm"
                            : "bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30"
                        }
                      `}
                      >
                        <IconComponent
                          size={20}
                          className={`
                            sm:w-6 sm:h-6
                            ${
                              isActive || isCompleted
                                ? "text-white"
                                : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            }
                          `}
                        />
                      </div>
                    </div>

                    {/* Step Title */}
                    <h3
                      className={`
                      text-xs sm:text-sm font-semibold text-center leading-tight
                      ${
                        isActive || isCompleted
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }
                    `}
                    >
                      {step.title}
                    </h3>

                    {/* Step Number Badge */}
                    <div
                      className={`
                      absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${
                        isActive
                          ? "bg-yellow-400 text-gray-900"
                          : isCompleted
                          ? "bg-white text-green-600"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                      }
                    `}
                    >
                      {isCompleted ? "✓" : stepNumber}
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-600/20 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="w-full mx-auto">
          {/* Current Step content Form start */}
          <div className="mb-12">{stepComponents[currentStep - 1]}</div>
          {/* Current Step content Form end */}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`
                flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all duration-300 transform text-sm sm:text-base
                ${
                  currentStep === 1
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105 shadow-md hover:shadow-lg"
                }
              `}
            >
              <ChevronLeft size={16} className="mr-1 sm:mr-2 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep === totalSteps}
              className={`
                flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-all duration-300 transform text-sm sm:text-base
                ${
                  currentStep === totalSteps
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-md hover:shadow-lg"
                }
              `}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight size={16} className="ml-1 sm:ml-2 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepComponent;
