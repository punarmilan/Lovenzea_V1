import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";

import {
  GraduationCap,
  BookOpen,
  Building2,
  Briefcase,
  MapPin,
  IndianRupee,
  Sparkles,
} from "lucide-react";
import api from "../../services/api"

export default function EducationCareerForm({ onNext }) {

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
console.log("education", data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="
        bg-theme-surface/90
        backdrop-blur-xl
        rounded-[32px]
        border
        border-pink-100
        shadow-2xl
        overflow-hidden
      "
    >

      {/* TOP GRADIENT */}
      <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400"></div>

      <div className="p-8 md:p-10">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">

          <div className="
            w-16
            h-16
            rounded-3xl
            bg-gradient-to-r
            from-pink-500
            to-rose-500
            flex
            items-center
            justify-center
            shadow-lg
          ">
            <GraduationCap className="text-white" size={30} />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Education & Career
            </h2>

            <p className="text-theme-text-secondary mt-1 text-sm md:text-base">
              Add your educational and professional details
            </p>
          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            {/* QUALIFICATION */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <GraduationCap size={16} />
                Highest Qualification
              </label>

              <select
                {...register("educationLevel", {
                  required: "Qualification required",
                })}
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
                  text-gray-700
                "
              >
                <option value="">Select Qualification</option>

                <optgroup label="Engineering">
                  <option>B.Tech</option>
                  <option>M.Tech</option>
                  <option>B.E</option>
                  <option>M.E</option>
                </optgroup>

                <optgroup label="Computer Applications">
                  <option>BCA</option>
                  <option>MCA</option>
                </optgroup>

                <optgroup label="Medical">
                  <option>MBBS</option>
                  <option>BDS</option>
                  <option>MD</option>
                </optgroup>

                <optgroup label="Management">
                  <option>MBA</option>
                  <option>PGDM</option>
                </optgroup>

                <optgroup label="Commerce">
                  <option>B.Com</option>
                  <option>M.Com</option>
                  <option>CA</option>
                </optgroup>

              </select>

              <p className="text-red-500 text-sm mt-2">
                {errors.education?.message}
              </p>
            </div>

            {/* EDUCATION FIELD */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <BookOpen size={16} />
                Education Field
              </label>

              <input
                type="text"
                placeholder="Computer Science"
                {...register("educationField")}
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
              />
            </div>

            {/* COLLEGE */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Building2 size={16} />
                College Name
              </label>

              <input
                type="text"
                placeholder="XYZ College"
                {...register("college")}
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
              />
            </div>

            {/* WORKING WITH */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Briefcase size={16} />
                Working With
              </label>

              <select
                {...register("workingWith")}
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
                  text-gray-700
                "
              >
                <option value="">Select Profession Type</option>

                <option>Private Company</option>
                <option>Government / PSU</option>
                <option>Business Owner</option>
                <option>Startup Founder</option>
                <option>Self Employed</option>
                <option>Freelancer</option>
                <option>Not Working</option>

              </select>
            </div>

            {/* PROFESSION */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Sparkles size={16} />
                Profession
              </label>

              <input
                type="text"
                placeholder="Software Engineer"
                {...register("occupation")}
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
              />
            </div>

            {/* COMPANY */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Building2 size={16} />
                Company Name
              </label>

              <input
                type="text"
                placeholder="TCS, Infosys, Accenture..."
                {...register("company")}
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
              />
            </div>

            {/* WORKING CITY */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <MapPin size={16} />
                Working City
              </label>

              <select
                {...register("workingCity")}
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
                  text-gray-700
                "
              >
                <option value="">Select City</option>

                <option>Pune</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Hyderabad</option>
                <option>Chennai</option>
                <option>Delhi</option>
                <option>Nashik</option>
                <option>Nagpur</option>

              </select>
            </div>

            {/* INCOME */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <IndianRupee size={16} />
                Annual Income
              </label>

              <select
                {...register("annualIncome")}
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
                  text-gray-700
                "
              >
                <option value="">Select Income</option>

                <option>Below 1 LPA</option>
                <option>1 - 3 LPA</option>
                <option>3 - 5 LPA</option>
                <option>5 - 10 LPA</option>
                <option>10 - 20 LPA</option>
                <option>20+ LPA</option>
                <option>Prefer Not To Say</option>

              </select>
            </div>

          </div>

          {/* BUTTON */}
          <div className="flex justify-end pt-4">

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
                text-lg
                shadow-lg
                hover:scale-105
                hover:shadow-pink-300
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

    </motion.div>
  );
}