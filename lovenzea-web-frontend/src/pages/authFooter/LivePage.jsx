import React from "react";
import {
  Radio,
  Calendar,
  Users,
  PlayCircle,
  Video,
  Mic,
  Heart,
  ArrowRight,
  Clock3,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const liveEvents = [
  {
    title: "Elite Matchmaking Webinar",
    date: "15 June 2026",
    attendees: "2,500+",
  },
  {
    title: "Relationship Expert Session",
    date: "20 June 2026",
    attendees: "1,800+",
  },
  {
    title: "VIP Singles Meet",
    date: "25 June 2026",
    attendees: "950+",
  },
];

const benefits = [
  "Live Matchmaking Sessions",
  "Relationship Expert Guidance",
  "Interactive Q&A",
  "Verified Member Networking",
  "Marriage Success Workshops",
  "Exclusive VIP Events",
];

const LivePage = () => {
  return (
    <div className="bg-[#050816] text-white min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-purple-600/20" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">

          <div className="inline-flex items-center gap-2 bg-theme-surface/10 px-5 py-2 rounded-full border border-white/10">

            <Radio className="w-4 h-4 text-pink-500" />

            <span>Live Matchmaking Events</span>

          </div>

          <h1 className="mt-8 text-6xl md:text-7xl font-extrabold">

            LovenZea
            <span className="text-pink-500"> Live</span>

          </h1>

          <p className="mt-8 text-lg text-gray-300 max-w-3xl mx-auto leading-8">
            Join live events, webinars, matchmaking sessions and expert
            relationship discussions designed to help you find meaningful
            connections.
          </p>

          <button className="mt-10 bg-pink-600 px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 mx-auto">

            Join Upcoming Event

            <ArrowRight size={18} />

          </button>

        </div>

      </section>

      {/* Upcoming Events */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Upcoming Live Events
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {liveEvents.map((event) => (

            <div
              key={event.title}
              className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8"
            >

              <Video className="w-10 h-10 text-pink-500 mb-6" />

              <h3 className="text-2xl font-bold">
                {event.title}
              </h3>

              <div className="mt-5 text-gray-400 space-y-3">

                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {event.date}
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {event.attendees} Attendees
                </div>

              </div>

              <button className="mt-6 text-pink-500 font-semibold">
                Register Now →
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* Why Join */}

      <section className="bg-theme-surface/[0.02] border-y border-white/5">

        <div className="max-w-6xl mx-auto px-6 py-24">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold">
              Why Join LovenZea Live?
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {benefits.map((item) => (

              <div
                key={item}
                className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-7"
              >

                <CheckCircle2 className="text-green-500 mb-4" />

                <h3 className="font-semibold text-lg">
                  {item}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="max-w-5xl mx-auto px-6 py-24 text-center">

        <Sparkles className="w-14 h-14 text-pink-500 mx-auto mb-8" />

        <h2 className="text-5xl font-bold">
          Meet, Connect & Find Meaningful Relationships
        </h2>

        <p className="mt-6 text-gray-400">
          Participate in live matchmaking experiences and relationship events.
        </p>

        <button className="mt-10 bg-pink-600 px-10 py-5 rounded-2xl font-semibold">
          Explore Live Events
        </button>

      </section>

    </div>
  );
};

export default LivePage;
