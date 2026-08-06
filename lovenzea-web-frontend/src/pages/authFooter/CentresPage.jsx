import React from "react";
import {
  MapPin,
  Building2,
  Phone,
  Calendar,
  Users,
  ShieldCheck,
  Heart,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock3,
} from "lucide-react";

const centres = [
  {
    city: "Pune",
    address: "Baner, Pune, Maharashtra",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200",
  },
  {
    city: "Mumbai",
    address: "Andheri West, Mumbai",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
  },
  {
    city: "Nashik",
    address: "College Road, Nashik",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200",
  },
  {
    city: "Bangalore",
    address: "Indiranagar, Bangalore",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200",
  },
];

const features = [
  "Personal Matchmaking Consultation",
  "Verified Premium Profiles",
  "Relationship Guidance",
  "Family Meeting Assistance",
  "VIP Matchmaking Services",
  "Dedicated Match Expert",
];

const stats = [
  {
    number: "20+",
    label: "Matchmaking Centres",
  },
  {
    number: "50K+",
    label: "Verified Members",
  },
  {
    number: "12K+",
    label: "Successful Marriages",
  },
  {
    number: "24/7",
    label: "Expert Support",
  },
];

const process = [
  {
    title: "Book Appointment",
    desc: "Schedule a consultation with our matchmaking experts.",
  },
  {
    title: "Profile Discussion",
    desc: "Understand preferences, family values and expectations.",
  },
  {
    title: "Curated Matches",
    desc: "Receive personalized recommendations.",
  },
  {
    title: "Relationship Journey",
    desc: "Guidance until meaningful connection and marriage.",
  },
];

const CentresPage = () => {
  return (
    <div className="bg-[#050816] min-h-screen text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-purple-600/20"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-28">

          <div className="text-center max-w-4xl mx-auto">

            <div className="inline-flex items-center gap-2 bg-theme-surface/10 border border-white/10 backdrop-blur-xl px-5 py-2 rounded-full mb-8">

              <Building2 className="w-4 h-4 text-pink-500" />

              <span className="text-sm">
                Premium Matchmaking Centres
              </span>

            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">

              LovenZea
              <span className="text-pink-500">
                {" "}Centres
              </span>

            </h1>

            <p className="mt-8 text-lg text-gray-300 leading-8 max-w-3xl mx-auto">
              Visit our relationship centres and meet experienced
              matchmaking experts who help you find meaningful,
              compatible and verified life partner matches.
            </p>

            <button className="mt-10 bg-pink-600 hover:bg-pink-700 px-8 py-4 rounded-2xl font-semibold transition-all flex items-center gap-2 mx-auto">

              Book Consultation

              <ArrowRight size={18} />

            </button>

          </div>

        </div>

      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-6">

          {stats.map((item) => (

            <div
              key={item.label}
              className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8 text-center"
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

      {/* Centres Grid */}
      <section className="max-w-7xl mx-auto px-6 py-28">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Visit Our Centres
          </h2>

          <p className="text-gray-400 mt-5">
            Meet experts personally and get customized matchmaking support.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {centres.map((centre) => (

            <div
              key={centre.city}
              className="group bg-theme-surface/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-pink-500/30 transition-all duration-300"
            >

              <div className="overflow-hidden">

                <img
                  src={centre.image}
                  alt={centre.city}
                  className="w-full h-60 object-cover group-hover:scale-110 transition duration-700"
                />

              </div>

              <div className="p-6">

                <h3 className="text-2xl font-bold">
                  {centre.city}
                </h3>

                <div className="flex items-start gap-2 mt-4 text-gray-400">

                  <MapPin className="w-4 h-4 mt-1" />

                  <span>
                    {centre.address}
                  </span>

                </div>

                <button className="mt-6 text-pink-500 font-semibold flex items-center gap-2">

                  View Centre

                  <ArrowRight size={16} />

                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Why Visit */}
      <section className="border-y border-white/5 bg-theme-surface/[0.02]">

        <div className="max-w-6xl mx-auto px-6 py-28">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold">
              Why Visit A LovenZea Centre?
            </h2>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {features.map((feature) => (

              <div
                key={feature}
                className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-7"
              >

                <CheckCircle2 className="w-7 h-7 text-green-500 mb-5" />

                <h3 className="text-lg font-semibold">
                  {feature}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Match Experts */}
      <section className="max-w-7xl mx-auto px-6 py-28">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <span className="text-pink-500 uppercase tracking-widest font-semibold">
              Matchmaking Experts
            </span>

            <h2 className="mt-5 text-5xl font-bold leading-tight">
              Personalized Guidance For Every Relationship Journey
            </h2>

            <p className="mt-8 text-gray-400 leading-8">
              Our experienced relationship advisors understand your
              preferences, family values, goals and expectations to help
              you discover highly compatible matches.
            </p>

            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-4">
                <Users className="text-pink-500" />
                Dedicated Relationship Managers
              </div>

              <div className="flex items-center gap-4">
                <ShieldCheck className="text-green-500" />
                Verified & Secure Profiles
              </div>

              <div className="flex items-center gap-4">
                <Heart className="text-pink-500" />
                Personalized Matchmaking
              </div>

            </div>

          </div>

          <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-[40px] p-10">

            <Sparkles className="w-14 h-14 mb-6" />

            <h3 className="text-3xl font-bold">
              Premium Consultation Experience
            </h3>

            <p className="mt-6 text-pink-100 leading-8">
              Meet relationship experts face-to-face, discuss expectations,
              receive curated recommendations and begin your journey toward
              meaningful marriage.
            </p>

            <button className="mt-8 bg-theme-surface text-black px-7 py-4 rounded-2xl font-semibold">
              Schedule Visit
            </button>

          </div>

        </div>

      </section>

      {/* Process */}
      <section className="bg-theme-surface/[0.02] border-y border-white/5">

        <div className="max-w-6xl mx-auto px-6 py-28">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-bold">
              How It Works
            </h2>

          </div>

          <div className="grid md:grid-cols-4 gap-8">

            {process.map((item, index) => (

              <div
                key={item.title}
                className="relative bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8"
              >

                <div className="absolute right-6 top-4 text-5xl font-extrabold text-pink-500/10">
                  0{index + 1}
                </div>

                <div className="w-14 h-14 rounded-2xl bg-pink-500 text-white flex items-center justify-center font-bold mb-6">
                  {index + 1}
                </div>

                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-400 leading-7">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Appointment CTA */}
      <section>

        <div className="max-w-5xl mx-auto px-6 py-24 text-center">

          <Calendar className="w-16 h-16 text-pink-500 mx-auto mb-8" />

          <h2 className="text-5xl font-bold">
            Book Your Centre Appointment
          </h2>

          <p className="mt-6 text-gray-400 text-lg">
            Meet our matchmaking specialists and receive personalized
            relationship guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">

            <button className="bg-pink-600 hover:bg-pink-700 px-10 py-5 rounded-2xl font-semibold transition-all">
              Book Appointment
            </button>

            <button className="border border-white/10 bg-theme-surface/5 px-10 py-5 rounded-2xl font-semibold">
              Contact Centre
            </button>

          </div>

          <div className="flex justify-center gap-10 mt-10 text-gray-400">

            <div className="flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-pink-500" />
              Flexible Timings
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-pink-500" />
              Expert Assistance
            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default CentresPage;