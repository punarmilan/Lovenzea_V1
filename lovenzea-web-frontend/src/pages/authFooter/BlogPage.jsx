import React from "react";
import {
  Search,
  Calendar,
  Clock3,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const featuredPost = {
  title: "10 Signs You've Found Your Perfect Life Partner",
  image:
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200",
  category: "Relationships",
  date: "May 28, 2026",
  readTime: "5 min read",
};

const posts = [
  {
    id: 1,
    title: "How To Build Trust Before Marriage",
    category: "Marriage Tips",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200",
    date: "May 20, 2026",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "Modern Matchmaking In India",
    category: "Matchmaking",
    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1200",
    date: "May 18, 2026",
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "Questions To Ask Before Marriage",
    category: "Relationships",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200",
    date: "May 15, 2026",
    readTime: "7 min read",
  },
  {
    id: 4,
    title: "Balancing Career And Marriage",
    category: "Lifestyle",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200",
    date: "May 12, 2026",
    readTime: "5 min read",
  },
  {
    id: 5,
    title: "Red Flags You Should Never Ignore",
    category: "Dating",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200",
    date: "May 10, 2026",
    readTime: "8 min read",
  },
  {
    id: 6,
    title: "Finding Love Through Matrimony Platforms",
    category: "Success Stories",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
    date: "May 08, 2026",
    readTime: "5 min read",
  },
];

const categories = [
  "Relationships",
  "Marriage Tips",
  "Dating",
  "Success Stories",
  "Lifestyle",
  "Matchmaking",
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-pink-500 to-rose-500 text-white">

        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">

          <div className="max-w-3xl mx-auto text-center">

            <span className="bg-theme-surface/20 backdrop-blur-md px-5 py-2 rounded-full text-sm font-medium">
              LovenZea Blog
            </span>

            <h1 className="mt-8 text-5xl md:text-7xl font-extrabold leading-tight">
              Stories, Advice &
              <span className="block">
                Relationship Insights
              </span>
            </h1>

            <p className="mt-6 text-lg text-pink-100">
              Discover expert advice, matchmaking tips, inspiring success
              stories and everything you need for a beautiful relationship
              journey.
            </p>

            <div className="mt-10 max-w-xl mx-auto">
              <div className="bg-theme-surface rounded-2xl p-2 flex items-center shadow-2xl">
                <Search className="text-gray-400 ml-4 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="flex-1 px-4 py-3 outline-none text-gray-700 bg-transparent"
                />
                <button className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition">
                  Search
                </button>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-wrap gap-4 justify-center">

          {categories.map((cat) => (
            <button
              key={cat}
              className="px-5 py-2 bg-theme-surface border border-pink-100 rounded-full hover:bg-pink-600 hover:text-white transition-all shadow-sm"
            >
              {cat}
            </button>
          ))}

        </div>

      </section>

      {/* Featured Blog */}
      <section className="max-w-7xl mx-auto px-6 pb-16">

        <div className="bg-theme-surface rounded-[32px] overflow-hidden shadow-xl">

          <div className="grid lg:grid-cols-2">

            <img
              src={featuredPost.image}
              alt=""
              className="w-full h-full object-cover min-h-[400px]"
            />

            <div className="p-10 lg:p-14 flex flex-col justify-center">

              <div className="flex items-center gap-2 text-pink-600 font-semibold">
                <TrendingUp size={18} />
                Featured Article
              </div>

              <h2 className="mt-5 text-4xl font-bold text-gray-900 leading-tight">
                {featuredPost.title}
              </h2>

              <div className="flex items-center gap-6 mt-6 text-theme-text-secondary">

                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {featuredPost.date}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={16} />
                  {featuredPost.readTime}
                </div>

              </div>

              <p className="mt-6 text-theme-text-secondary leading-8">
                Learn the most important signs and relationship indicators
                that can help you identify long-term compatibility and
                emotional connection.
              </p>

              <button className="mt-8 flex items-center gap-2 text-pink-600 font-semibold">
                Read Article
                <ArrowRight size={18} />
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="flex items-center justify-between mb-10">

          <h2 className="text-4xl font-bold text-gray-900">
            Latest Articles
          </h2>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {posts.map((post) => (

            <article
              key={post.id}
              className="group bg-theme-surface rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition duration-500"
            >

              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-60 object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              <div className="p-6">

                <span className="inline-flex bg-pink-50 text-pink-600 text-sm font-semibold px-4 py-2 rounded-full">
                  {post.category}
                </span>

                <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-pink-600 transition">
                  {post.title}
                </h3>

                <div className="flex items-center justify-between mt-5 text-theme-text-secondary text-sm">

                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {post.date}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 size={14} />
                    {post.readTime}
                  </div>

                </div>

              </div>

            </article>

          ))}
        </div>

      </section>

      {/* Newsletter */}
      <section className="bg-[#050816]">

        <div className="max-w-5xl mx-auto px-6 py-20 text-center">

          <h2 className="text-4xl font-bold text-white">
            Get Relationship Tips Weekly
          </h2>

          <p className="mt-4 text-gray-400">
            Join thousands of readers receiving relationship and marriage
            advice directly in their inbox.
          </p>

          <div className="max-w-xl mx-auto mt-10 flex flex-col sm:flex-row gap-4">

            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-4 rounded-2xl outline-none"
            />

            <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-2xl font-semibold transition">
              Subscribe
            </button>

          </div>

        </div>

      </section>

    </div>
  );
};

export default BlogPage;