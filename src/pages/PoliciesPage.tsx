import React, { useState } from 'react';
import { PageRoute } from '../types';
import { BUSINESS_INFO } from '../data/businessInfo';
import { ShieldCheck, Info, FileText, Truck, RotateCcw, AlertOctagon, Lock, HelpCircle } from 'lucide-react';

interface PoliciesPageProps {
  initialPolicy?: 'shipping' | 'returns' | 'cancellation' | 'privacy' | 'terms' | 'payment' | 'grievance';
  onNavigate: (route: PageRoute) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({
  initialPolicy = 'shipping',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    'shipping' | 'returns' | 'cancellation' | 'privacy' | 'terms' | 'payment' | 'grievance'
  >(initialPolicy);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      {/* Header */}
      <div className="border-b border-[#124328]/10 pb-6 space-y-2">
        <div className="text-xs font-bold uppercase tracking-widest text-[#E0980B]">
          Store Compliance & Consumer Protection
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#124328]">
          Policies, Terms & Customer Protection
        </h1>
        <p className="text-xs sm:text-sm text-[#132218]/70 leading-relaxed max-w-3xl">
          Katehranchal Agro Foods operates with absolute legal transparency. Below are the verified frameworks governing shipping, packaging integrity, returns, cancellations, privacy protection, and service terms.
        </p>
      </div>

      {/* Policy Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'shipping', label: 'Shipping Policy', icon: Truck },
          { id: 'returns', label: 'Returns and Refunds', icon: RotateCcw },
          { id: 'cancellation', label: 'Cancellation Policy', icon: AlertOctagon },
          { id: 'payment', label: 'Payment & Security Policy', icon: ShieldCheck },
          { id: 'privacy', label: 'Privacy Policy', icon: Lock },
          { id: 'terms', label: 'Terms and Conditions', icon: FileText },
          { id: 'grievance', label: 'Grievance & Contact', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#124328] text-[#FBF9F4] shadow-xs'
                  : 'bg-white text-[#132218]/70 border border-[#124328]/10 hover:bg-[#F5EFEB]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Policy Content Container */}
      <div className="bg-white rounded-2xl border border-[#124328]/10 p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm leading-relaxed text-[#132218]/80">
        
        {/* Transparent Compliance Status Banner */}
        <div className="p-4 rounded-xl bg-[#FBF9F4] border border-[#124328]/15 flex items-start gap-3 text-xs text-[#132218]/80">
          <Info className="w-4 h-4 text-[#124328] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#124328]">Provisional Policy Framework Notice:</span> The policies below represent the official provisional customer protection and commercial terms of Katehranchal Agro Foods. Online purchasing and live payment collections will remain safely disabled until third-party logistics agreements, FSSAI regulatory verifications, and taxation configurations are finalized.
          </div>
        </div>

        {/* 1. Shipping Policy */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#124328]">
                Shipping and Delivery Policy
              </h2>
              <div className="text-xs text-[#E0980B] font-medium mt-0.5">
                Provisional Logistics Architecture • Pan-India Coverage Intention
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                1. Intended Service Area
              </h3>
              <p>
                Katehranchal Agro Foods intends to deliver products across India. Final delivery to any customer location is strictly subject to postal PIN-code serviceability by our contracted courier and express freight partners.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                2. Dispatch Location
              </h3>
              <p>
                All parcels will be prepared, packed, and dispatched directly from our registered rural facility:
              </p>
              <div className="p-3.5 rounded-lg bg-[#F5EFEB] border border-[#124328]/10 font-medium text-xs text-[#124328]">
                {BUSINESS_INFO.registeredAddress.formatted}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                3. Current Configuration Status
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Shipping provider:</strong> Logistics partner integrations are currently undergoing evaluation and are not yet confirmed.</li>
                <li><strong>Shipping charges:</strong> Final freight tariffs and weight slabs are not yet configured.</li>
                <li><strong>Free-shipping threshold:</strong> Qualifying order amounts for complimentary delivery are not yet configured.</li>
                <li><strong>Dispatch turnaround:</strong> Official warehouse dispatch SLAs are pending final logistics approval.</li>
                <li><strong>Delivery estimate:</strong> Regional delivery timelines are pending final carrier route approval.</li>
              </ul>
              <p className="mt-2 text-[#124328] font-medium">
                Until these shipping parameters are fully configured and verified, live consumer orders remain disabled.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                4. Operational Commitments When Live
              </h3>
              <p>
                Once live commercial operations commence, Katehranchal Agro Foods commits to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Validating PIN-code serviceability prior to accepting payment.</li>
                <li>Displaying transparent shipping charges clearly before order submission with no hidden mandatory fees.</li>
                <li>Providing realistic, achievable dispatch and transit estimates without artificial guarantees.</li>
                <li>Supplying live carrier tracking details via email upon parcel handover.</li>
              </ul>
            </section>
          </div>
        )}

        {/* 2. Returns and Refunds Policy */}
        {activeTab === 'returns' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#124328]">
                Return and Refund Policy
              </h2>
              <div className="text-xs text-[#E0980B] font-medium mt-0.5">
                Food Safety, Hygiene & Transparent Customer Remedies
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                1. General Rule for Packaged Food Products
              </h3>
              <p>
                Because food products (such as Desi Ghee, cold-pressed mustard oils, and whole grains) are highly sensitive to hygiene, temperature, storage conditions, potential contamination, and tampering after delivery, Katehranchal Agro Foods does not ordinarily accept returns for:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Change of mind or personal preference.</li>
                <li>Personal taste or aroma preference.</li>
                <li>A product or pack size no longer being required by the customer.</li>
                <li>An incorrect product or variation mistakenly ordered by the customer.</li>
                <li>Refusal of a correctly supplied and undamaged order without a valid cause.</li>
                <li>Damage occurring after successful physical delivery.</li>
                <li>Incorrect storage or handling by the customer (e.g., exposure to heat or moisture).</li>
                <li>Properly disclosed natural variations in color, grain, or seasonal crystallization that do not make the product defective.</li>
              </ul>
              <p className="text-xs text-[#132218]/70 italic mt-1">
                Note: This standard does not restrict or remove any consumer remedies required under applicable consumer protection legislation.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                2. Eligible Problems for Remedy
              </h3>
              <p>
                We provide a full and prompt remedy whenever a customer receives:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>The wrong product or an incorrect pack size.</li>
                <li>A missing item from a multi-item order.</li>
                <li>A materially damaged parcel or cracked container.</li>
                <li>A leaking bottle or jar.</li>
                <li>A visibly tampered security seal or broken packaging.</li>
                <li>An expired product or defective batch.</li>
                <li>A product materially different from the confirmed order specification.</li>
                <li>A product appearing unsafe, contaminated, or defective upon delivery.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                3. Reporting Within 48 Hours
              </h3>
              <p>
                Customers are requested to report visible transit damage, leakage, tampering, missing items, or incorrect products within <strong>48 hours</strong> of recorded delivery. Prompt reporting assists our team in conducting swift investigations with logistics carriers and packaging teams.
              </p>
              <p className="text-xs text-[#132218]/70 italic">
                Reporting outside 48 hours does not automatically void applicable statutory consumer rights, but early notification is essential for timely carrier insurance claims.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                4. Required Verification Evidence
              </h3>
              <p>
                To help us resolve your issue promptly, please submit:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Your Order Number and registered contact details.</li>
                <li>A brief description of the observed issue.</li>
                <li>Clear photographs of the outer shipping box and attached courier shipping label.</li>
                <li>Clear photographs of the affected product showing the damage, leakage, or seal condition.</li>
                <li>Visible batch number and date details where legible.</li>
              </ul>
              <p className="text-xs text-[#132218]/70">
                While an unpacking video is helpful in establishing shipping carrier liability, a genuine complaint will <em>not</em> be automatically rejected solely because an unpacking video is unavailable.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                5. Resolution Options
              </h3>
              <p>
                Following verification, Katehranchal Agro Foods will offer an appropriate remedy:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>A free replacement unit dispatched with priority freight.</li>
                <li>A full refund for the affected item to the original payment method.</li>
                <li>Immediate dispatch of any missing item.</li>
                <li>Store credit only if explicitly and freely chosen by the customer (store credit will never be forced when a refund is due).</li>
              </ul>
              <p className="text-xs text-[#132218]/70">
                For verified seller, carrier, or product errors, Katehranchal Agro Foods bears all replacement freight costs. Customers will not be asked to return unsafe or opened food items unless legally required and safe packaging instructions are provided.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                6. Refund Processing Timeframe
              </h3>
              <div className="p-3 rounded-lg bg-[#FBF9F4] border border-[#124328]/10 text-xs font-medium text-[#124328]">
                &ldquo;Approved refunds are initiated within 5–7 business days. The time required for the amount to appear may additionally depend on the bank or payment provider.&rdquo;
              </div>
              <p className="text-xs text-[#132218]/70 mt-1">
                For partial order issues, resolution is issued specifically for the affected item and related proportional charges without disrupting correctly delivered items.
              </p>
              <p className="text-xs font-bold text-[#C47D0B]">
                Security Safeguard: Katehranchal Agro Foods representatives will never ask for your card number, CVV, UPI PIN, OTP, or net-banking password.
              </p>
            </section>
          </div>
        )}

