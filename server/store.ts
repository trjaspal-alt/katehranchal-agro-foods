import fs from 'fs';
import path from 'path';
import { ServerOrder, OrderAuditLog } from './types';

interface StoreData {
  orders: ServerOrder[];
  processedWebhookIds: string[];
  inventoryOverrides: Record<string, number>; // variationId -> stock quantity
  notificationSubscriptions: {
    id: string;
    email: string;
    itemId: string;
    itemName: string;
    subscribedAt: string;
  }[];
  auditLogs: {
    id: string;
    timestamp: string;
    category: string;
    message: string;
    meta?: any;
  }[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

class ServerStore {
  private data: StoreData = {
    orders: [],
    processedWebhookIds: [],
    inventoryOverrides: {},
    notificationSubscriptions: [],
    auditLogs: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.warn('[ServerStore] Using in-memory store due to file access error:', err);
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[ServerStore] Failed to write store to disk:', err);
    }
  }

  // --- Orders ---
  public getOrders(): ServerOrder[] {
    return this.data.orders;
  }

  public getOrderById(id: string): ServerOrder | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public saveOrder(order: ServerOrder): ServerOrder {
    const idx = this.data.orders.findIndex((o) => o.id === order.id);
    if (idx >= 0) {
      this.data.orders[idx] = { ...order, updatedAt: new Date().toISOString() };
    } else {
      this.data.orders.unshift(order);
    }
    this.save();
    return order;
  }

  public updateOrderStatus(
    orderId: string,
    updates: {
      paymentStatus?: ServerOrder['paymentStatus'];
      fulfilmentStatus?: ServerOrder['fulfilmentStatus'];
      trackingNumber?: string;
      courierPartner?: string;
      internalNotes?: string;
      gatewayPaymentId?: string;
      note?: string;
    }
  ): ServerOrder | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    if (updates.paymentStatus) order.paymentStatus = updates.paymentStatus;
    if (updates.fulfilmentStatus) order.fulfilmentStatus = updates.fulfilmentStatus;
    if (updates.trackingNumber !== undefined) order.trackingNumber = updates.trackingNumber;
    if (updates.courierPartner !== undefined) order.courierPartner = updates.courierPartner;
    if (updates.internalNotes !== undefined) order.internalNotes = updates.internalNotes;
    if (updates.gatewayPaymentId !== undefined) order.gatewayPaymentId = updates.gatewayPaymentId;

    if (updates.note) {
      order.history.push({
        timestamp: new Date().toISOString(),
        status: `${order.paymentStatus} / ${order.fulfilmentStatus}`,
        note: updates.note,
      });
    }

    order.updatedAt = new Date().toISOString();
    this.save();
    return order;
  }

  // --- Webhook Idempotency ---
  public isWebhookProcessed(eventOrPaymentId: string): boolean {
    return this.data.processedWebhookIds.includes(eventOrPaymentId);
  }

  public markWebhookProcessed(eventOrPaymentId: string): void {
    if (!this.data.processedWebhookIds.includes(eventOrPaymentId)) {
      this.data.processedWebhookIds.push(eventOrPaymentId);
      // Keep last 1000 webhook IDs
      if (this.data.processedWebhookIds.length > 1000) {
        this.data.processedWebhookIds.shift();
      }
      this.save();
    }
  }

  // --- Inventory Overrides ---
  public getInventoryOverride(variationId: string): number | undefined {
    return this.data.inventoryOverrides[variationId];
  }

  public setInventoryOverride(variationId: string, quantity: number): void {
    this.data.inventoryOverrides[variationId] = quantity;
    this.save();
  }

  // --- Subscriptions ---
  public getSubscriptions() {
    return this.data.notificationSubscriptions;
  }

  public addSubscription(sub: { email: string; itemId: string; itemName: string }) {
    const existing = this.data.notificationSubscriptions.find(
      (s) => s.email.toLowerCase() === sub.email.toLowerCase() && s.itemId === sub.itemId
    );
    if (!existing) {
      this.data.notificationSubscriptions.push({
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        ...sub,
        subscribedAt: new Date().toISOString(),
      });
      this.save();
    }
  }

  // --- Audit Logs ---
  public log(category: string, message: string, meta?: any) {
    this.data.auditLogs.unshift({
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      category,
      message,
      meta,
    });
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    this.save();
  }

  public getAuditLogs() {
    return this.data.auditLogs;
  }
}

export const serverStore = new ServerStore();
