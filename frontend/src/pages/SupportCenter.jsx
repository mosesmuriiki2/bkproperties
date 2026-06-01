import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Phone, Mail, MessageSquare, Clock, Globe, ArrowRight,
  HeadphonesIcon, CheckCircle, Headphones
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const contacts = [
  {
    icon: Phone,
    color: "bg-emerald-500",
    label: "Phone Support",
    value: "+254 700 123 456",
    subValue: "+254 733 987 654",
    desc: "Call us directly for urgent matters",
    available: "24/7 Available",
  },
  {
    icon: Mail,
    color: "bg-blue-500",
    label: "Email Support",
    value: "support@bkproperties.com",
    subValue: "help@bkproperties.com",
    desc: "We respond within 2 hours on business days",
    available: "Replies within 2 hrs",
  },
  {
    icon: MessageSquare,
    color: "bg-purple-500",
    label: "Live Chat",
    value: "Chat with an Agent",
    subValue: null,
    desc: "Instant help from our support team",
    available: "Online Now",
    cta: true,
  },
];

const faqs = [
  { q: "How do I book a listing?", a: "Find your listing, click 'Book Now', fill in your details, and pay via M-Pesa or bank transfer. You'll receive a confirmation email instantly." },
  { q: "How do I become a verified vendor?", a: "Apply through our Vendor Portal by filling out your business details and selecting a plan. Our team reviews applications within 24–48 hours." },
  { q: "What payment methods are supported?", a: "We support M-Pesa, bank transfers, and major credit/debit cards. All transactions are secured and encrypted." },
  { q: "How do I report an issue with a vendor?", a: "Go to the listing, click 'Report', or contact support directly via email or phone with your booking reference number." },
  { q: "Can I cancel or modify a booking?", a: "Cancellation policies vary by vendor. Check the listing's cancellation policy before booking, or contact support for assistance." },
];

export default function SupportCenter() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <Badge className="mb-5 bg-white/10 text-white border-white/20 text-sm px-4 py-1.5">
            <Headphones className="w-3.5 h-3.5 mr-1.5" /> 24/7 Support Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            How Can We Help?
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
            Our support team is available 24/7. Reach us via call, email, or live chat and we'll get back to you fast.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Average response time: &lt;2 hrs
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white text-sm">
              <Clock className="w-4 h-4 text-blue-300" /> Available 24/7 including weekends
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-white text-sm">
              <Globe className="w-4 h-4 text-purple-300" /> Support in English & Swahili
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {contacts.map((c) => (
            <div key={c.label} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center mb-4 shadow-md`}>
                <c.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900">{c.label}</h3>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">{c.available}</Badge>
              </div>
              <p className="text-gray-500 text-sm mb-3">{c.desc}</p>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">{c.value}</p>
                {c.subValue && <p className="text-gray-600 text-sm">{c.subValue}</p>}
              </div>
              {c.cta && (
                <Button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white gap-2">
                  <MessageSquare className="w-4 h-4" /> Start Chat
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Support Portal CTA (for vendors/staff) */}
      <section className="max-w-5xl mx-auto px-4 mt-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Are you Support Staff or a Vendor?</h3>
            <p className="text-blue-100 text-sm">Log in to the Support Portal to manage tickets, issues, and vendor queries.</p>
          </div>
          <Link to={createPageUrl("SupportLogin")}>
            <Button className="bg-white text-blue-700 hover:bg-gray-100 gap-2 font-semibold shrink-0">
              Support Portal Login <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-500 text-center mb-8">Quick answers to common questions</p>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                <span className="text-blue-500 shrink-0 mt-0.5">Q.</span> {faq.q}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-900 py-14">
        <div className="max-w-2xl mx-auto text-center px-4">
          <HeadphonesIcon className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Still need help?</h2>
          <p className="text-gray-400 mb-6">Our dedicated support team is just a message away. Don't hesitate to reach out.</p>
          <a href="mailto:support@bkproperties.com">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 gap-2">
              <Mail className="w-4 h-4" /> Email Us Now
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}