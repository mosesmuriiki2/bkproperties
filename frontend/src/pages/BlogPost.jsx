import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, ArrowLeft, Tag, Share2, Facebook,
  Twitter, Linkedin, ChevronRight, ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogPostBySlug, getRelatedPosts, BLOG_POSTS } from "@/data/blogPosts";

/** Very simple markdown-to-JSX renderer for our controlled blog content */
function renderContent(text) {
  const lines = text.trim().split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-100">
          {line.slice(3)}
        </h2>
      );
    }
    // H3
    else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xl font-bold text-slate-800 mt-7 mb-3">
          {line.slice(4)}
        </h3>
      );
    }
    // H4
    else if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={i} className="text-lg font-semibold text-slate-800 mt-5 mb-2">
          {line.slice(5)}
        </h4>
      );
    }
    // Table — collect all rows
    else if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      // Skip separator row
      const [header, , ...rows] = tableLines;
      const headers = header.split("|").filter(Boolean).map((h) => h.trim());
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6 rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {headers.map((h, hi) => (
                  <th key={hi} className="px-4 py-3 text-left font-semibold text-slate-700 border-b border-slate-200">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => {
                const cells = row.split("|").filter(Boolean).map((c) => c.trim());
                return (
                  <tr key={ri} className="even:bg-slate-50/50">
                    {cells.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-slate-600 border-b border-slate-100">
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }
    // Unordered list items
    else if (line.match(/^[-*] /)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-none space-y-2 my-4 pl-0">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2.5 text-slate-600">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }
    // Ordered list
    else if (line.match(/^\d+\. /)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-none space-y-2 my-4 pl-0 counter-reset-item">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-3 text-slate-600">
              <span className="mt-0.5 w-6 h-6 rounded-full bg-sky-100 text-sky-600 text-xs font-bold flex items-center justify-center shrink-0">
                {li + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }
    // Checkmark lines ✅ ❌
    else if (line.match(/^[✅❌] /)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^[✅❌] /)) {
        listItems.push({ icon: lines[i][0], text: lines[i].slice(2) });
        i++;
      }
      elements.push(
        <ul key={`check-${i}`} className="space-y-2 my-4">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2.5 text-slate-600">
              <span className="text-base shrink-0">{item.icon}</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item.text) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }
    // Blockquote / note lines starting with >
    else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-sky-500 bg-sky-50 px-5 py-3 rounded-r-xl my-4 text-slate-700 italic">
          {line.slice(2)}
        </blockquote>
      );
    }
    // Empty line
    else if (line.trim() === "") {
      // skip
    }
    // Paragraph
    else {
      elements.push(
        <p key={i} className="text-slate-600 leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
        />
      );
    }

    i++;
  }

  return elements;
}

/** Handle **bold**, *italic*, and `code` inline */
function inlineFormat(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-slate-800'>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code class='bg-slate-100 text-sky-700 px-1.5 py-0.5 rounded text-sm font-mono'>$1</code>");
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = getBlogPostBySlug(slug);
    if (found) {
      setPost(found);
      setRelated(getRelatedPosts(found.id, found.category, 3));
    } else {
      setPost(null);
    }
  }, [slug]);

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || "");
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Article not found</h2>
          <p className="text-slate-500 mb-6">This article may have been moved or removed.</p>
          <Link to="/Blog">
            <Button className="bg-sky-500 hover:bg-sky-600 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-slate-900">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 max-w-4xl mx-auto">
          <Badge className="mb-3 bg-amber-500 text-white border-0 text-xs shadow">
            {post.category}
          </Badge>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/Blog" className="hover:text-sky-600 transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Article body */}
          <article className="flex-1 min-w-0">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b border-slate-200">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                ✍️ {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-400" /> {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" /> {post.readTime} read
              </span>
            </div>

            {/* Content */}
            <div className="prose-container max-w-none">
              {renderContent(post.content)}
            </div>

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-slate-400" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs border border-slate-200 text-slate-600 rounded-full px-3 py-1 hover:border-sky-400 hover:text-sky-600 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-3">Share this article</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors"
                >
                  <Twitter className="w-4 h-4" /> Twitter
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            {/* Back button */}
            <div className="mt-10">
              <Link to="/Blog">
                <Button variant="outline" className="gap-2 border-slate-200">
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Button>
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-6">
            {/* CTA */}
            <Card className="border border-sky-100 bg-gradient-to-br from-sky-50 to-white rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <img src="/logo.png" alt="BK Properties" className="h-10 mb-4 object-contain" />
                <h3 className="font-bold text-slate-900 mb-2">Ready to find your dream property?</h3>
                <p className="text-sm text-slate-500 mb-4">Browse thousands of verified properties across Kenya.</p>
                <Link to="/Properties">
                  <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold gap-2">
                    Browse Properties <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/VendorPortal">
                  <Button variant="outline" className="w-full mt-2 border-sky-400 text-sky-600 hover:bg-sky-50 gap-2">
                    List a Property
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* All posts quick nav */}
            <Card className="border border-slate-100 rounded-2xl">
              <CardContent className="p-5">
                <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">All Articles</h3>
                <ul className="space-y-3">
                  {BLOG_POSTS.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/blog/${p.slug}`}
                        className={`flex items-start gap-3 group ${p.id === post.id ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <img src={p.thumbnail} alt={p.title} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">
                            {p.title}
                          </p>
                          <span className="text-xs text-slate-400 mt-0.5 block">{p.readTime} read</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link key={rp.id} to={`/blog/${rp.slug}`} className="group block">
                  <Card className="overflow-hidden border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all rounded-2xl h-full">
                    <div className="h-44 overflow-hidden bg-slate-100">
                      <img
                        src={rp.thumbnail}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-5">
                      <Badge className="mb-2 bg-amber-500/10 text-amber-600 border-amber-200 text-xs">{rp.category}</Badge>
                      <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-sky-600 transition-colors text-sm leading-snug mb-2">
                        {rp.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{rp.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rp.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
