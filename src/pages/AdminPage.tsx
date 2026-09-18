import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertOctagon, 
  Truck, 
  Package, 
  Mail, 
  Users, 
  FileText, 
  RefreshCw, 
  Search, 
  Filter, 
  ChevronRight, 
  Check, 
  Clock, 
  Key, 
  ExternalLink,
  Sliders,
  AlertTriangle,
  Send,
  Eye
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessInfo';
import { ASSET_REGISTER } from '../data/assetRegister';
import { LAUNCH_READINESS_CHECKLIST } from '../data/launchChecklist';

interface AdminPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('kaf_admin_auth') === 'true';
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<
    'gate' | 'orders' | 'emails' | 'subscribers' | 'audit' | 'test_generator' | 'assets'
  >('gate');

  // Launch Safety Gate State
  const [gateReport, setGateReport] = useState<any>(null);
  const [isLoadingGate, setIsLoadingGate] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Order Update State
  const [updateFulfilmentStatus, setUpdateFulfilmentStatus] = useState('Confirmed');
  const [updateTrackingNumber, setUpdateTrackingNumber] = useState('');
  const [updateCourierPartner, setUpdateCourierPartner] = useState('Delhivery Surface');
  const [updateInternalNotes, setUpdateInternalNotes] = useState('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Subscribers State
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);

  // Email Previews
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('order_received');
  const [emailPreviewHtml, setEmailPreviewHtml] = useState<string>('');
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  // Test Order Generator
  const [isGeneratingTestOrder, setIsGeneratingTestOrder] = useState(false);
  const [testOrderResult, setTestOrderResult] = useState<any | null>(null);

  const adminToken = 'kaf_admin_demo_2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (passkey.trim() === 'kaf_admin_demo_2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('kaf_admin_auth', 'true');
    } else {
      setAuthError('Invalid administrative passkey. Please refer to system instructions or default passkey.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('kaf_admin_auth');
  };

  // Load Gate Report
  const loadGateReport = async () => {
    setIsLoadingGate(true);
    try {
      const res = await fetch('/api/readiness/launch-safety-gate');
      if (res.ok) {
        const data = await res.json();
        setGateReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingGate(false);
    }
  };

  // Load Orders
  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        if (data.length > 0 && !selectedOrder) {
          setSelectedOrder(data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Load Audit Logs
  const loadAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Load Subscribers
  const loadSubscribers = async () => {
    setIsLoadingSubscribers(true);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  // Load Email Template
  const loadEmailTemplate = async (templateId: string) => {
    setIsLoadingEmail(true);
    try {
      const res = await fetch(`/api/admin/emails/preview/${templateId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const html = await res.text();
        setEmailPreviewHtml(html);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingEmail(false);
    }
  };

  // Handle Order Status Update
  const handleSaveOrderStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdatingOrder(true);
    setUpdateMessage(null);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          fulfilmentStatus: updateFulfilmentStatus,
          trackingNumber: updateTrackingNumber,
          courierPartner: updateCourierPartner,
          internalNotes: updateInternalNotes,
          note: `Fulfilment changed to ${updateFulfilmentStatus} via Store Admin Console.`,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(updated);
        setUpdateMessage('Order status and courier tracking successfully updated!');
        loadOrders();
      }
    } catch (e) {
      console.error(e);
      setUpdateMessage('Failed to update order status.');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Generate Test Order
  const handleGenerateTestOrder = async () => {
    setIsGeneratingTestOrder(true);
    setTestOrderResult(null);
    try {
      const res = await fetch('/api/admin/create-test-order', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTestOrderResult(data.order);
        loadOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingTestOrder(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadGateReport();
      loadOrders();
      loadAuditLogs();
      loadSubscribers();
      loadEmailTemplate('order_received');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedOrder) {
      setUpdateFulfilmentStatus(selectedOrder.fulfilmentStatus || 'Confirmed');
      setUpdateTrackingNumber(selectedOrder.trackingNumber || '');
      setUpdateCourierPartner(selectedOrder.courierPartner || 'Delhivery Surface');
      setUpdateInternalNotes(selectedOrder.internalNotes || '');
    }
  }, [selectedOrder]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white p-8 rounded-2xl border border-[#124328]/10 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#F5EFEB] flex items-center justify-center mx-auto text-[#124328]">
              <Lock className="w-6 h-6 text-[#E0980B]" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#124328]">
              Store Administration
            </h1>
            <p className="text-xs text-[#132218]/70 leading-relaxed">
              Restricted management console for Katehranchal Agro Foods. Authenticate with your administrative security key.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#124328] block mb-1">
                Admin Passkey / Security Key
              </label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter passkey"
                className="w-full text-xs p-3 rounded-lg border border-[#124328]/20 focus:outline-none focus:border-[#E0980B]"
              />
              <div className="text-[11px] text-[#132218]/50 mt-1">
                Demo Environment Passkey: <code className="font-mono font-bold text-[#124328]">kaf_admin_demo_2026</code>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded bg-red-50 text-red-700 text-xs flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#124328] text-[#FBF9F4] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A5A35] transition-colors cursor-pointer"
            >
              Unlock Administration Console
            </button>
          </form>

          <div className="pt-4 border-t border-[#124328]/10 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-[#132218]/70 hover:text-[#124328] underline"
            >
              Return to Public Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      orderFilter === 'ALL' ||
      o.paymentStatus?.toUpperCase() === orderFilter ||
      o.fulfilmentStatus?.toUpperCase() === orderFilter;
    const matchesSearch =
      !searchQuery ||
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#124328]/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E0980B]">
              Operational Console
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1C602A]/10 text-[#1C602A] border border-[#1C602A]/20">
              Test Mode Active
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#124328] mt-1">
            Katehranchal Store Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('shop')}
            className="px-3.5 py-2 rounded-lg bg-white border border-[#124328]/20 text-xs font-semibold text-[#124328] hover:bg-[#F5EFEB] transition-colors"
          >
            View Storefront
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
          >
            Lock Console
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#124328]/10">
        {[
          { id: 'gate', label: 'Launch Safety Gate & Checklist', icon: ShieldCheck, count: gateReport?.blockerCount },
          { id: 'assets', label: 'Asset & Rights Register', icon: Eye, count: ASSET_REGISTER.length },
          { id: 'orders', label: 'Orders & Fulfilment', icon: Package, count: orders.length },
          { id: 'test_generator', label: 'Test Order Generator', icon: Sliders },
          { id: 'emails', label: 'Transactional Emails (10)', icon: Mail },
          { id: 'subscribers', label: 'Coming Soon Alerts', icon: Users, count: subscribers.length },
          { id: 'audit', label: 'Security Audit Logs', icon: FileText, count: auditLogs.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#124328] text-[#FBF9F4] shadow-xs'
                  : 'bg-white text-[#132218]/70 border border-[#124328]/10 hover:bg-[#F5EFEB]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#E0980B] text-[#124328]' : 'bg-[#124328]/10 text-[#124328]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: LAUNCH SAFETY GATE (21 ITEMS)                     */}
      {/* ========================================================= */}
      {activeTab === 'gate' && (
        <div className="space-y-6">
          {gateReport && (
            <>
              {/* Gate Summary Card */}
              <div className="p-6 rounded-2xl bg-white border border-[#124328]/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#124328]">
                      Production Launch Readiness State:
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {gateReport.summaryStatus}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-[#124328]">
                    {gateReport.readinessPercent}% Compliance Achieved ({gateReport.passedCount}/21 Checks Passed)
                  </h2>
                  <p className="text-xs text-[#132218]/75 leading-relaxed">
                    {gateReport.remedyInstructions}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#124328]/10 text-center shrink-0 w-full md:w-auto">
                  <div className="text-2xl font-bold font-mono text-red-700">
                    {gateReport.blockerCount}
                  </div>
                  <div className="text-[11px] font-bold text-[#124328] uppercase tracking-wider mt-0.5">
                    Critical Blockers
                  </div>
                  <div className="text-[10px] text-[#132218]/60 mt-1">
                    Live payments securely disarmed
                  </div>
                </div>
              </div>

              {/* 21 Criteria Checklist */}
              <div className="bg-white rounded-2xl border border-[#124328]/10 shadow-xs overflow-hidden">
                <div className="p-4 bg-[#F5EFEB] border-b border-[#124328]/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#124328] uppercase tracking-wider">
                    21 Pre-Launch Verification Gates
                  </span>
                  <button
                    onClick={loadGateReport}
                    className="flex items-center gap-1.5 text-xs text-[#124328] font-semibold hover:text-[#E0980B]"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGate ? 'animate-spin' : ''}`} />
                    <span>Re-evaluate Gates</span>
                  </button>
                </div>

                <div className="divide-y divide-[#124328]/10">
                  {gateReport.allGates?.map((g: any, idx: number) => {
                    const isPassed = g.status === 'PASSED';
                    return (
                      <div
                        key={g.id}
                        className={`p-4 flex items-start gap-4 transition-colors ${
                          isPassed ? 'hover:bg-[#FBF9F4]' : 'bg-amber-50/40 hover:bg-amber-50/70'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isPassed ? (
                            <div className="w-6 h-6 rounded-full bg-[#1C602A]/10 text-[#1C602A] flex items-center justify-center">
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                              <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-[#132218]/50 font-bold">
                              #{idx + 1}
                            </span>
                            <span className="font-semibold text-xs text-[#124328]">
                              {g.title}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isPassed
                                  ? 'bg-[#1C602A]/10 text-[#1C602A]'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {g.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#132218]/70 leading-relaxed">
                            {g.description}
                          </p>
                          {g.actionRequired && (
                            <div className="text-[11px] text-amber-900 font-medium pt-0.5">
                              Required action: {g.actionRequired}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ORDERS MANAGEMENT & FULFILMENT                     */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order List Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-[#124328]/10 shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#132218]/40 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by order #, customer, email..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-[#124328]/15 focus:outline-none focus:border-[#E0980B]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {['ALL', 'PAID', 'PENDING', 'CONFIRMED', 'SHIPPED'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
                      orderFilter === filter
                        ? 'bg-[#124328] text-white'
                        : 'bg-[#F5EFEB] text-[#132218]/70 hover:bg-[#124328]/10'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-xl border border-[#124328]/10 text-xs text-[#132218]/60 space-y-3">
                  <Package className="w-8 h-8 text-[#E0980B] mx-auto" />
                  <div>No matching orders found.</div>
                  <button
                    onClick={handleGenerateTestOrder}
                    className="px-3 py-1.5 rounded bg-[#124328] text-[#FBF9F4] font-semibold text-xs hover:bg-[#1A5A35]"
                  >
                    Generate Test Order
                  </button>
                </div>
              ) : (
                filteredOrders.map((o) => {
                  const isSelected = selectedOrder?.id === o.id;
                  const isPaid = o.paymentStatus === 'Paid';
                  return (
                    <div
                      key={o.id}
                      onClick={() => setSelectedOrder(o)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#F5EFEB] border-[#124328] shadow-xs'
                          : 'bg-white border-[#124328]/10 hover:border-[#E0980B]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#124328]">
                          {o.orderNumber || o.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isPaid
                              ? 'bg-[#1C602A]/10 text-[#1C602A]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="font-semibold text-[#132218]">
                          {o.customer?.fullName || o.shippingAddress?.fullName}
                        </span>
                        <span className="font-bold text-[#124328]">
                          ₹{o.totalAmount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#132218]/60 mt-1">
                        <span>{o.items?.length || 0} items</span>
                        <span className="text-[#1C602A] font-medium">{o.fulfilmentStatus}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Order Detail & State Editor */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="bg-white p-6 rounded-2xl border border-[#124328]/10 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#124328]/10 pb-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#132218]/60">
                      Order Reference
                    </div>
                    <h2 className="font-serif text-xl font-bold text-[#124328]">
                      {selectedOrder.orderNumber}
                    </h2>
                    <div className="text-[11px] text-[#132218]/50 mt-0.5">
                      Internal ID: {selectedOrder.id} • Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wider text-[#132218]/60">
                      Total Payable
                    </div>
                    <div className="font-serif text-2xl font-bold text-[#124328]">
                      ₹{selectedOrder.totalAmount}
                    </div>
                  </div>
                </div>

                {/* Customer & Address Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F5EFEB]/60 p-4 rounded-xl">
                  <div className="space-y-1">
                    <div className="font-bold text-[#124328]">Customer Information</div>
                    <div>Name: {selectedOrder.customer?.fullName || selectedOrder.shippingAddress?.fullName}</div>
                    <div>Email: {selectedOrder.customer?.email || selectedOrder.shippingAddress?.email}</div>
                    <div>Phone: +91 {selectedOrder.customer?.phone || selectedOrder.shippingAddress?.phone}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-[#124328]">Shipping Address</div>
                    <div>{selectedOrder.shippingAddress?.addressLine1}</div>
                    <div>
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} — {selectedOrder.shippingAddress?.pinCode}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <div className="font-serif text-sm font-bold text-[#124328]">
                    Ordered Items ({selectedOrder.items?.length})
                  </div>
                  <div className="divide-y divide-[#124328]/10 border border-[#124328]/10 rounded-xl overflow-hidden text-xs">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#124328]">{item.name}</div>
                          <div className="text-[11px] text-[#132218]/60">
                            {item.packSize} • SKU: {item.sku || 'N/A'} • Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="font-bold text-[#124328]">₹{item.totalPrice || item.unitPrice * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fulfilment State Controls */}
                <div className="p-5 rounded-xl bg-[#F5EFEB] border border-[#124328]/15 space-y-4">
                  <div className="font-serif text-sm font-bold text-[#124328] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#E0980B]" />
                    <span>Fulfilment & Tracking Update</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#124328] block mb-1">
                        Fulfilment State
                      </label>
                      <select
                        value={updateFulfilmentStatus}
                        onChange={(e) => setUpdateFulfilmentStatus(e.target.value)}
                        className="w-full text-xs p-2 rounded border border-[#124328]/20 bg-white"
                      >
                        <option value="Order Received">Order Received</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing in Facility</option>
                        <option value="Packed">Packed / Ready</option>
                        <option value="Shipped">Shipped / Dispatched</option>
                        <option value="Delivered">Delivered Successfully</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#124328] block mb-1">
                        Courier Partner
                      </label>
                      <input
                        type="text"
                        value={updateCourierPartner}
                        onChange={(e) => setUpdateCourierPartner(e.target.value)}
                        placeholder="e.g. Delhivery, BlueDart"
                        className="w-full text-xs p-2 rounded border border-[#124328]/20 bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#124328] block mb-1">
                        Tracking Number (AWB)
                      </label>
                      <input
                        type="text"
                        value={updateTrackingNumber}
                        onChange={(e) => setUpdateTrackingNumber(e.target.value)}
                        placeholder="e.g. DEL-IND-9281729"
                        className="w-full text-xs p-2 rounded border border-[#124328]/20 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#124328] block mb-1">
                      Internal Dispatch Notes
                    </label>
                    <input
                      type="text"
                      value={updateInternalNotes}
                      onChange={(e) => setUpdateInternalNotes(e.target.value)}
                      placeholder="e.g. Batch #492 glass jar packed with bubble insulation."
                      className="w-full text-xs p-2 rounded border border-[#124328]/20 bg-white"
                    />
                  </div>

                  {updateMessage && (
                    <div className="p-2.5 rounded bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>{updateMessage}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSaveOrderStatus}
                    disabled={isUpdatingOrder}
                    className="px-5 py-2.5 rounded-lg bg-[#124328] text-[#FBF9F4] text-xs font-semibold uppercase tracking-wider hover:bg-[#1A5A35] transition-colors cursor-pointer"
                  >
                    {isUpdatingOrder ? 'Saving...' : 'Save Fulfilment Update'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#124328]/10 text-xs text-[#132218]/60">
                Select an order from the list to view its complete audit record and update fulfilment.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: TEST ORDER GENERATOR (Safe Sandbox Simulation)      */}
      {/* ========================================================= */}
      {activeTab === 'test_generator' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#124328]/10 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1C602A]/10 flex items-center justify-center text-[#1C602A]">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#124328]">
                  Safe Test Order Generator
                </h2>
                <p className="text-xs text-[#132218]/70">
                  Allows store administrators to execute full-flow checkout testing without live credit cards or live banking credentials.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F5EFEB] text-xs space-y-2 text-[#132218]/80">
              <div className="font-bold text-[#124328]">What This Generator Does:</div>
              <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                <li>Creates a clearly labelled, non-commercial sandbox order with neutral test values.</li>
                <li>Simulates Payment Gateway Authorization with a valid server HMAC-SHA256 signature.</li>
                <li>Marks the order as <strong className="text-[#1C602A]">Paid / Confirmed</strong> and commits stock reservation.</li>
                <li>Generates transactional confirmation email in the development email sandbox.</li>
                <li>Populates the Orders list for testing tracking number entry and packaging workflow.</li>
              </ul>
            </div>

            <button
              onClick={handleGenerateTestOrder}
              disabled={isGeneratingTestOrder}
              className="w-full py-3.5 px-4 rounded-xl bg-[#124328] text-[#FBF9F4] font-semibold text-xs uppercase tracking-wider hover:bg-[#1A5A35] transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingTestOrder ? (
                <span>Generating Test Order...</span>
              ) : (
                <span>Generate Test Order (Simulated Full Checkout)</span>
              )}
            </button>

            {testOrderResult && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Test Order {testOrderResult.orderNumber} Generated Successfully!</span>
                </div>
                <p className="text-[11px]">
                  The order is now visible in the <strong>Orders & Fulfilment</strong> tab. You can test marking it as Shipped, entering a tracking AWB number, or previewing the generated transactional confirmation email.
                </p>
                <button
                  onClick={() => {
                    setSelectedOrder(testOrderResult);
                    setActiveTab('orders');
                  }}
                  className="px-3 py-1.5 rounded bg-emerald-700 text-white text-[11px] font-semibold hover:bg-emerald-800 cursor-pointer"
                >
                  View in Orders Tab
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: TRANSACTIONAL EMAIL PREVIEWS                       */}
      {/* ========================================================= */}
      {activeTab === 'emails' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Template Picker */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold text-[#124328] uppercase tracking-wider mb-2">
              All 10 Transactional Templates
            </div>
            {[
              { id: 'order_received', label: '1. Order Received' },
              { id: 'payment_confirmed', label: '2. Payment Confirmed & Tax Invoice' },
              { id: 'payment_failed', label: '3. Payment Failed / Recovery' },
              { id: 'order_confirmed', label: '4. Order Under Preparation' },
              { id: 'order_shipped', label: '5. Order Dispatched (with AWB)' },
              { id: 'order_delivered', label: '6. Delivered Successfully' },
              { id: 'order_cancelled', label: '7. Order Cancelled' },
              { id: 'refund_initiated', label: '8. Refund Initiated' },
              { id: 'refund_completed', label: '9. Refund Completed' },
              { id: 'coming_soon_available', label: '10. Coming Soon Restock Alert' },
            ].map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  setSelectedEmailTemplate(tmpl.id);
                  loadEmailTemplate(tmpl.id);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedEmailTemplate === tmpl.id
                    ? 'bg-[#124328] text-white shadow-xs'
                    : 'bg-white text-[#132218]/80 border border-[#124328]/10 hover:bg-[#F5EFEB]'
                }`}
              >
                <span>{tmpl.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>

          {/* Email Live Preview */}
          <div className="lg:col-span-8 bg-white p-4 rounded-2xl border border-[#124328]/10 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#124328]/10">
              <div className="text-xs font-bold text-[#124328]">
                Template Sandbox Preview: <span className="font-mono">{selectedEmailTemplate}</span>
              </div>
              <span className="text-[11px] text-[#132218]/60">
                Rendered with official typography & Katehranchal brand assets
              </span>
            </div>

            {isLoadingEmail ? (
              <div className="p-20 text-center text-xs text-[#132218]/60">
                Loading email template...
              </div>
            ) : (
              <div className="border border-[#124328]/10 rounded-xl overflow-hidden bg-[#FBF9F4] p-4 min-h-[500px]">
                <iframe
                  title="Email Preview"
                  srcDoc={emailPreviewHtml}
                  className="w-full h-[650px] border-0 rounded bg-white shadow-xs"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: COMING SOON ALERT SUBSCRIBERS                      */}
      {/* ========================================================= */}
      {activeTab === 'subscribers' && (
        <div className="bg-white p-6 rounded-2xl border border-[#124328]/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#124328]/10 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#124328]">
                Coming Soon Restock Alert Subscribers ({subscribers.length})
              </h2>
              <p className="text-xs text-[#132218]/70">
                Customers who opted in to receive notifications when seasonal harvests and unreleased products are harvested.
              </p>
            </div>
            <button
              onClick={loadSubscribers}
              className="flex items-center gap-1.5 text-xs text-[#124328] font-semibold hover:text-[#E0980B]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {subscribers.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#132218]/60">
              No alert subscriptions recorded yet. Customers can register on the "Coming Soon" page or product detail pages.
            </div>
          ) : (
            <div className="divide-y divide-[#124328]/10 border border-[#124328]/10 rounded-xl overflow-hidden text-xs">
              <div className="p-3 bg-[#F5EFEB] font-bold text-[#124328] grid grid-cols-12">
                <div className="col-span-4">Subscriber Email</div>
                <div className="col-span-4">Product Interest</div>
                <div className="col-span-4 text-right">Registered On</div>
              </div>
              {subscribers.map((sub: any, idx: number) => (
                <div key={idx} className="p-3 grid grid-cols-12 items-center hover:bg-[#FBF9F4]">
                  <div className="col-span-4 font-semibold text-[#124328]">{sub.email}</div>
                  <div className="col-span-4 text-[#132218]/80">{sub.itemName}</div>
                  <div className="col-span-4 text-right text-[11px] text-[#132218]/60">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: SECURITY AUDIT LOGS                                */}
      {/* ========================================================= */}
      {activeTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-[#124328]/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#124328]/10 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#124328]">
                Cryptographic Security & System Audit Logs ({auditLogs.length})
              </h2>
              <p className="text-xs text-[#132218]/70">
                Server-side audit trail tracking order creations, HMAC signature checks, webhook deliveries, and inventory changes.
              </p>
            </div>
            <button
              onClick={loadAuditLogs}
              className="flex items-center gap-1.5 text-xs text-[#124328] font-semibold hover:text-[#E0980B]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {auditLogs.map((log: any, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-[#124328]/10 bg-[#FBF9F4] text-xs space-y-1 font-mono"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#124328]">{log.action}</span>
                  <span className="text-[#132218]/50">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-[#132218]/80 font-sans text-xs">{log.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: ASSET & COPYRIGHT GOVERNANCE REGISTER              */}
      {/* ========================================================= */}
      {activeTab === 'assets' && (
        <div className="bg-white p-6 rounded-2xl border border-[#124328]/10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#124328]/10 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#124328]">
                Asset & Copyright Governance Register ({ASSET_REGISTER.length} Tracked Assets)
              </h2>
              <p className="text-xs text-[#132218]/70">
                Official IP audit log tracking file origins, licenses, prompts, human reviewers, and launch approval status.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1C602A]/10 text-[#1C602A] border border-[#1C602A]/20">
                Verified Clean Rights
              </span>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="p-4 rounded-xl bg-[#F5EFEB] border border-[#124328]/15 text-xs text-[#132218]/80 space-y-1">
            <div className="font-bold text-[#124328] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1C602A]" />
              <span>Commercial IP Safeguard Mandate</span>
            </div>
            <p>
              Every visual asset used across Katehranchal Agro Foods is tracked below. All editorial artwork adheres strictly to the brand palette and editorial vector direction. Under our strict policy, any asset with unverified rights or pending physical photography is explicitly flagged before live e-commerce launch.
            </p>
          </div>

          {/* Table of Assets */}
          <div className="border border-[#124328]/10 rounded-xl overflow-hidden shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[800px]">
              <thead className="bg-[#FAF7F2] text-[#124328] border-b border-[#124328]/10">
                <tr>
                  <th className="p-3 font-semibold">Asset / Filename</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Source & Tool/Model</th>
                  <th className="p-3 font-semibold">License Basis</th>
                  <th className="p-3 font-semibold">Approval Status</th>
                  <th className="p-3 font-semibold">Reviewer & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#124328]/5">
                {ASSET_REGISTER.map((asset) => (
                  <tr key={asset.id} className="hover:bg-[#FAF7F2]/50">
                    <td className="p-3 align-top">
                      <div className="font-bold text-[#124328]">{asset.filename}</div>
                      <div className="text-[11px] text-[#132218]/60 mt-0.5">
                        Locations: {asset.websiteLocation.join(', ')}
                      </div>
                      <div className="text-[10px] text-[#E0980B] font-mono mt-1">
                        Ref: {asset.proofOfPurchaseOrDocRef}
                      </div>
                    </td>
                    <td className="p-3 align-top">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#124328]/10 text-[#124328] uppercase">
                        {asset.assetType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 align-top space-y-1">
                      <div className="text-[#132218]/90 font-medium">{asset.source}</div>
                      <div className="text-[11px] text-[#132218]/60">{asset.toolOrModelUsed}</div>
                      {asset.generationPrompt && (
                        <div className="p-2 rounded bg-white border border-[#124328]/10 text-[10px] text-[#132218]/70 italic mt-1 max-w-xs">
                          &ldquo;{asset.generationPrompt.slice(0, 100)}...&rdquo;
                        </div>
                      )}
                    </td>
                    <td className="p-3 align-top text-xs text-[#132218]/80 max-w-xs">
                      {asset.licenseOrUsageBasis}
                    </td>
                    <td className="p-3 align-top">
                      {asset.approvalStatus === 'approved_for_launch' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1C602A]/10 text-[#1C602A] border border-[#1C602A]/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved for Launch
                        </span>
                      )}
                      {asset.approvalStatus === 'approved_editorial_only' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          Editorial Decorative
                        </span>
                      )}
                      {asset.approvalStatus === 'pending_owner_photo' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3 h-3" />
                          Pending Owner Photo
                        </span>
                      )}
                    </td>
                    <td className="p-3 align-top text-xs space-y-1 max-w-xs">
                      <div className="font-semibold text-[#124328]">{asset.humanReviewer}</div>
                      <div className="text-[11px] text-[#132218]/70">{asset.rightsNotes}</div>
                      {asset.modificationNotes && (
                        <div className="text-[10px] text-[#132218]/50 italic">{asset.modificationNotes}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
