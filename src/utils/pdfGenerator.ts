import { Invoice } from '../types';

/**
 * Printable Branded PDF & HTML Invoice Generator for Mohamed Hosny Clinic
 */
export function generateInvoiceHTML(invoice: Invoice): string {
  const itemsRows = invoice.items
    .map(
      (item, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 12px; font-size: 14px; color: #334155;">${idx + 1}</td>
      <td style="padding: 12px; font-size: 14px; font-weight: 500; color: #0f172a;">${item.description}</td>
      <td style="padding: 12px; font-size: 14px; text-align: center; color: #334155;">${item.quantity}</td>
      <td style="padding: 12px; font-size: 14px; text-align: right; font-family: monospace; color: #334155;">EGP ${item.unit_price.toFixed(2)}</td>
      <td style="padding: 12px; font-size: 14px; text-align: right; font-family: monospace; font-weight: 600; color: #0284c7;">EGP ${item.total_price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoice.invoice_number} - Mohamed Hosny Clinic</title>
      <style>
        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background: #fff; color: #0f172a; margin: 0; padding: 40px; }
        .invoice-card { max-width: 800px; margin: 0 auto; border: 1px solid #cbd5e1; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 24px; margin-bottom: 30px; }
        .brand-title { font-size: 26px; font-weight: 800; color: #0284c7; letter-spacing: -0.5px; margin: 0; }
        .brand-subtitle { font-size: 13px; color: #64748b; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .invoice-title { font-size: 28px; font-weight: 800; color: #0f172a; text-align: right; margin: 0; }
        .invoice-meta { font-size: 13px; color: #475569; text-align: right; margin-top: 6px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-box { background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .info-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700; margin-bottom: 6px; }
        .info-content { font-size: 15px; font-weight: 600; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; }
        .totals-table { width: 320px; margin-left: auto; border-collapse: collapse; }
        .totals-table td { padding: 8px 12px; font-size: 14px; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: 700; font-size: 13px; text-transform: uppercase; }
        .status-Paid { background: #dcfce7; color: #166534; }
        .status-Partially { background: #fef9c3; color: #854d0e; }
        .status-Overdue { background: #fee2e2; color: #991b1b; }
        .status-Draft { background: #f1f5f9; color: #475569; }
        .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="invoice-card">
        <div class="header">
          <div>
            <h1 class="brand-title">MOHAMED HOSNY CLINIC</h1>
            <div class="brand-subtitle">Enterprise Healthcare & Diagnostic Center</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
              Building 14, Cairo Medical District, Egypt<br/>
              Direct Line: +20 2 2790 0000 | info@hosnyclinic.com
            </div>
          </div>
          <div>
            <h2 class="invoice-title">INVOICE</h2>
            <div class="invoice-meta">
              <strong>Invoice #:</strong> ${invoice.invoice_number}<br/>
              <strong>Date:</strong> ${invoice.created_at.split('T')[0]}<br/>
              <strong>Due Date:</strong> ${invoice.due_date}
            </div>
            <div style="text-align: right; margin-top: 12px;">
              <span class="status-badge status-${invoice.payment_status.split(' ')[0]}">${invoice.payment_status}</span>
            </div>
          </div>
        </div>

        <div class="details-grid">
          <div class="info-box">
            <div class="info-title">Billed To Patient</div>
            <div class="info-content">${invoice.patient_name}</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Patient ID: ${invoice.patient_id}</div>
            <div style="font-size: 13px; color: #64748b;">Payment Method: <strong>${invoice.payment_method}</strong></div>
          </div>
          <div class="info-box">
            <div class="info-title">Issuing Authority</div>
            <div class="info-content">Mohamed Hosny Clinic - Financial Billing Dept</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Attending Physician: Dr. Mohamed Hosny</div>
            <div style="font-size: 13px; color: #64748b;">Tax ID: 489-201-992</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th style="width: 50%;">Description / Service</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 15%; text-align: right;">Unit Price</th>
              <th style="width: 15%; text-align: right;">Total Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td style="color: #64748b;">Subtotal:</td>
            <td style="text-align: right; font-family: monospace;">EGP ${invoice.subtotal.toFixed(2)}</td>
          </tr>
          ${
            invoice.discount > 0
              ? `<tr><td style="color: #166534;">Discount Applied:</td><td style="text-align: right; font-family: monospace; color: #166534;">- EGP ${invoice.discount.toFixed(2)}</td></tr>`
              : ''
          }
          <tr style="border-top: 2px solid #0f172a; font-weight: 800; font-size: 16px;">
            <td style="padding-top: 12px; color: #0f172a;">Total Amount:</td>
            <td style="padding-top: 12px; text-align: right; font-family: monospace; color: #0284c7;">EGP ${invoice.total_amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="color: #166534; font-weight: 600;">Amount Paid:</td>
            <td style="text-align: right; font-family: monospace; font-weight: 700; color: #166534;">EGP ${invoice.paid_amount.toFixed(2)}</td>
          </tr>
          ${
            invoice.total_amount - invoice.paid_amount > 0
              ? `<tr style="font-weight: 700; color: #991b1b;"><td style="padding-top: 6px;">Balance Due:</td><td style="padding-top: 6px; text-align: right; font-family: monospace;">EGP ${(invoice.total_amount - invoice.paid_amount).toFixed(2)}</td></tr>`
              : ''
          }
        </table>

        <div class="footer">
          <div>
            Thank you for choosing Mohamed Hosny Clinic.<br/>
            This is a computer-generated official billing record.
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 20px;">Authorized Signature</div>
            <div style="border-bottom: 1px dashed #94a3b8; width: 180px; margin-left: auto;"></div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Dr. Mohamed Hosny Clinic Accounts</div>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;
}

export function printInvoice(invoice: Invoice) {
  const htmlContent = generateInvoiceHTML(invoice);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
