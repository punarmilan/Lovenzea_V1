import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  MessageCircle,
  Headphones,
  Heart,
  ShieldCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";

const offices = [
  {
    city: "Pune",
    address: "Pune, Maharashtra, India",
  },
  {
    city: "Mumbai",
    address: "Mumbai, Maharashtra, India",
  },
  {
    city: "Nashik",
    address: "Nashik, Maharashtra, India",
  },
];

const faqs = [
  {
    question: "How do I create a profile?",
    answer:
      "You can register in a few minutes and complete your profile with personal, family and partner preference details.",
  },
  {
    question: "Are profiles verified?",
    answer:
      "Yes, we focus on verified profiles and secure matchmaking experiences.",
  },
  {
    question: "Can I talk to a relationship advisor?",
    answer:
      "Yes, premium and VIP members can connect with dedicated matchmaking experts.",
  },
  {
    question: "How do I report a concern?",
    answer:
      "You can contact our support team or grievance officer through the support channels below.",
  },
];

const ContactPage = () => {
  return (
    <div className="bg-[#050816] min-h-screen text-white overflow-hidden">

      {/* Hero Section */}
      <section className="relative">

        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-purple-600/20"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-28">

          <div className="text-center max-w-4xl mx-auto">

            <div className="inline-flex items-center gap-2 bg-theme-surface/10 border border-white/10 backdrop-blur-xl px-5 py-2 rounded-full mb-8">

              <MessageCircle className="w-4 h-4 text-pink-500" />

              <span className="text-sm">
                We're Here To Help
              </span>

            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">

              Contact
              <span className="text-pink-500">
                {" "}LovenZea
              </span>

            </h1>

            <p className="mt-8 text-lg text-gray-300 leading-8 max-w-3xl mx-auto">
              Whether you're looking for matchmaking guidance,
              account assistance, VIP membership support or relationship
              consultation, our team is ready to assist you.
            </p>

          </div>

        </div>

      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8">

            <Phone className="w-10 h-10 text-pink-500 mb-6" />

            <h3 className="text-2xl font-bold">
              Call Us
            </h3>

            <p className="text-gray-400 mt-4">
              Speak directly with our support team.
            </p>

            <p className="text-pink-500 font-semibold mt-5">
              +91 9923400442
            </p>

          </div>

          <div className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8">

            <Mail className="w-10 h-10 text-blue-400 mb-6" />

            <h3 className="text-2xl font-bold">
              Email Support
            </h3>

            <p className="text-gray-400 mt-4">
              Send your queries anytime.
            </p>

            <p className="text-blue-400 font-semibold mt-5 break-all">
              lovenzea2@gmail.com
            </p>

          </div>

          <div className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8">

            <Clock3 className="w-10 h-10 text-yellow-400 mb-6" />

            <h3 className="text-2xl font-bold">
              Support Hours
            </h3>

            <p className="text-gray-400 mt-4">
              Dedicated assistance for members.
            </p>

            <p className="text-yellow-400 font-semibold mt-5">
              Mon - Sat • 9 AM - 7 PM
            </p>

          </div>

        </div>

      </section>

      {/* Contact Form + Info */}
      <section className="max-w-7xl mx-auto px-6 py-28">

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Form */}
          <div className="bg-theme-surface/[0.03] border border-white/10 rounded-[40px] p-10">

            <h2 className="text-4xl font-bold">
              Send Us A Message
            </h2>

            <p className="text-gray-400 mt-4">
              Our team will get back to you as soon as possible.
            </p>

            <div className="mt-10 space-y-5">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-theme-surface/5 border border-white/10 rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-theme-surface/5 border border-white/10 rounded-2xl px-5 py-4 outline-none"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-theme-surface/5 border border-white/10 rounded-2xl px-5 py-4 outline-none"
              />

              <select className="w-full bg-theme-surface/5 border border-white/10 rounded-2xl px-5 py-4 outline-none">

                <option>General Enquiry</option>
                <option>VIP Membership</option>
                <option>Profile Assistance</option>
                <option>Technical Support</option>
                <option>Safety Concern</option>

              </select>

              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full bg-theme-surface/5 border border-white/10 rounded-2xl px-5 py-4 outline-none resize-none"
              ></textarea>

              <button className="w-full bg-pink-600 hover:bg-pink-700 py-4 rounded-2xl font-semibold transition-all">

                Send Message

              </button>

            </div>

          </div>

          {/* Side Content */}
          <div>

            <span className="text-pink-500 uppercase tracking-widest font-semibold">
              Member Support
            </span>

            <h2 className="mt-5 text-5xl font-bold leading-tight">
              Personalized Help For Every Step
            </h2>

            <p className="mt-8 text-gray-400 leading-8">
              From profile creation to finding meaningful matches,
              our team is committed to providing a secure and
              personalized matchmaking experience.
            </p>

            <div className="mt-10 space-y-6">

              <div className="flex items-center gap-4">
                <Headphones className="text-pink-500" />
                Dedicated Support Team
              </div>

              <div className="flex items-center gap-4">
                <ShieldCheck className="text-green-500" />
                Privacy & Safety Assistance
              </div>

              <div className="flex items-center gap-4">
                <Users className="text-pink-500" />
                Matchmaking Consultation
              </div>

              <div className="flex items-center gap-4">
                <Heart className="text-pink-500" />
                Relationship Guidance
              </div>

            </div>

            <div className="mt-12 bg-gradient-to-br from-pink-600 to-purple-700 rounded-[35px] p-8">

              <Sparkles className="w-12 h-12 mb-5" />

              <h3 className="text-3xl font-bold">
                VIP Relationship Support
              </h3>

              <p className="mt-5 text-pink-100 leading-8">
                Connect directly with dedicated relationship managers
                for personalized matchmaking and premium assistance.
              </p>

              <button className="mt-8 bg-theme-surface text-black px-6 py-3 rounded-xl font-semibold">
                Contact VIP Team
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* Offices */}
      <section className="border-y border-white/5 bg-theme-surface/[0.02]">

        <div className="max-w-6xl mx-auto px-6 py-24">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold">
              Our Locations
            </h2>

            <p className="text-gray-400 mt-5">
              Reach us through our relationship centres.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {offices.map((office) => (

              <div
                key={office.city}
                className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8"
              >

                <MapPin className="w-10 h-10 text-pink-500 mb-5" />

                <h3 className="text-2xl font-bold">
                  {office.city}
                </h3>

                <p className="text-gray-400 mt-4">
                  {office.address}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 py-28">

        <div className="text-center mb-16">

          <HelpCircle className="w-14 h-14 text-pink-500 mx-auto mb-6" />

          <h2 className="text-5xl font-bold">
            Frequently Asked Questions
          </h2>

        </div>

        <div className="space-y-6">

          {faqs.map((faq) => (

            <div
              key={faq.question}
              className="bg-theme-surface/[0.03] border border-white/10 rounded-3xl p-8"
            >

              <h3 className="text-xl font-semibold">
                {faq.question}
              </h3>

              <p className="text-gray-400 mt-4 leading-7">
                {faq.answer}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="border-t border-white/5">

        <div className="max-w-5xl mx-auto px-6 py-24 text-center">

          <Heart className="w-16 h-16 text-pink-500 fill-pink-500 mx-auto mb-8" />

          <h2 className="text-5xl font-bold">
            Start Your Relationship Journey Today
          </h2>

          <p className="mt-6 text-gray-400 text-lg">
            Join thousands of verified members and connect with
            meaningful matches.
          </p>

          <button className="mt-10 bg-pink-600 hover:bg-pink-700 px-10 py-5 rounded-2xl font-semibold text-lg flex items-center gap-2 mx-auto">

            Create Free Profile

            <ArrowRight size={18} />

          </button>

          <div className="flex justify-center gap-8 mt-10 text-gray-400 flex-wrap">

            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 w-5 h-5" />
              Verified Profiles
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 w-5 h-5" />
              Secure Matchmaking
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500 w-5 h-5" />
              Expert Guidance
            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default ContactPage;