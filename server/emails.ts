import { ServerOrder, EmailTemplatePayload } from './types';

const BRAND_NAME = 'Katehranchal Agro Foods';
const PARENT_GROUP = 'Part of Katehranchal Group';
const OFFICIAL_EMAIL = 'agro@Katehranchal.org';
const SUPPORT_PHONE = '+91 94500 39346';
const WEBSITE_URL = 'https://Katehranchal.org';
const LOGO_URL = 'https://Katehranchal.org/assets/katehranchal-agro-foods-logo.png';

/**
 * Base email layout wrapper with Fraunces & Manrope fallback styling
 * and compliant branding.
 */
function wrapEmailTemplate(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F5EFEB; font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #132218; }
    .email-container { max-width: 600px; margin: 30px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E8DFD8; }
    .email-header { background-color: #124328; padding: 32px 24px; text-align: center; color: #FBF9F4; }
    .logo-img { width: 90px; height: auto; margin-bottom: 12px; }
    .brand-title { font-family: 'Fraunces', Georgia, serif; font-size: 22px; font-weight: 600; color: #FBF9F4; margin: 0; letter-spacing: 0.5px; }
    .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #E0980B; margin-top: 4px; font-weight: 600; }
    .email-body { padding: 32px 28px; line-height: 1.6; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .badge-info { background-color: #F5EFEB; color: #124328; border: 1px solid #D8CFC8; }
    .badge-success { background-color: #E8F3EB; color: #1C602A; }
    .badge-alert { background-color: #FDE8E8; color: #9B1C1C; }
    .order-box { background-color: #FBF9F4; border: 1px solid #E8DFD8; border-radius: 10px; padding: 18px; margin: 20px 0; }
    .table-summary { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    .table-summary th { text-align: left; padding: 8px 4px; color: #666; border-bottom: 1px solid #E8DFD8; }
    .table-summary td { padding: 10px 4px; border-bottom: 1px solid #F0ECE7; }
    .total-row td { font-weight: bold; color: #124328; font-size: 15px; border-top: 1px solid #124328; border-bottom: none; }
    .btn-action { display: inline-block; padding: 12px 24px; background-color: #124328; color: #FBF9F4 !important; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 13px; margin: 20px 0; }
    .footer { background-color: #FAF7F2; padding: 24px; text-align: center; border-top: 1px solid #E8DFD8; font-size: 11px; color: #7A7A7A; line-height: 1.6; }
    .footer a { color: #124328; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="${LOGO_URL}" alt="${BRAND_NAME} Official Logo" class="logo-img" />
      <h1 class="brand-title">${BRAND_NAME}</h1>
      <div class="tagline">Traditional Village Products for Modern Homes</div>
    </div>
    <div class="email-body">
      ${bodyHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0; font-weight: 600; color: #124328;">${BRAND_NAME} • ${PARENT_GROUP}</p>
      <p style="margin: 0 0 8px 0;">Official Support: <a href="mailto:${OFFICIAL_EMAIL}">${OFFICIAL_EMAIL}</a> | Helpline: <a href="tel:${SUPPORT_PHONE.replace(/\s+/g, '')}">${SUPPORT_PHONE}</a></p>
      <p style="margin: 0;">Visit official store: <a href="${WEBSITE_URL}">${WEBSITE_URL}</a></p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 10 Branded Transactional Email Templates
 */
export const TRANSACTIONAL_EMAIL_TEMPLATES = {
  // 1. Order Received
  orderReceived: (order: ServerOrder): EmailTemplatePayload => {
    const subject = `Order Acknowledged: ${order.orderNumber}`;
    const html = wrapEmailTemplate(
      subject,
      `
      <span class="badge badge-info">Order Received</span>
      <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #124328; margin: 12px 0 8px 0;">Thank You for Your Order</h2>
      <p>Hello ${order.customer.fullName},</p>
      <p>We have successfully received your order request for traditional staples from Katehranchal Agro Foods. Your order is registered under reference <strong>${order.orderNumber}</strong>.</p>
      <div class="order-box">
        <strong>Order Summary (${order.orderNumber})</strong>
        <p style="margin: 4px 0 10px 0; font-size: 12px; color: #666;">Placed on: ${new Date(order.createdAt).toLocaleString('en-IN')}</p>
        <table class="table-summary">
          <thead>
            <tr><th>Item</th><th style="text-align: center;">Qty</th><th style="text-align: right;">Amount</th></tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (i) => `<tr>
                  <td>${i.name} (${i.packSize})</td>
                  <td style="text-align: center;">${i.quantity}</td>
                  <td style="text-align: right;">₹${i.totalPrice}</td>
                </tr>`
              )
              .join('')}
            <tr class="total-row">
              <td colspan="2">Order Total:</td>
              <td style="text-align: right;">₹${order.totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><strong>Shipping Address:</strong><br>${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pinCode}</p>
      <p>Our team verifies all batch registrations before dispatch. You will receive updates as your order progresses.</p>
      `
    );
    return {
      templateId: 'order_received',
      recipientEmail: order.customer.email,
      recipientName: order.customer.fullName,
      orderNumber: order.orderNumber,
      subject,
      htmlContent: html,
      textContent: `Thank you for your order with Katehranchal Agro Foods. Reference: ${order.orderNumber}. Order total: ₹${order.totalAmount}. Contact: ${OFFICIAL_EMAIL}`,
    };
  },

  // 2. Payment Confirmed
  paymentConfirmed: (order: ServerOrder): EmailTemplatePayload => {
    const subject = `Payment Confirmed for Order ${order.orderNumber}`;
    const html = wrapEmailTemplate(
      subject,
      `
      <span class="badge badge-success">Payment Confirmed</span>
      <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #124328; margin: 12px 0 8px 0;">Payment Successfully Verified</h2>
      <p>Hello ${order.customer.fullName},</p>
      <p>Your payment of <strong>₹${order.totalAmount}</strong> for order <strong>${order.orderNumber}</strong> has been securely verified on our server via authorized payment gateway protocols.</p>
      <div class="order-box">
        <strong>Transaction Reference:</strong> ${order.gatewayPaymentId || 'Verified Online Transaction'}<br>
        <strong>Payment Gateway:</strong> ${order.paymentProvider.toUpperCase()}<br>
        <strong>Status:</strong> Paid & Verified
      </div>
      <p>Your items are now allocated and advancing to packing in tamper-evident food-grade materials.</p>
      `
    );
    return {
      templateId: 'payment_confirmed',
      recipientEmail: order.customer.email,
      recipientName: order.customer.fullName,
      orderNumber: order.orderNumber,
      subject,
      htmlContent: html,
      textContent: `Payment of ₹${order.totalAmount} for Order ${order.orderNumber} verified. Support: ${OFFICIAL_EMAIL}`,
    };
  },

  // 3. Payment Failed
  paymentFailed: (order: ServerOrder): EmailTemplatePayload => {
    const subject = `Payment Update regarding Order ${order.orderNumber}`;
    const html = wrapEmailTemplate(
      subject,
      `
      <span class="badge badge-alert">Payment Unsuccessful</span>
      <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #9B1C1C; margin: 12px 0 8px 0;">Payment Verification Failed</h2>
      <p>Hello ${order.customer.fullName},</p>
      <p>The payment attempt for order <strong>${order.orderNumber}</strong> was not completed or could not be verified by your issuing banking authority.</p>
      <div class="order-box">
        <p style="margin: 0; font-size: 13px;">No funds were captured by Katehranchal Agro Foods. If your account was debited, your bank typically reconciles the transaction within 3 to 5 business days.</p>
      </div>
      <p>You can reattempt checkout safely through our website or connect with our support desk if you need assistance.</p>
      `
    );
    return {
      templateId: 'payment_failed',
      recipientEmail: order.customer.email,
      recipientName: order.customer.fullName,
      orderNumber: order.orderNumber,
      subject,
      htmlContent: html,
      textContent: `Payment for order ${order.orderNumber} was not completed. Support: ${OFFICIAL_EMAIL}`,
    };
  },

  // 4. Order Confirmed
  orderConfirmed: (order: ServerOrder): EmailTemplatePayload => {
    const subject = `Order Confirmed: ${order.orderNumber}`;
    const html = wrapEmailTemplate(
      subject,
      `
      <span class="badge badge-success">Order Confirmed</span>
      <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #124328; margin: 12px 0 8px 0;">Your Order is Confirmed</h2>
      <p>Hello ${order.customer.fullName},</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been officially confirmed by our fulfillment team. We are preparing your traditional items according to stringent hygiene and packaging standards.</p>
      `
    );
    return {
      templateId: 'order_confirmed',
      recipientEmail: order.customer.email,
      recipientName: order.customer.fullName,
      orderNumber: order.orderNumber,
      subject,
      htmlContent: html,
      textContent: `Order ${order.orderNumber} confirmed by Katehranchal Agro Foods. Support: ${OFFICIAL_EMAIL}`,
    };
  },

  // 5. Order Shipped
  orderShipped: (order: ServerOrder): EmailTemplatePayload => {
    const subject = `Dispatch Update: Order ${order.orderNumber}`;
    const html = wrapEmailTemplate(
      subject,
      `
      <span class="badge badge-info">Dispatched</span>
      <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #124328; margin: 12px 0 8px 0;">Your Parcel is on the Way</h2>
      <p>Hello ${order.customer.fullName},</p>
      <p>Your package has been securely sealed and handed over to our courier partner.</p>
      <div class="order-box">
        <strong>Courier Partner:</strong> ${order.courierPartner || 'Assigned Courier Service'}<br>
        <strong>Tracking Reference:</strong> ${order.trackingNumber || 'Tracking ID will update upon carrier scan'}
      </div>
      <p>Delivery Address: ${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.pinCode}</p>
      `
    );
    return {
      templateId: 'order_shipped',
      recipientEmail: order.customer.email,
      recipientName: order.customer.fullName,
      orderNumber: order.orderNumber,
      subject,
      htmlContent: html,
      textContent: `Order ${order.orderNumber} dispatched. Tracking: ${order.trackingNumber || 'Pending scan'}. Support: ${OFFICIAL_EMAIL}`,
    };
  },

  // 6. Order Delivered
  orderDelivered: (order: ServerOrder): EmailTemplatePayload => {
    const subject = `Delivered: Order ${order.orderNumber}`;
    const html = wrapEmailTemplate(
      subject,
      `
      <span class="badge badge-success">Delivered</span>
      <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #124328; margin: 12px 0 8px 0;">Delivered to Your Doorstep</h2>
      <p>Hello ${order.customer.fullName},</p>
      <p>Your Katehranchal Agro Foods parcel for order <strong>${order.orderNumber}</strong> has been marked as delivered by the courier partner.</p>
      <p>We hope you and your family enjoy the authentic rural quality of your traditional food staples. Please inspect the seal upon receiving.</p>
      `
    );
    return {
      templateId: 'order_delivered',
      recipientEmail: order.customer.email,
      recipientName: order.customer.fullName,
      orderNumber: order.orderNumber,
      subject,
      htmlContent: html,
      textContent: `Order ${order.orderNumber} has been delivered. Thank you from Katehranchal Agro Foods. Support: ${OFFICIAL_EMAIL}`,
    };
  },

  // 7. Order Cancelled
  orderCancelled: (order: ServerOrder): EmailTemplatePayload => {
    const subject = `Order Cancellation: ${order.orderNumber}`;
    const html = wrapEmailTemplate(
      subject,
      `
      <span class="badge badge-alert">Order Cancelled</span>
      <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #9B1C1C; margin: 12px 0 8px 0;">Order Cancellation Notice</h2>
      <p>Hello ${order.customer.fullName},</p>
      <p>Your order reference <strong>${order.orderNumber}</strong> has been cancelled. Any reserved stock inventory has been safely restored.</p>
      `
    );
    return {
      templateId: 'order_cancelled',
      recipientEmail: order.customer.email,
      recipientName: order.customer.fullName,
      orderNumber: order.orderNumber,
      subject,
      htmlContent: html,
      textContent: `Order ${order.orderNumber} was cancelled. Support: ${OFFICIAL_EMAIL}`,
    };
  },

  // 8. Refund Initiated
  refundInitiated: (order: ServerOrder, amount: number): EmailTemplatePayload => {
    const subject = `Refund Initiated for Order ${order.orderNumber}`;
    const html = wrapEmailTemplate(
      subject,
      `
      <span class="badge badge-info">Refund Initiated</span>
      <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #124328; margin: 12px 0 8px 0;">Refund Processing</h2>
      <p>Hello ${order.customer.fullName},</p>
      <p>A refund of <strong>₹${amount}</strong> for order <strong>${order.orderNumber}</strong> has been initiated back to your original source of payment.</p>
      <p>Standard bank turnaround times under RBI guidelines typically range from 5 to 7 working days.</p>
      `
    );
    return {
      templateId: 'refund_initiated',
      recipientEmail: order.customer.email,
      recipientName: order.customer.fullName,
      orderNumber: order.orderNumber,
      subject,
      htmlContent: html,
      textContent: `Refund of ₹${amount} initiated for order ${order.orderNumber}. Support: ${OFFICIAL_EMAIL}`,
    };
  },

  // 9. Refund Completed
  refundCompleted: (order: ServerOrder, amount: number): EmailTemplatePayload => {
    const subject = `Refund Completed: Order ${order.orderNumber}`;
    const html = wrapEmailTemplate(
      subject,
      `
      <span class="badge badge-success">Refund Completed</span>
      <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #124328; margin: 12px 0 8px 0;">Refund Settled</h2>
      <p>Hello ${order.customer.fullName},</p>
      <p>The refund amount of <strong>₹${amount}</strong> for order <strong>${order.orderNumber}</strong> has been successfully credited by our payment gateway provider.</p>
      `
    );
    return {
      templateId: 'refund_completed',
      recipientEmail: order.customer.email,
      recipientName: order.customer.fullName,
      orderNumber: order.orderNumber,
      subject,
      htmlContent: html,
      textContent: `Refund of ₹${amount} completed for order ${order.orderNumber}. Support: ${OFFICIAL_EMAIL}`,
    };
  },

  // 10. Customer Support Acknowledgement
  supportAcknowledgement: (name: string, email: string, enquirySubject: string): EmailTemplatePayload => {
    const subject = `Support Inquiry Acknowledged: ${enquirySubject}`;
    const html = wrapEmailTemplate(
      subject,
      `
      <span class="badge badge-info">Support Request</span>
      <h2 style="font-family: 'Fraunces', Georgia, serif; font-size: 20px; color: #124328; margin: 12px 0 8px 0;">We Have Received Your Message</h2>
      <p>Hello ${name},</p>
      <p>Thank you for reaching out to Katehranchal Agro Foods. Our customer support desk has received your inquiry regarding "<strong>${enquirySubject}</strong>".</p>
      <p>Our team reviews inquiries promptly during standard working hours. You can also connect with us directly via WhatsApp at ${SUPPORT_PHONE}.</p>
      `
    );
    return {
      templateId: 'support_acknowledgement',
      recipientEmail: email,
      recipientName: name,
      subject,
      htmlContent: html,
      textContent: `Thank you for contacting Katehranchal Agro Foods. We have received your inquiry: ${enquirySubject}. Support: ${OFFICIAL_EMAIL}`,
    };
  },
};
