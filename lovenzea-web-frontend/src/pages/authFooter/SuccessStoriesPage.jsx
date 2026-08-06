import React from "react";
import {
  Heart,
  Quote,
  Calendar,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const featuredStory = {
  couple: "Aarav & Priya",
  image:
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1400",
  location: "Pune, Maharashtra",
  marriageDate: "February 2026",
};

const stories = [
  {
    id: 1,
    names: "Rahul & Sneha",
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200",
    city: "Mumbai",
    text: "We connected through LovenZea and instantly felt a genuine connection. Today we're happily married.",
  },
  {
    id: 2,
    names: "Aditya & Riya",
    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1200",
    city: "Bangalore",
    text: "The personalized matchmaking experience helped us find the right partner at the right time.",
  },
  {
    id: 3,
    names: "Karan & Meera",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
    city: "Delhi",
    text: "From our first conversation to marriage, LovenZea was part of our beautiful journey.",
  },
];

const timeline = [
  {
    step: "Profile Created",
    desc: "Started the journey with hope and excitement.",
  },
  {
    step: "Perfect Match Found",
    desc: "Matched based on values, goals and compatibility.",
  },
  {
    step: "Families Connected",
    desc: "Both families met and shared meaningful conversations.",
  },
  {
    step: "Happily Married",
    desc: "Began a lifelong journey together.",
  },
];

const stats = [
  {
    number: "25K+",
    label: "Successful Matches",
  },
  {
    number: "12K+",
    label: "Happy Marriages",
  },
  {
    number: "4.9★",
    label: "User Rating",
  },
  {
    number: "100%",
    label: "Verified Profiles",
  },
];

const SuccessStoriesPage = () => {
  return (
    <div className="bg-[#050816] text-white min-h-screen overflow-hidden">

      {/* Hero */}
      <section className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-purple-600/20"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-28">

          <div className="text-center max-w-4xl mx-auto">

            <div className="inline-flex items-center gap-2 bg-theme-surface/10 border border-white/10 backdrop-blur-xl px-5 py-2 rounded-full">

              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />

              <span className="text-sm">
                Real Love Stories
              </span>

            </div>

            <h1 className="mt-8 text-5xl md:text-7xl font-extrabold leading-tight">

              Success
              <span className="text-pink-500">
                {" "}Stories
              </span>

            </h1>

            <p className="mt-8 text-lg text-gray-300 leading-8 max-w-3xl mx-auto">
              Thousands of couples found their perfect life partner through
              LovenZea. Explore inspiring journeys that started with a
              simple match and turned into lifelong relationships.
            </p>

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

      {/* Featured Story */}
      <section className="max-w-7xl mx-auto px-6 py-28">

        <div className="bg-theme-surface/[0.03] border border-white/10 rounded-[40px] overflow-hidden">

          <div className="grid lg:grid-cols-2">

            <img
              src={featuredStory.image}
              alt=""
              className="w-full h-full object-cover min-h-[500px]"
            />

            <div className="p-10 lg:p-14 flex flex-col justify-center">

              <span className="text-pink-500 font-semibold uppercase tracking-widest">
                Featured Couple
              </span>

              <h2 className="mt-5 text-5xl font-bold">
                {featuredStory.couple}
              </h2>

              <div className="flex items-center gap-6 mt-6 text-gray-400">

                <div>
                  📍 {featuredStory.location}
                </div>

                <div>
                  💍 {featuredStory.marriageDate}
                </div>

              </div>

              <Quote className="w-14 h-14 text-pink-500/30 mt-8" />

              <p className="mt-6 text-gray-300 leading-8 text-lg">
                We joined LovenZea hoping to find someone who truly
                understood us. What started as a simple conversation soon
                became a beautiful relationship and eventually marriage.
                Today, we are building our future together.
              </p>

              <button className="mt-8 flex items-center gap-2 text-pink-500 font-semibold">
                Read Full Story
                <ArrowRight size={18} />
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* Story Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-28">

        <div className="text-center mb-14">

          <h2 className="text-5xl font-bold">
            Happy Couples
          </h2>

          <p className="text-gray-400 mt-5">
            Real couples who found love through LovenZea.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {stories.map((story) => (

            <div
              key={story.id}
              className="group bg-theme-surface/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-pink-500/30 transition-all duration-300"
            >

              <div className="overflow-hidden">

                <img
                  src={story.image}
                  alt=""
                  className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
                />

              </div>

              <div className="p-7">

                <h3 className="text-2xl font-bold">
                  {story.names}
                </h3>

                <p className="text-pink-500 mt-2">
                  {story.city}
                </p>

                <p className="mt-5 text-gray-400 leading-7">
                  {story.text}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Love Journey */}
      <section className="border-y border-white/5 bg-theme-surface/[0.02]">

        <div className="max-w-6xl mx-auto px-6 py-28">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-bold">
              Their Journey To Marriage
            </h2>

          </div>

          <div className="grid md:grid-cols-4 gap-8">

            {timeline.map((item, index) => (

              <div
                key={item.step}
                className="relative bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8"
              >

                <div className="absolute top-5 right-6 text-5xl font-extrabold text-pink-500/10">
                  0{index + 1}
                </div>

                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">

                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />

                </div>

                <h3 className="text-xl font-bold">
                  {item.step}
                </h3>

                <p className="mt-4 text-gray-400 leading-7">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-28">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            What Couples Say
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {[1, 2, 3].map((item) => (

            <div
              key={item}
              className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8"
            >

              <div className="flex gap-1 mb-5">

                <Star className="fill-yellow-400 text-yellow-400" />
                <Star className="fill-yellow-400 text-yellow-400" />
                <Star className="fill-yellow-400 text-yellow-400" />
                <Star className="fill-yellow-400 text-yellow-400" />
                <Star className="fill-yellow-400 text-yellow-400" />

              </div>

              <p className="text-gray-300 leading-8">
                The platform made finding a compatible life partner simple,
                secure and meaningful. We're grateful for this journey.
              </p>

              <div className="mt-6 flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">

                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />

                </div>

                <div>

                  <h4 className="font-semibold">
                    Happy Couple
                  </h4>

                  <p className="text-theme-text-secondary text-sm">
                    Married via LovenZea
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="border-t border-white/5">

        <div className="max-w-5xl mx-auto px-6 py-24 text-center">

          <Sparkles className="w-14 h-14 text-pink-500 mx-auto mb-8" />

          <h2 className="text-5xl font-bold">
            Your Success Story Could Be Next
          </h2>

          <p className="mt-6 text-gray-400 text-lg">
            Join thousands of verified members and begin your journey toward
            meaningful relationships and marriage.
          </p>

          <button className="mt-10 bg-pink-600 hover:bg-pink-700 px-10 py-5 rounded-2xl font-semibold text-lg transition-all">

            Create Profile Free

          </button>

          <div className="flex justify-center gap-8 mt-10 text-gray-400">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Verified Profiles
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Trusted Matchmaking
            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default SuccessStoriesPage;