import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import api from "../../services/api";

import {
  MapPin,
  Home,
  Building2,
  Globe2,
  Landmark,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function LocationForm({ onNext }) {

  const {
    register,
    handleSubmit,
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
            <MapPin className="text-white" size={30} />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Location Details
            </h2>

            <p className="text-theme-text-secondary mt-1 text-sm md:text-base">
              Add your residential & location information
            </p>
          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            {/* ADDRESS */}
            <div className="md:col-span-2">

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Home size={16} />
                Residential Address
              </label>

              <textarea
                rows="5"
                placeholder="Enter your complete address..."
                {...register("address")}
                className="
                  w-full
                  p-5
                  rounded-3xl
                  border border-theme-border
                  bg-gray-50
                  focus:bg-theme-surface
                  focus:border-pink-500
                  focus:ring-4
                  focus:ring-pink-100
                  outline-none
                  transition-all
                  shadow-sm
                  resize-none
                "
              />
            </div>

            {/* CITY */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Building2 size={16} />
                Current City
              </label>

              <select
                {...register("city")}
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
                <option>Nashik</option>
                <option>Bangalore</option>
                <option>Hyderabad</option>
                <option>Delhi</option>
                <option>Chennai</option>
                <option>Nagpur</option>

              </select>

            </div>

            {/* STATE */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Landmark size={16} />
                State
              </label>

              <select
                {...register("state")}
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
                <option value="">Select State</option>

                <option>Maharashtra</option>
                <option>Karnataka</option>
                <option>Telangana</option>
                <option>Gujarat</option>
                <option>Delhi</option>
                <option>Tamil Nadu</option>

              </select>

            </div>

            {/* COUNTRY */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Globe2 size={16} />
                Country
              </label>

              <select
                defaultValue="India"
                {...register("country")}
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
                <option>India</option>
                <option>USA</option>
                <option>Canada</option>
                <option>UK</option>
                <option>Australia</option>

              </select>

            </div>

            {/* RESIDENCY */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <ShieldCheck size={16} />
                Residency Status
              </label>

              <select
                {...register("residencyStatus")}
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
                <option value="">Select Status</option>

                <option>Citizen</option>
                <option>Permanent Resident</option>
                <option>Student Visa</option>
                <option>Work Permit</option>

              </select>

            </div>

            {/* PINCODE */}
            <div>

              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Mail size={16} />
                Zip / Pin Code
              </label>

              <input
                type="text"
                placeholder="422003"
                {...register("zipCode")}
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