import { useForm } from "react-hook-form";
import {
  Users,
  MapPin,
  Briefcase,
  HeartHandshake,
  UserRound,
  UserRoundPlus,
  Home,
} from "lucide-react";
import { Heart } from "lucide-react";
 import {
  familyAnnualIncome,
} from "../../constants/profileOptions";
import api from "../../services/api";

export default function FamilyDetailsForm({ onNext }) {

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

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
            <Users className="text-white" size={26} />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Family Details
            </h2>

            <p className="text-theme-text-secondary mt-1">
              Add details about your family background
            </p>
          </div>

        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >

        {/* CARD */}
        <div className="bg-gradient-to-br from-white to-pink-50 border border-pink-100 rounded-[30px] p-8 shadow-xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            {/* FATHER STATUS */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <UserRound size={16} />
                Father Status
              </label>

              <select
                {...register("fatherStatus")}
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
              >
                <option value="">Select Father Status</option>
                <option>Working</option>
                <option>Business</option>
                <option>Retired</option>
                <option>Not Alive</option>
              </select>
            </div>

            {/* MOTHER STATUS */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <HeartHandshake size={16} />
                Mother Status
              </label>

              <select
                {...register("motherStatus")}
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
              >
                <option value="">Select Mother Status</option>
                <option>Homemaker</option>
                <option>Working</option>
                <option>Business</option>
                <option>Retired</option>
                <option>Not Alive</option>
              </select>
            </div>

            {/* FAMILY LOCATION */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <MapPin size={16} />
                Family Location
              </label>

              <input
                type="text"
                placeholder="Enter family city"
                {...register("familyLocation")}
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
              />
            </div>

            {/* FAMILY TYPE */}
            {/* <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Home size={16} />
                Family Type
              </label>

              <select
                {...register("familyType")}
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
              >
                <option value="">Select Family Type</option>
                <option>Nuclear Family</option>
                <option>Joint Family</option>
              </select>
            </div> */}

            {/* FINANCIAL STATUS */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Briefcase size={16} />
                Family Financial Status
              </label>

              <select
                {...register("familyFinancialStatus")}
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
              >
                <option value="">Select Financial Status</option>
                <option>Middle Class</option>
                <option>Upper Middle Class</option>
                <option>Rich / Affluent</option>
              </select>
            </div>

            {/* FAMILY VALUES */}
            {/* <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Users size={16} />
                Family Values
              </label>

              <select
                {...register("familyValues")}
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
              >
                <option value="">Select Family Values</option>
                <option>Traditional</option>
                <option>Moderate</option>
                <option>Liberal</option>
              </select>
            </div> */}

            {/* BROTHERS */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <UserRound size={16} />
                Number Of Brothers
              </label>

              <select
                {...register("brothersCount")}
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
              >
                <option value="">Select</option>
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3+</option>
              </select>
            </div>

            {/* SISTERS */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <UserRoundPlus size={16} />
                Number Of Sisters
              </label>

              <select
                {...register("sistersCount")}
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
              >
                <option value="">Select</option>
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3+</option>
              </select>
            </div>

            {/* Family Annual Income */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Heart size={16} />
                Family Annual Income  
              </label>

              <select
                {...register("annualIncome")}
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
                <option value="">Select Family Annual Income</option>
                {familyAnnualIncome.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item}
                </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* BUTTON */}
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