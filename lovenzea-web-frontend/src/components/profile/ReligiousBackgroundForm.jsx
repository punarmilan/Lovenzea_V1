import { useForm } from "react-hook-form";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Heart,
  Languages,
  Users,
  Sparkles,
  MapPin,
} from "lucide-react";
import {
  religionOptions,
  motherTongueOptions,
  manglikOptions,
  communityOptions,
  rashiOptions,
  nakshatraOptions,
  astroVisibilityOptions,
  subCommunityOptions,
  gotraOptions,
  timeOfBirthOptions
} from "../../constants/profileOptions";
import api from "../../services/api";

export default function ReligiousBackgroundForm({ onNext }) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {

    try {

      await api.patch(
      "/profiles/me",
        data
      );

      onNext();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="mb-10">

        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
            <User className="text-white" size={26} />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Religious Background
            </h2>

            <p className="text-theme-text-secondary mt-1">
              Tell us about yourself to create your perfect profile
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >

        {/* FORM CARD */}
        <div className="bg-gradient-to-br from-white to-pink-50 border border-pink-100 rounded-[30px] p-8 shadow-xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            {/* RELIGION */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Sparkles size={16} />
                Religion
              </label>

              <select
                {...register("religion")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              >
                <option value="">
                  Select Religion
                </option>

                {religionOptions.map((religion) => (
                  <option
                    key={religion}
                    value={religion}
                  >
                    {religion}
                  </option>
                ))}
              </select>
            </div>

            {/* MANGLIK */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Heart size={16} />
                Manglik/Chevvai Dosham 
              </label>

              <select
                {...register("manglikStatus")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              >
                <option value="">Select Status</option>
                {manglikOptions.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
              </select>
            </div>

            {/* COMMUNITY */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Users size={16} />
                Community
              </label>

              <select
                {...register("caste")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              >
                <option value="">
                Select Community
                </option>

                {communityOptions.map((community) => (
                  <option
                    key={community}
                    value={community}
                  >
                    {community}
                  </option>
                ))}
              </select>
            </div>

            {/* SUB-COMMUNITY */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Users size={16} />
                Sub-Community
              </label>

              <select
                {...register("subCaste")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              >
                <option value="">Select Status</option>
                {subCommunityOptions.map((item) => (
                <option
                  key={item}
                  value={item} 
                >
                  {item}
                </option>
              ))}
              </select>
            </div>

            {/* Gothra / Gothram */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Users size={16} />
                Gothra / Gothram
              </label>

              <select
                {...register("gotra")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              >
                <option value="">Select Gothra / Gothram</option>
                 {gotraOptions.map((item) => (
                <option
                  key={item}
                  value={item} 
                >
                  {item}
                </option>
              ))}
              </select>
            </div>

            {/* MOTHER TONGUE */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Languages size={16} />
                Mother Tongue
              </label>

               <select
                {...register("motherTongue")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              >
                <option value="">Select Mother Tongue</option>
                {motherTongueOptions.map((language) => (
                  <option
                    key={language}
                    value={language}
                  >
                    {language}
                  </option>
                ))}
              </select>
            </div>

          {/* Time Of Birth */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Sparkles size={16} />
                Time Of Birth
              </label>

              <select
                {...register("timeOfBirth")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              >
                <option value="">Select Time Of Birth</option>
                {timeOfBirthOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
                
              </select>
            </div>

            {/* City Of Birth */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <MapPin size={16} />
                City Of Birth
              </label>

              <input
                type="text"
                placeholder="Enter city of birth...."
                {...register("placeOfBirth")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-gray-50
                  focus:bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              />
            </div>

            {/* nakshatra */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Heart size={16} />
                nakshatra 
              </label>

              <select
                {...register("nakshatra")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              >
                <option value="">Select nakshatra</option>
                {nakshatraOptions.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
                ))}
              </select>
            </div>

            {/* rashi */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Users size={16} />
                Rashi
              </label>

              <select
                {...register("rashi")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              >
                <option value="">Select Rashi</option>
                {rashiOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Astro Visibility */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Users size={16} />
                Astro Visibility
              </label>

              <select
                {...register("astroVisibility")}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  border border-theme-border
                  bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                   shadow-sm
                "
                 required
              >
                <option value="">Select Astro Visibility</option>
                {astroVisibilityOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end">

          <button
            type="submit"
            className="
              px-10
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-pink-500
              to-rose-500
              text-white
              font-semibold
              shadow-lg
              hover:shadow-pink-300
              hover:scale-105
              active:scale-95
              transition-all
              duration-300
            "
          >
            Save & Continue
          </button>

        </div>

      </form>
    </div>
  );
}