import React from "react";
import {
  Briefcase,
  Heart,
  Users,
  Sparkles,
  Rocket,
  Globe,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const jobs = [
  {
    title: "Frontend Developer",
    type: "Full Time",
    location: "Pune",
  },
  {
    title: "Backend Developer",
    type: "Full Time",
    location: "Remote",
  },
  {
    title: "Relationship Manager",
    type: "Full Time",
    location: "Mumbai",
  },
  {
    title: "Digital Marketing Executive",
    type: "Full Time",
    location: "Nashik",
  },
];

const perks = [
  "Flexible Work Environment",
  "Career Growth Opportunities",
  "Collaborative Team Culture",
  "Learning & Development",
  "Competitive Salary",
  "Meaningful Impact",
];

const WorkWithUsPage = () => {
  return (
    <div className="bg-[#050816] text-white min-h-screen">

      {/* Hero */}

      <section className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-purple-600/20" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">

          <div className="inline-flex items-center gap-2 bg-theme-surface/10 border border-white/10 px-5 py-2 rounded-full">

            <Briefcase className="w-4 h-4 text-pink-500" />

            <span>Build The Future With Us</span>

          </div>

          <h1 className="mt-8 text-6xl md:text-7xl font-extrabold">

            Work With
            <span className="text-pink-500"> Us</span>

          </h1>

          <p className="mt-8 text-lg text-gray-300 leading-8 max-w-3xl mx-auto">
            Join a passionate team building meaningful relationships,
            modern matchmaking experiences and innovative technology.
          </p>

          <button className="mt-10 bg-pink-600 px-8 py-4 rounded-2xl font-semibold">

            View Open Positions

          </button>

        </div>

      </section>

      {/* Mission */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <span className="text-pink-500 uppercase tracking-widest">
              Our Mission
            </span>

            <h2 className="mt-5 text-5xl font-bold">
              Connecting People Through Meaningful Relationships
            </h2>

            <p className="mt-8 text-gray-400 leading-8">
              At LovenZea, we're building technology and experiences that
              help people find life partners with trust, compatibility and
              confidence.
            </p>

          </div>

          <div className="bg-gradient-to-br from-pink-600 to-purple-700 rounded-[40px] p-10">

            <Rocket className="w-14 h-14 mb-6" />

            <h3 className="text-3xl font-bold">
              Fast Growing Team
            </h3>

            <p className="mt-6 text-pink-100 leading-8">
              Work with talented professionals across technology,
              matchmaking, marketing and operations.
            </p>

          </div>

        </div>

      </section>

      {/* Perks */}

      <section className="bg-theme-surface/[0.02] border-y border-white/5">

        <div className="max-w-6xl mx-auto px-6 py-24">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold">
              Why Join Us?
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {perks.map((perk) => (

              <div
                key={perk}
                className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8"
              >

                <CheckCircle2 className="text-green-500 mb-5" />

                <h3 className="font-semibold text-lg">
                  {perk}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Open Roles */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold">
            Open Positions
          </h2>

        </div>

        <div className="space-y-6">

          {jobs.map((job) => (

            <div
              key={job.title}
              className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >

              <div>

                <h3 className="text-2xl font-bold">
                  {job.title}
                </h3>

                <p className="text-gray-400 mt-2">
                  {job.type} • {job.location}
                </p>

              </div>

              <button className="bg-pink-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2">

                Apply Now

                <ArrowRight size={16} />

              </button>

            </div>

          ))}

        </div>

      </section>

      {/* CTA */}

      <section className="border-t border-white/5">

        <div className="max-w-5xl mx-auto px-6 py-24 text-center">

          <Heart className="w-14 h-14 text-pink-500 mx-auto mb-8" />

          <h2 className="text-5xl font-bold">
            Shape The Future Of Matchmaking
          </h2>

          <p className="mt-6 text-gray-400 text-lg">
            Build products and experiences that help people find lifelong partners.
          </p>

          <button className="mt-10 bg-pink-600 px-10 py-5 rounded-2xl font-semibold">
            Join Our Team
          </button>

        </div>

      </section>

    </div>
  );
};

export default WorkWithUsPage;