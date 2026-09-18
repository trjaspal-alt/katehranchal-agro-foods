import React, { useState } from 'react';
import { PageRoute } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
    consent: false,
    websiteUrl: '', // Honeypot spam prevention
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Spam honeypot detection
    if (formData.websiteUrl) {
      setIsSubmitted(true);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please enter your name, email address, and message.');
      return;
    }

    if (!formData.consent) {
      setErrorMsg('Please confirm your consent for us to respond to your inquiry.');
      return;
    }

    setIsSubmitting(true);
    // Simulate safe client/server handling
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
        consent: false,
        websiteUrl: '',
      });
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B]">
          Direct Communication Desk
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#124328]">
          Get in Touch with Our Team
        </h1>
        <p className="text-xs sm:text-base text-[#132218]/75 leading-relaxed">
          Whether you have an inquiry regarding traditional batch preparation, product availability, or institutional bulk requirements, our team is available to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Official Business & Contact Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#124328]/10 shadow-xs space-y-6">
            <div className="border-b border-[#124328]/10 pb-4">
              <h2 className="font-serif text-xl font-bold text-[#124328]">
                Official Business Information
              </h2>
              <p className="text-xs text-[#E0980B] font-medium mt-0.5">
                {BUSINESS_INFO.brandName} • {BUSINESS_INFO.parentGroupLine}
              </p>
              <div className="text-[11px] text-[#132218]/60 mt-1">
                Business Type: <span className="font-semibold text-[#124328]">{BUSINESS_INFO.businessType}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Registered Address */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-[#F5EFEB] text-[#124328] shrink-0">
                  <MapPin className="w-5 h-5 text-[#1C602A]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#132218]/60 uppercase tracking-wider">
                    Registered & Dispatch Address
                  </div>
                  <div className="font-medium text-[#124328] leading-relaxed mt-0.5">
                    Plot No. 143, Village Padariya Dalelpur,<br />
                    Post Banda, District Shahjahanpur,<br />
                    Uttar Pradesh 242042, India
                  </div>
                  <div className="text-[10px] text-[#E0980B] font-semibold mt-1">
                    PIN Code: 242042 • Country: India
                  </div>
                </div>
              </div>

              {/* Authorised Person & Leadership */}
              <div className="flex items-start gap-3.5 pt-3 border-t border-[#124328]/5">
                <div className="p-2.5 rounded-lg bg-[#F5EFEB] text-[#124328] shrink-0">
                  <User className="w-5 h-5 text-[#1C602A]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#132218]/60 uppercase tracking-wider">
                    Administration & Authorisation
                  </div>
                  <div className="text-xs text-[#132218]/90 mt-0.5">
                    Owner: <span className="font-bold text-[#124328]">{BUSINESS_INFO.owner}</span>
                  </div>
                  <div className="text-xs text-[#132218]/90">
                    Authorised Person: <span className="font-bold text-[#124328]">{BUSINESS_INFO.authorisedPerson}</span>
                  </div>
                  <p className="text-[10px] text-[#132218]/60 mt-1 italic">
                    Mr. A. S. Shankdhar serves as the designated Authorised Person for all operational and customer communications.
                  </p>
                </div>
              </div>

              {/* Official Email */}
              <div className="flex items-start gap-3.5 pt-3 border-t border-[#124328]/5">
                <div className="p-2.5 rounded-lg bg-[#F5EFEB] text-[#124328] shrink-0">
                  <Mail className="w-5 h-5 text-[#1C602A]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#132218]/60 uppercase tracking-wider">
                    Official Business Email
                  </div>
                  <a
                    href={`mailto:${BUSINESS_INFO.officialEmail}`}
                    className="font-bold text-[#124328] hover:text-[#1C602A] transition-colors"
                  >
                    {BUSINESS_INFO.officialEmail}
                  </a>
                  <p className="text-[11px] text-[#132218]/60 mt-0.5">
                    Inquiries, order assistance, and official correspondence.
                  </p>
                </div>
              </div>

              {/* Customer Support Phone & WhatsApp */}
              <div className="flex items-start gap-3.5 pt-3 border-t border-[#124328]/5">
                <div className="p-2.5 rounded-lg bg-[#F5EFEB] text-[#124328] shrink-0">
                  <Phone className="w-5 h-5 text-[#1C602A]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#132218]/60 uppercase tracking-wider">
                    Customer Support Phone
                  </div>
                  <a
                    href={`tel:${BUSINESS_INFO.customerSupportPhone.replace(/\s+/g, '')}`}
                    className="font-bold text-[#124328] hover:text-[#1C602A] transition-colors"
                  >
                    {BUSINESS_INFO.customerSupportPhone}
                  </a>
                  <div className="mt-1.5 flex items-center gap-2">
                    <a
                      href={BUSINESS_INFO.whatsAppDirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#124328] text-[#FBF9F4] text-xs font-semibold hover:bg-[#1C602A] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#E0980B]" />
                      <span>WhatsApp Support</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5 pt-3 border-t border-[#124328]/5">
                <div className="p-2.5 rounded-lg bg-[#F5EFEB] text-[#124328] shrink-0">
                  <Clock className="w-5 h-5 text-[#1C602A]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#132218]/60 uppercase tracking-wider">
                    Customer Support Hours
                  </div>
                  <div className="font-semibold text-[#124328]">
                    {BUSINESS_INFO.grievance.customerSupportHours}
                  </div>
                  <p className="text-[11px] text-[#132218]/60 mt-0.5">
                    Closed on Sundays and national public holidays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Message Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#124328]/10 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#124328]">
                Send an Official Message
              </h2>
              <p className="text-xs text-[#132218]/70 mt-1">
                Our support desk reviews messages and responds within {BUSINESS_INFO.grievance.acknowledgementTimeframe}.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded-xl bg-[#1C602A]/10 border border-[#1C602A]/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#1C602A] mx-auto" />
                <h3 className="font-serif text-xl font-bold text-[#124328]">
                  Message Received
                </h3>
                <p className="text-xs sm:text-sm text-[#132218]/80 max-w-md mx-auto leading-relaxed">
                  Thank you for contacting Katehranchal Agro Foods. Our customer assistance desk in Padariya Dalelpur will review your inquiry and respond within {BUSINESS_INFO.grievance.acknowledgementTimeframe}.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-5 py-2.5 rounded-lg bg-[#124328] text-[#FBF9F4] text-xs font-semibold hover:bg-[#1C602A] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field for spam prevention */}
                <input
                  type="text"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorMsg && (
                  <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-[#132218]/70 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#124328]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#124328]"
                      placeholder="e.g., Rajesh Sharma"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-[#132218]/70 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#124328]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#124328]"
                      placeholder="e.g., rajesh@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-[#132218]/70 uppercase tracking-wider mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#124328]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#124328]"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-[#132218]/70 uppercase tracking-wider mb-1">
                      Inquiry Category
                    </label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#124328]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#124328] bg-white"
                    >
                      <option value="General Inquiry">General Product Inquiry</option>
                      <option value="Launch Updates">Launch Updates & Availability</option>
                      <option value="Packaging & Sourcing">Sourcing & Preparation Questions</option>
                      <option value="Bulk Order">Institutional & Family Bulk Requests</option>
                      <option value="Grievance / Feedback">Customer Grievance or Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-[#132218]/70 uppercase tracking-wider mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#124328]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#124328]"
                    placeholder="How may our customer desk assist you?"
                  />
                </div>

                {/* Consent text */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="contact-consent"
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-[#124328]/30 text-[#124328] focus:ring-[#124328]"
                  />
                  <label htmlFor="contact-consent" className="text-xs text-[#132218]/70 leading-normal">
                    I consent to Katehranchal Agro Foods processing my contact details solely to respond to this inquiry in accordance with the{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('policy-privacy')}
                      className="text-[#124328] underline font-semibold"
                    >
                      Privacy Policy
                    </button>
                    . We do not send spam or monetize personal data.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#124328] text-[#FBF9F4] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1C602A] transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
