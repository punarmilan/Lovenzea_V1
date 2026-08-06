import React from "react";
import {
  Crown,
  ShieldCheck,
  Users,
  Heart,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Star,
} from "lucide-react";

const benefits = [
  {
    icon: Crown,
    title: "Dedicated Relationship Manager",
    desc: "Get a personal matchmaking expert who understands your preferences and finds highly compatible matches.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Premium Profiles",
    desc: "Access trusted, manually verified and high-quality profiles with enhanced privacy.",
  },
  {
    icon: Heart,
    title: "Elite Matchmaking",
    desc: "Curated introductions based on compatibility, lifestyle, family values and future goals.",
  },
  {
    icon: Users,
    title: "Priority Visibility",
    desc: "Increase profile visibility among serious premium members looking for meaningful relationships.",
  },
];

const steps = [
  "VIP Registration",
  "Personal Consultation",
  "Profile Evaluation",
  "Curated Match Selection",
  "Private Introductions",
  "Relationship Guidance",
];

const stats = [
  {
    number: "50K+",
    label: "Premium Members",
  },
  {
    number: "12K+",
    label: "Successful Matches",
  },
  {
    number: "98%",
    label: "Profile Verification",
  },
  {
    number: "24/7",
    label: "VIP Support",
  },
];

const VipLovenZeaPage = () => {
  return (
    <div className="bg-[#050816] min-h-screen text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/30 via-transparent to-purple-600/20"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-28">

          <div className="text-center max-w-4xl mx-auto">

            <div className="inline-flex items-center gap-2 bg-theme-surface/10 border border-white/10 backdrop-blur-xl px-5 py-2 rounded-full mb-8">

              <Crown className="w-4 h-4 text-yellow-400" />

              <span className="text-sm font-medium">
                Exclusive VIP Matchmaking Experience
              </span>

            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">

              VIP
              <span className="text-pink-500"> LovenZea</span>

            </h1>

            <p className="mt-8 text-gray-300 text-lg md:text-xl leading-8 max-w-3xl mx-auto">

              Personalized matchmaking for professionals, entrepreneurs,
              business owners and individuals seeking a serious,
              high-quality marriage experience with privacy and exclusivity.

            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12">

              <button className="bg-pink-600 hover:bg-pink-700 px-8 py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2">
                Join VIP Membership
                <ArrowRight size={18} />
              </button>

              <button className="border border-white/10 bg-theme-surface/5 hover:bg-theme-surface/10 px-8 py-4 rounded-2xl font-semibold transition-all">
                Talk To Match Expert
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-6">

          {stats.map((item) => (

            <div
              key={item.label}
              className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl"
            >

              <h3 className="text-4xl font-extrabold text-pink-500">
                {item.number}
              </h3>

              <p className="mt-3 text-gray-400">
                {item.label}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* Why VIP */}
      <section className="max-w-7xl mx-auto px-6 py-28">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Why Choose VIP LovenZea?
          </h2>

          <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
            A premium matchmaking experience designed for serious individuals
            looking for meaningful and long-lasting relationships.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8 hover:border-pink-500/30 transition-all duration-300 group"
              >

                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">

                  <Icon className="w-8 h-8 text-pink-500" />

                </div>

                <h3 className="text-xl font-bold mb-4">
                  {benefit.title}
                </h3>

                <p className="text-gray-400 leading-7">
                  {benefit.desc}
                </p>

              </div>
            );
          })}

        </div>

      </section>

      {/* Process Section */}
      <section className="bg-theme-surface/[0.02] border-y border-white/5">

        <div className="max-w-6xl mx-auto px-6 py-28">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-bold">
              How VIP Matchmaking Works
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {steps.map((step, index) => (

              <div
                key={step}
                className="relative bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8"
              >

                <div className="text-5xl font-extrabold text-pink-500/20 absolute right-6 top-4">
                  0{index + 1}
                </div>

                <div className="w-12 h-12 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold mb-6">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold">
                  {step}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Premium Features */}
      <section className="max-w-7xl mx-auto px-6 py-28">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <span className="text-pink-500 font-semibold uppercase tracking-widest">
              Premium Features
            </span>

            <h2 className="mt-5 text-5xl font-bold leading-tight">
              Exclusive Matchmaking With Complete Privacy
            </h2>

            <p className="mt-8 text-gray-400 leading-8">
              Our VIP membership is tailored for individuals who value
              privacy, quality introductions and dedicated matchmaking
              assistance throughout their journey.
            </p>

            <div className="mt-10 space-y-5">

              {[
                "Private profile sharing",
                "Priority match recommendations",
                "Dedicated relationship advisor",
                "Verified premium members",
                "Personalized matchmaking strategy",
              ].map((feature) => (

                <div
                  key={feature}
                  className="flex items-center gap-4"
                >

                  <CheckCircle2 className="text-green-500 w-5 h-5" />

                  <span className="text-gray-300">
                    {feature}
                  </span>

                </div>

              ))}

            </div>

          </div>

          <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-[40px] p-10">

            <Sparkles className="w-14 h-14 mb-6" />

            <h3 className="text-3xl font-bold">
              Personalized Concierge Service
            </h3>

            <p className="mt-6 text-pink-100 leading-8">
              Receive one-on-one support from experienced matchmaking
              specialists who guide you through every step of your
              relationship journey.
            </p>

            <button className="mt-8 bg-theme-surface text-black px-7 py-4 rounded-2xl font-semibold flex items-center gap-2">
              Schedule Consultation
              <PhoneCall size={18} />
            </button>

          </div>

        </div>

      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 pb-28">

        <div className="text-center mb-14">

          <h2 className="text-5xl font-bold">
            Success Stories
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8"
            >

              <div className="flex gap-1 text-yellow-400 mb-5">

                <Star className="fill-yellow-400" />
                <Star className="fill-yellow-400" />
                <Star className="fill-yellow-400" />
                <Star className="fill-yellow-400" />
                <Star className="fill-yellow-400" />

              </div>

              <p className="text-gray-300 leading-8">
                LovenZea VIP helped us find a meaningful connection with
                complete privacy and personalized support.
              </p>

              <div className="mt-6 text-white font-semibold">
                Happy Couple
              </div>

            </div>

          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="border-t border-white/5">

        <div className="max-w-5xl mx-auto px-6 py-24 text-center">

          <h2 className="text-5xl font-bold">
            Ready To Find Your Perfect Match?
          </h2>

          <p className="mt-6 text-gray-400 text-lg">
            Join VIP LovenZea and experience personalized premium
            matchmaking.
          </p>

          <button className="mt-10 bg-pink-600 hover:bg-pink-700 px-10 py-5 rounded-2xl font-semibold text-lg transition">
            Become VIP Member
          </button>

        </div>

      </section>

    </div>
  );
};

export default VipLovenZeaPage;