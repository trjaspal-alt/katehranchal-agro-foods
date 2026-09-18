import { serverStore } from './store';

export interface StockCheckResult {
  available: boolean;
  variationId: string;
  sku: string;
  requestedQty: number;
  remainingStock: number | null;
  reason?: string;
}

export interface InventoryReservation {
  reservationId: string;
  orderId: string;
  items: { variationId: string; quantity: number }[];
  expiresAt: number; // timestamp
}

// Temporary reservations in memory: expires in 15 minutes if payment not completed
const ACTIVE_RESERVATIONS = new Map<string, InventoryReservation>();
const RESERVATION_EXPIRY_MS = 15 * 60 * 1000;

export class InventoryEngine {
  /**
   * Verifies stock availability for an item variation.
   * If stock is unconfigured / null in product data, marks as unavailable.
   */
  public checkStock(
    variationId: string,
    sku: string,
    requestedQty: number,
    baseStockQuantity: number | null,
    stockState: 'in-stock' | 'out-of-stock' | 'unspecified'
  ): StockCheckResult {
    if (requestedQty <= 0) {
      return {
        available: false,
        variationId,
        sku,
        requestedQty,
        remainingStock: null,
        reason: 'Quantity must be at least 1.',
      };
    }

    if (stockState !== 'in-stock') {
      return {
        available: false,
        variationId,
        sku,
        requestedQty,
        remainingStock: 0,
        reason: 'Product variation is currently not marked in stock.',
      };
    }

    // Check if store has an inventory override
    const override = serverStore.getInventoryOverride(variationId);
    const availableCount = override !== undefined ? override : baseStockQuantity;

    if (availableCount === null) {
      return {
        available: false,
        variationId,
        sku,
        requestedQty,
        remainingStock: null,
        reason: 'Inventory stock count is unconfigured for this batch.',
      };
    }

    // Check active reservations
    const reservedCount = this.getReservedQuantity(variationId);
    const effectiveStock = availableCount - reservedCount;

    if (effectiveStock < requestedQty) {
      return {
        available: false,
        variationId,
        sku,
        requestedQty,
        remainingStock: Math.max(0, effectiveStock),
        reason: `Requested quantity exceeds available stock (${effectiveStock} remaining).`,
      };
    }

    return {
      available: true,
      variationId,
      sku,
      requestedQty,
      remainingStock: effectiveStock,
    };
  }

  /**
   * Reserves stock temporarily while customer completes payment.
   */
  public reserveStock(orderId: string, items: { variationId: string; quantity: number }[]): string {
    const reservationId = `res_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    ACTIVE_RESERVATIONS.set(orderId, {
      reservationId,
      orderId,
      items,
      expiresAt: Date.now() + RESERVATION_EXPIRY_MS,
    });
    return reservationId;
  }

  /**
   * Releases reservation upon payment failure, cancellation, or expiry.
   */
  public releaseReservation(orderId: string): void {
    ACTIVE_RESERVATIONS.delete(orderId);
  }

  /**
   * Commits inventory deduction permanently upon verified payment confirmation.
   */
  public commitDeduction(orderId: string, items: { variationId: string; quantity: number }[]): void {
    items.forEach((item) => {
      const current = serverStore.getInventoryOverride(item.variationId);
      if (current !== undefined) {
        const next = Math.max(0, current - item.quantity);
        serverStore.setInventoryOverride(item.variationId, next);
      }
    });
    ACTIVE_RESERVATIONS.delete(orderId);
  }

  private getReservedQuantity(variationId: string): number {
    this.cleanExpiredReservations();
    let total = 0;
    ACTIVE_RESERVATIONS.forEach((res) => {
      res.items.forEach((i) => {
        if (i.variationId === variationId) {
          total += i.quantity;
        }
      });
    });
    return total;
  }

  private cleanExpiredReservations() {
    const now = Date.now();
    for (const [orderId, res] of ACTIVE_RESERVATIONS.entries()) {
      if (res.expiresAt < now) {
        ACTIVE_RESERVATIONS.delete(orderId);
      }
    }
  }
}

export const inventoryEngine = new InventoryEngine();
