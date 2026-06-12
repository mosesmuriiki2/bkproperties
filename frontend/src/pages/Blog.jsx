import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { BLOG_POSTS } from "@/data/blogPosts";

const ALL_CATEGORIES = ["All", ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = BLOG_POSTS.filter((post) => {
    const matchSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "All" || post.category === activeCategory;
    return matchSearch && matchCat;
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-sky-500/20 text-sky-300 border-sky-500/30 text-xs font-semibold uppercase tracking-wider">
            BK Properties Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Property News &amp; Guides
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
            Expert advice, market insights, and practical guides for buyers, sellers, and investors in Kenya.
          </p>
          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-xl border-0 bg-white/10 backdrop-blur text-white placeholder:text-slate-400 focus:bg-white focus:text-slate-900 transition-colors"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:text-sky-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-slate-400 text-lg">No articles found for your search.</p>
          </div>
        )}

        {/* Featured post */}
        {featured && (
          <Link to={`/blog/${featured.slug}`} className="block mb-12 group">
            <Card className="overflow-hidden border border-slate-100 hover:border-sky-200 hover:shadow-2xl transition-all rounded-2xl">
              <div className="md:flex">
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="md:w-1/2 p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-amber-500 text-white border-0 text-xs">{featured.category}</Badge>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Featured</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-slate-500 mb-6 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{featured.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime} read</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm">
                    Read Article <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        )}

        {/* Grid of remaining posts */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group block">
                <Card className="overflow-hidden h-full border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all rounded-2xl">
                  <div className="h-48 overflow-hidden bg-slate-100">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-5 flex flex-col h-[calc(100%-12rem)]">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 text-xs">{post.category}</Badge>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug flex-1">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime} read</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
