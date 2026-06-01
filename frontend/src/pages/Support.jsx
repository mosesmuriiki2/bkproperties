import { useState } from "react";
import { MessageSquare, CheckCircle, Search, ChevronDown, ChevronRight, Phone, Mail, Clock, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const faqs = [
  { q: "How do I book a tour or hotel?", a: "Browse the category, click on a listing, and click 'Book Now'. You'll be guided through date selection, details, and payment via M-Pesa or bank transfer." },
  { q: "How do I become a vendor?", a: "Visit the Vendor Portal page, fill in your business details, and submit for verification. Approval takes 24 hours and you'll receive a confirmation email." },
  { q: "Is my payment secure?", a: "Yes. All payments go through our secure payment system supporting M-Pesa, bank transfers, and card payments with full encryption and OTP verification." },
  { q: "How do I get a refund?", a: "Contact support with your booking reference. Refunds are processed within 3-5 business days according to the vendor's refund policy." },
  { q: "Can I cancel a booking?", a: "Cancellations depend on the vendor's policy. Log in and visit My Bookings to see cancellation options for each booking." },
  { q: "How do I track my booking status?", a: "After booking, you'll receive an email confirmation. You can also log in to your account and visit the Bookings section to track status in real-time." },
];

const contactDetails = [
  {
    icon: Phone, title: "Call Us", color: "bg-emerald-50 text-emerald-600",
    lines: ["+254 700 123 456 (Kenya)", "+1 800 987 6543 (International)"],
    note: "Mon–Fri, 8:00 AM – 6:00 PM EAT"
  },
  {
    icon: Mail, title: "Email Us", color: "bg-blue-50 text-blue-600",
    lines: ["support@bkproperties.com", "vendors@bkproperties.com"],
    note: "We respond within 24 hours"
  },
  {
    icon: MessageSquare, title: "Live Chat", color: "bg-purple-50 text-purple-600",
    lines: ["Available on the platform", "Average response: 5 minutes"],
    note: "Mon–Sun, 24/7"
  },
  {
    icon: MapPin, title: "Head Office", color: "bg-amber-50 text-amber-600",
    lines: ["Westlands Business Park", "Nairobi, Kenya"],
    note: "Walk-ins by appointment only"
  },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", category: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const ticketRef = `MG-${Math.floor(Math.random() * 90000) + 10000}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-900 py-20 px-4 text-center">
        <Link to={createPageUrl("Home")} className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
          <Home className="w-4 h-4" /> Back to Home
        </Link>
        <Badge className="mb-4 bg-white/10 text-white border-white/20 block w-fit mx-auto">💬 Support Center</Badge>
        <h1 className="text-4xl font-extrabold text-white mb-4">How Can We Help?</h1>
        <p className="text-gray-300 mb-8">Our support team is available 24/7. Reach us via call, email, or live chat.</p>
        <div className="flex gap-3 bg-white rounded-xl p-2 max-w-lg mx-auto shadow-lg">
          <Search className="w-5 h-5 text-gray-400 ml-2 my-auto shrink-0" />
          <Input placeholder="Search for help topics..." className="border-0 shadow-none focus-visible:ring-0" />
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0">Search</Button>
        </div>
      </div>

      {/* Contact details — prominently shown */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {contactDetails.map(c => (
            <div key={c.title} className="bg-white rounded-2xl p-5 border hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center mb-4`}>
                <c.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
              {c.lines.map(l => (
                <p key={l} className="text-sm font-medium text-gray-700">{l}</p>
              ))}
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" />{c.note}</p>
            </div>
          ))}
        </div>

        {/* Quick help categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { icon: "📅", title: "Bookings", desc: "Manage & cancel bookings" },
            { icon: "💳", title: "Payments", desc: "Payment issues & refunds" },
            { icon: "🏢", title: "Vendor Support", desc: "Help for vendors" },
            { icon: "🔐", title: "Account", desc: "Login & security" },
          ].map(c => (
            <div key={c.title} className="bg-white rounded-2xl p-5 border hover:shadow-md transition-shadow cursor-pointer text-center">
              <div className="text-3xl mb-3">{c.icon}</div>
              <p className="font-bold text-gray-900 text-sm mb-1">{c.title}</p>
              <p className="text-xs text-gray-500">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQs */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border overflow-hidden">
                  <button className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-semibold text-sm text-gray-900">{faq.q}</span>
                    {openFaq === i ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-600 border-t pt-3 bg-gray-50">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Support Request</h2>
            {!submitted ? (
              <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
                <p className="text-sm text-gray-500">Fill in the form below and we'll acknowledge your request immediately and follow up within 24 hours.</p>
                <Input placeholder="Your Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <Input type="email" placeholder="Email Address (e.g. you@email.com)" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <Select onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Issue Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Booking Issue</SelectItem>
                    <SelectItem value="payment">Payment Problem</SelectItem>
                    <SelectItem value="vendor">Vendor Support</SelectItem>
                    <SelectItem value="account">Account Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <textarea
                  className="w-full border rounded-lg p-3 text-sm text-gray-700 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Describe your issue in detail..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => setSubmitted(true)}>
                  <MessageSquare className="w-4 h-4 mr-2" /> Submit Support Request
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border shadow-sm">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">Request Received!</h3>
                <p className="text-gray-500 text-sm text-center mb-4">
                  We've received your support request and an acknowledgement has been sent to <strong>{form.email}</strong>. Our team will respond within 24 hours.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-center mb-4">
                  <p className="text-xs text-gray-400 mb-1">Your Ticket Reference</p>
                  <p className="font-bold text-emerald-600 text-lg">{ticketRef}</p>
                  <p className="text-xs text-gray-400 mt-1">Keep this for future reference</p>
                </div>
                <div className="border rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">What Happens Next</p>
                  {["Acknowledgement email sent to your inbox immediately", "Assigned to a support agent within 1 hour", "Full resolution within 24 hours (business days)"].map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                      {s}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setSubmitted(false)}>Submit Another Request</Button>
              </div>
            )}

            {/* Direct contact info repeated */}
            <div className="mt-6 bg-white rounded-2xl p-5 border">
              <p className="font-semibold text-gray-900 mb-3">Prefer to reach us directly?</p>
              <div className="space-y-2">
                <a href="tel:+254700123456" className="flex items-center gap-3 text-sm text-gray-700 hover:text-emerald-600 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-500" /> +254 700 123 456 (Kenya)
                </a>
                <a href="tel:+18009876543" className="flex items-center gap-3 text-sm text-gray-700 hover:text-emerald-600 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-500" /> +1 800 987 6543 (International)
                </a>
                <a href="mailto:support@bkproperties.com" className="flex items-center gap-3 text-sm text-gray-700 hover:text-emerald-600 transition-colors">
                  <Mail className="w-4 h-4 text-blue-500" /> support@bkproperties.com
                </a>
                <a href="mailto:vendors@bkproperties.com" className="flex items-center gap-3 text-sm text-gray-700 hover:text-emerald-600 transition-colors">
                  <Mail className="w-4 h-4 text-blue-500" /> vendors@bkproperties.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}