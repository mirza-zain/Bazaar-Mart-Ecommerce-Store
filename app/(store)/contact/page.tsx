'use client';

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ChevronDown,
  AlertCircle,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { submitInquiryAction } from "@/app/lib/actions/inquiries";

const faqs = [
  {
    question: "How long does delivery take across Pakistan?",
    answer:
      "All orders are processed within 24 hours. Deliveries within Karachi typically arrive within 1-2 business days. Deliveries to Lahore, Islamabad, Rawalpindi, and other nationwide destinations arrive in 2-4 business days via Leopard and TCS Express.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD) for deliveries in Karachi. For all other cities across Pakistan, we accept direct Bank Transfer to our official Bank AL Habib merchant account (via EasyPaisa, JazzCash, SadaPay, Nayapay, or any 1Link bank) with instant verification upon uploading your transfer screenshot at checkout.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "We offer a 30-day hassle-free return and exchange policy. Products must be unworn, undamaged, and returned with original tags intact. If you need a size exchange, contact our support team and we will coordinate courier pickup.",
  },
  {
    question: "How can I track my shipment?",
    answer:
      "You can track your order anytime on our dedicated tracking page at /track. Simply enter your Order ID (e.g. #ORD-0001) or the email address used during checkout to view live status updates and courier dispatch details.",
  },
  {
    question: "How do I know my size before ordering?",
    answer:
      "Our streetwear hoodies and tees follow modern relaxed / slightly oversized silhouettes. Check the variant specifications on each product page or reach out to us on WhatsApp with your height and weight for quick sizing advice.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await submitInquiryAction(formData);
      if (res.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setErrorMessage(res.error || "Failed to send message. Please try again.");
      }
    });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-5 md:px-12 py-10 space-y-12">
      {/* Back to Home */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="pb-8 border-b border-neutral-200">
        <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-neutral-900">
          Contact & Support
        </h1>
        <p className="text-neutral-500 text-sm md:text-base mt-2 max-w-xl">
          Have questions about sizing, your active shipment, or wholesale inquiries? Our Karachi-based support team is here to assist you.
        </p>
      </div>

      {/* Main Grid: Channels + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Channels (1 col) */}
        <div className="space-y-4">
          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/923332244373?text=Hello%20me2one%2C%20I%20have%20an%20inquiry%20regarding%20an%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-start gap-4 hover:border-emerald-400 transition group block shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-emerald-950">WhatsApp Support</h3>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold uppercase">
                  Fastest
                </span>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">Direct chat with our Karachi team</p>
              <p className="text-sm font-bold text-emerald-900 mt-2 font-mono group-hover:underline">
                +92 333 2244373 →
              </p>
            </div>
          </a>

          {/* Phone Hotline / Direct Call */}
          <a
            href="tel:+923332244373"
            className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-start gap-4 hover:border-black transition group block"
          >
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-neutral-900">Direct Helpline</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Mon - Sat from 10:00 AM to 8:00 PM</p>
              <p className="text-sm font-mono font-bold text-neutral-900 mt-2 group-hover:underline">
                +92 333 2244373
              </p>
            </div>
          </a>

          {/* Studio Location */}
          <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-neutral-900">Studio & Showroom</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Main Boulevard, Clifton Block 4</p>
              <p className="text-xs text-neutral-700 mt-1">Karachi, Sindh 75600, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Contact Form (2 cols) */}
        <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200 shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-5 h-5 text-neutral-700" />
            <h2 className="text-2xl font-bold text-neutral-900">Send an Inquiry</h2>
          </div>
          <p className="text-sm text-neutral-500 mb-6">
            Fill in your details and message below. We will follow up via email promptly.
          </p>

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {submitted ? (
            <div className="p-10 bg-emerald-50 rounded-3xl border border-emerald-200 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950">Message Sent Successfully!</h3>
              <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to me2one. We have logged your inquiry and our support team will respond to your email address shortly.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Zainab Malik"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="zainab@example.com"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                  Subject / Order Number
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Sizing Advice or Order #ORD-0001"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe how we can assist you..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-hidden focus:border-black transition"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold text-sm rounded-xl hover:bg-neutral-800 transition cursor-pointer shadow-sm w-full sm:w-auto disabled:opacity-60"
              >
                <span>{isPending ? "Sending Inquiry..." : "Submit Inquiry"}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions Section */}
      <div className="pt-10 border-t border-neutral-200">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-neutral-700" />
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-neutral-900">
            Frequently Asked Questions
          </h2>
        </div>
        <p className="text-sm text-neutral-500 mb-8 max-w-xl">
          Quick answers to common questions regarding shipping schedules, payment security, and order returns.
        </p>

        <div className="space-y-3 max-w-4xl">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="border border-neutral-200 rounded-2xl overflow-hidden bg-white transition shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-neutral-900 text-sm sm:text-base hover:bg-neutral-50/70 transition cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-black" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
