import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { motion } from "framer-motion";
import api from "../../services/api";

import {
  HeartHandshake,
  Cake,
  Languages,
  MapPin,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Utensils,
  Cigarette,
  Wine,
  ShieldCheck,
} from "lucide-react";

export default function PartnerPreferenceForm({ onNext }) {

  const {
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {

    try {

      await api.post(
        "/preferences",
        data
      );

      Swal.fire({ text: "Profile Completed Successfully", confirmButtonColor: '#8C6D39' });

      if (onNext) {
        onNext();
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
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
            <HeartHandshake className="text-white" size={30} />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Partner Preferences
            </h2>

            <p className="text-theme-text-secondary mt-1 text-sm md:text-base">
              Define your ideal life partner preferences
            </p>
          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            {/* MIN AGE */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Cake size={16} />
                Minimum Age
              </label>

              <select
                {...register("ageMin")}
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
                <option value="">Select Minimum Age</option>

                {Array.from({ length: 20 }, (_, i) => (
                  <option key={i + 18}>
                    {i + 18}
                  </option>
                ))}

              </select>

            </div>

            {/* MAX AGE */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Cake size={16} />
                Maximum Age
              </label>

              <select
                {...register("ageMax")}
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
                <option value="">Select Maximum Age</option>

                {Array.from({ length: 25 }, (_, i) => (
                  <option key={i + 22}>
                    {i + 22}
                  </option>
                ))}

              </select>

            </div>

            {/* RELIGION */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <HeartHandshake size={16} />
                Religion
              </label>

              <select
                {...register("religion")}
                className="w-full h-14 px-5 rounded-2xl border border-theme-border bg-gray-50 focus:bg-theme-surface focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-sm text-gray-700"
              >
                <option>Open</option>
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Christian</option>
                <option>Sikh</option>
                <option>Buddhist</option>
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
                className="w-full h-14 px-5 rounded-2xl border border-theme-border bg-gray-50 focus:bg-theme-surface focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-sm text-gray-700"
              >
                <option>Open</option>
                <option>Marathi</option>
                <option>Hindi</option>
                <option>English</option>
                <option>Gujarati</option>
                <option>Punjabi</option>
              </select>

            </div>

            {/* CITY */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <MapPin size={16} />
                Preferred City
              </label>

              <select
                {...register("city")}
                className="w-full h-14 px-5 rounded-2xl border border-theme-border bg-gray-50 focus:bg-theme-surface focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-sm text-gray-700"
              >
                <option>Open</option>
                <option>Pune</option>
                <option>Mumbai</option>
                <option>Nashik</option>
                <option>Bangalore</option>
                <option>Hyderabad</option>
              </select>

            </div>

            {/* EDUCATION */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <GraduationCap size={16} />
                Education
              </label>

              <select
                {...register("education")}
                className="w-full h-14 px-5 rounded-2xl border border-theme-border bg-gray-50 focus:bg-theme-surface focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-sm text-gray-700"
              >
                <option>Open</option>
                <option>B.Tech</option>
                <option>MBA</option>
                <option>MCA</option>
                <option>MBBS</option>
                <option>CA</option>
              </select>

            </div>

            {/* PROFESSION */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Briefcase size={16} />
                Profession
              </label>

              <select
                {...register("profession")}
                className="w-full h-14 px-5 rounded-2xl border border-theme-border bg-gray-50 focus:bg-theme-surface focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-sm text-gray-700"
              >
                <option>Open</option>
                <option>Software Engineer</option>
                <option>Doctor</option>
                <option>Business</option>
                <option>Government Job</option>
                <option>Teacher</option>
              </select>

            </div>

            {/* INCOME */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <IndianRupee size={16} />
                Income Preference
              </label>

              <select
                {...register("income")}
                className="w-full h-14 px-5 rounded-2xl border border-theme-border bg-gray-50 focus:bg-theme-surface focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-sm text-gray-700"
              >
                <option>Open</option>
                <option>3+ LPA</option>
                <option>5+ LPA</option>
                <option>10+ LPA</option>
                <option>20+ LPA</option>
              </select>

            </div>

            {/* DIET */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Utensils size={16} />
                Diet Preference
              </label>

              <select
                {...register("diet")}
                className="w-full h-14 px-5 rounded-2xl border border-theme-border bg-gray-50 focus:bg-theme-surface focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-sm text-gray-700"
              >
                <option>Open</option>
                <option>Vegetarian</option>
                <option>Non Vegetarian</option>
                <option>Eggetarian</option>
              </select>

            </div>

            {/* SMOKING */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Cigarette size={16} />
                Smoking Preference
              </label>

              <select
                {...register("smoking")}
                className="w-full h-14 px-5 rounded-2xl border border-theme-border bg-gray-50 focus:bg-theme-surface focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-sm text-gray-700"
              >
                <option>Open</option>
                <option>No</option>
                <option>Occasionally</option>
                <option>Yes</option>
              </select>

            </div>

            {/* DRINKING */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Wine size={16} />
                Drinking Preference
              </label>

              <select
                {...register("drinking")}
                className="w-full h-14 px-5 rounded-2xl border border-theme-border bg-gray-50 focus:bg-theme-surface focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all shadow-sm text-gray-700"
              >
                <option>Open</option>
                <option>No</option>
                <option>Occasionally</option>
                <option>Yes</option>
              </select>

            </div>

          </div>

          {/* VERIFIED CHECKBOX */}
          <div className="
            flex
            items-center
            gap-4
            bg-pink-50
            border
            border-pink-100
            rounded-2xl
            p-5
          ">

            <input
              type="checkbox"
              {...register("verifiedProfilesOnly")}
              className="
                w-5
                h-5
                accent-pink-500
              "
            />

            <div>
              <p className="font-semibold text-gray-800 flex items-center gap-2">
                <ShieldCheck size={18} className="text-pink-500" />
                Show Verified Profiles Only
              </p>

              <p className="text-sm text-theme-text-secondary mt-1">
                Get better trusted matches with verified accounts
              </p>
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
              Complete Profile
            </button>

          </div>

        </form>

      </div>

    </motion.div>
  );
}