        {/* 3. Cancellation Policy */}
        {activeTab === 'cancellation' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#124328]">
                Order Cancellation Policy
              </h2>
              <div className="text-xs text-[#E0980B] font-medium mt-0.5">
                Pre-Dispatch & Operational Cancellation Guidelines
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                1. Customer Cancellation Before Dispatch
              </h3>
              <p>
                Customers may request cancellation of an order before it has been packed or handed over to our shipping provider. Once an order has been packed, dispatched, or handed over to the courier, cancellation may no longer be possible.
              </p>
              <p className="text-xs text-[#132218]/70">
                A cancellation request is not considered accepted until Katehranchal Agro Foods confirms it in writing via email or customer support response. For an accepted prepaid cancellation prior to dispatch, an eligible refund is initiated to the original payment method within 5–7 business days.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                2. Business Cancellation by Katehranchal Agro Foods
              </h3>
              <p>
                Katehranchal Agro Foods reserves the right to cancel an order under the following documented circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>A product is unexpectedly unavailable due to agricultural harvest shortfalls.</li>
                <li>A genuine technical or clerical pricing error occurred on the storefront.</li>
                <li>The customer delivery PIN code is determined to be non-serviceable by our logistics network.</li>
                <li>Payment gateway authorization or cryptographic signature verification fails.</li>
                <li>Customer contact or shipping information is materially incomplete or unverified.</li>
                <li>The transaction is flagged during reasonable fraud security review.</li>
                <li>Fulfillment becomes impossible due to force majeure, transport strikes, or unforeseen regulatory directives.</li>
              </ul>
              <p className="text-xs font-medium text-[#124328] mt-2">
                When Katehranchal Agro Foods cancels a prepaid order without customer fault, we refund the entire eligible amount, including any collected shipping charges. We will never cancel a confirmed valid order merely because market prices subsequently fluctuated.
              </p>
            </section>
          </div>
        )}

        {/* 4. Payment & Security Policy */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#124328]">
                Payment, Security & Financial Protection Policy
              </h2>
              <div className="text-xs text-[#E0980B] font-medium mt-0.5">
                PCI-DSS Level 1 Standards • Zero Credential Storage
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                1. Non-Storage of Financial Credentials
              </h3>
              <p>
                In strict compliance with Reserve Bank of India (RBI) mandates and global PCI-DSS standards, Katehranchal Agro Foods does <strong>not</strong> collect, process, log, or store sensitive financial credentials on its servers. This includes credit/debit card numbers, CVVs, card expiry dates, UPI MPINs, and internet banking passwords.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                2. Server-Side Cryptographic Signature Verification
              </h3>
              <p>
                All payment confirmations require backend cryptographic signature verification (HMAC-SHA256) between our secure servers and licensed Indian payment aggregators. No order status is updated or released for dispatch without authenticated cryptographic confirmation.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                3. Supported Payment Instruments
              </h3>
              <p>
                When live purchasing is enabled, supported instruments include:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Unified Payments Interface (UPI): Google Pay, PhonePe, Paytm, BHIM, and bank UPI apps.</li>
                <li>Debit and Credit Cards: RuPay, Visa, and Mastercard with mandatory 3D-Secure 2.0 two-factor authentication.</li>
                <li>Internet Banking: Direct authorization via 50+ scheduled Indian commercial banks.</li>
                <li>Digital Wallets: Major RBI-authorized wallet providers.</li>
              </ul>
              <p className="text-xs text-[#132218]/70 mt-1">
                Notice: Cash on Delivery (COD) remains strictly disabled until courier agreements and regional cash-collection protocols are finalized.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                4. Failed Deductions & Dual Debits
              </h3>
              <p>
                If funds are debited from your account due to an intermittent network failure without order confirmation, the amount is automatically reversed by the issuing bank within 3 to 5 banking days. For assistance, contact our official support desk at {BUSINESS_INFO.officialEmail}.
              </p>
            </section>
          </div>
        )}

        {/* 5. Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#124328]">
                Privacy Policy
              </h2>
              <div className="text-xs text-[#E0980B] font-medium mt-0.5">
                Commitment to Personal Data Protection & Anti-Spam
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                1. Information We Collect
              </h3>
              <p>
                We collect only the information necessary to fulfill orders and provide direct customer support: recipient full name, postal delivery address, email address, and mobile phone number.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                2. Zero Third-Party Data Monetization
              </h3>
              <p>
                We never sell, rent, lease, or monetize customer personal information to marketing brokers or advertising networks. Contact information is used exclusively for dispatch tracking, customer service responses, and optional launch update notifications.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                3. Data Security & Retention
              </h3>
              <p>
                All communications between customer browsers and our servers are encrypted via HTTPS (TLS 1.3). Personal customer information is retained only as long as required for order fulfillment, accounting, and statutory tax compliance under Indian law.
              </p>
            </section>
          </div>
        )}

        {/* 6. Terms and Conditions */}
        {activeTab === 'terms' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#124328]">
                Terms and Conditions
              </h2>
              <div className="text-xs text-[#E0980B] font-medium mt-0.5">
                Operating Standards & Legal Framework
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                1. Business Identity
              </h3>
              <p>
                This website is operated by <strong>{BUSINESS_INFO.brandName}</strong>, a sole proprietorship owned by {BUSINESS_INFO.owner}, operating under {BUSINESS_INFO.parentGroupLine}. Registered address: {BUSINESS_INFO.registeredAddress.formatted}.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                2. Informational Catalogue Status
              </h3>
              <p>
                Product specifications, descriptions, and imagery on this website are published for consumer information. Commercial ordering is subject to configuration of shipping, licensing, and payment gateways.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                3. Governing Law & Jurisdiction
              </h3>
              <p>
                These terms, policies, and any commercial transactions are governed exclusively by the laws of India. Any legal dispute or proceeding arising out of or related to our products or services shall be subject to the exclusive jurisdiction of the competent courts in District Shahjahanpur, Uttar Pradesh, India.
              </p>
            </section>
          </div>
        )}

        {/* 7. Grievance & Contact Information */}
        {activeTab === 'grievance' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#124328]">
                Contact, Support & Grievance Information
              </h2>
              <div className="text-xs text-[#E0980B] font-medium mt-0.5">
                Customer Assistance & Formal Complaint Architecture
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#124328]/10 space-y-3">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                Registered Business Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[#132218]/60 uppercase tracking-wider font-semibold text-[10px]">Brand Name</div>
                  <div className="font-bold text-[#124328]">{BUSINESS_INFO.brandName}</div>
                  <div className="text-[#132218]/70">{BUSINESS_INFO.parentGroupLine} ({BUSINESS_INFO.businessType})</div>
                </div>
                <div>
                  <div className="text-[#132218]/60 uppercase tracking-wider font-semibold text-[10px]">Business Leadership</div>
                  <div className="text-[#132218]/90">Owner: <span className="font-semibold text-[#124328]">{BUSINESS_INFO.owner}</span></div>
                  <div className="text-[#132218]/90">Authorised Person: <span className="font-semibold text-[#124328]">{BUSINESS_INFO.authorisedPerson}</span></div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[#132218]/60 uppercase tracking-wider font-semibold text-[10px]">Registered Business & Dispatch Address</div>
                  <div className="font-medium text-[#124328]">{BUSINESS_INFO.registeredAddress.formatted}</div>
                </div>
              </div>
            </div>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                Customer Support Channels
              </h3>
              <p>
                For order status, product details, or general inquiries:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Official Email:</strong> <a href={`mailto:${BUSINESS_INFO.officialEmail}`} className="text-[#124328] font-bold underline">{BUSINESS_INFO.officialEmail}</a></li>
                <li><strong>Customer Support Phone:</strong> <a href={`tel:${BUSINESS_INFO.customerSupportPhone.replace(/\s+/g, '')}`} className="text-[#124328] font-bold">{BUSINESS_INFO.customerSupportPhone}</a></li>
                <li><strong>Support Operating Hours:</strong> {BUSINESS_INFO.grievance.customerSupportHours}</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-serif text-base font-bold text-[#124328]">
                Formal Complaint Redressal
              </h3>
              <p>
                If a customer inquiry is not resolved to satisfaction through our primary support desk:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Complaints may be submitted directly to our official email (<a href={`mailto:${BUSINESS_INFO.grievance.grievanceEmail}`} className="text-[#124328] font-semibold">{BUSINESS_INFO.grievance.grievanceEmail}</a>) quoting your Order ID.</li>
                <li>Authorised Representative for Escalations: <strong>{BUSINESS_INFO.grievance.authorisedRepresentative}</strong></li>
                <li>Complaint Acknowledgement: <strong>{BUSINESS_INFO.grievance.acknowledgementTimeframe}</strong></li>
                <li>Target Resolution Window: <strong>{BUSINESS_INFO.grievance.resolutionTimeframe}</strong></li>
              </ul>
              <p className="text-[11px] text-[#132218]/60 italic mt-2">
                Statutory Grievance Officer Notice: In accordance with our strict factual guidelines, Mr. A. S. Shankdhar acts as the designated Authorised Person. He is not described as a statutory grievance officer unless such specific statutory designation is confirmed.
              </p>
            </section>
          </div>
        )}
      </div>

      {/* Customer Contact Assistance Card */}
      <div className="p-6 rounded-2xl bg-[#F5EFEB] border border-[#124328]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-base font-bold text-[#124328]">
            Need Clarification on Our Policies?
          </h3>
          <p className="text-xs text-[#132218]/70 mt-1">
            Our team in Shahjahanpur, Uttar Pradesh is available to assist you via email or phone.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2 rounded-lg bg-[#124328] text-white text-xs font-semibold hover:bg-[#1C602A] transition-colors"
          >
            Contact Customer Care
          </button>
          <a
            href={BUSINESS_INFO.whatsAppDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-white border border-[#124328]/20 text-[#124328] text-xs font-semibold hover:bg-[#FAF7F2] transition-colors"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
};
