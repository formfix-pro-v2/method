"use client";

export default function PrintButton({
  targetId,
  label = "Print / Save PDF",
}: {
  targetId: string;
  label?: string;
}) {
  function handlePrint() {
    const content = document.getElementById(targetId);
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Veronica Method</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #4a3f44;
            padding: 28px;
            line-height: 1.7;
            font-size: 13px;
          }

          .print-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 14px;
            border-bottom: 2px solid #f0e3e8;
          }
          .print-header h1 { font-size: 22px; color: #7f5665; margin-bottom: 2px; }
          .print-header p { font-size: 11px; color: #b98fa1; }

          /* ---- HEADINGS ---- */
          h1, h2, h3, h4, h5, h6 { color: #4a3f44; line-height: 1.3; }
          h2 { font-size: 17px; margin: 18px 0 8px; }
          h3 { font-size: 15px; margin: 14px 0 6px; color: #7f5665; }
          h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #b98fa1; margin: 12px 0 6px; }

          p { margin-bottom: 6px; color: #6f5a62; }

          /* ---- LISTS ---- */
          ul, ol { padding-left: 0; list-style: none; margin: 6px 0 12px; }
          li { padding: 3px 0; color: #6f5a62; font-size: 13px; }

          /* ---- GRID (meal cards) ---- */
          [class*="grid"] {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          /* ---- CARDS ---- */
          [class*="rounded-"] {
            border: 1px solid #f0e3e8;
            border-radius: 10px;
            padding: 14px;
            margin-bottom: 12px;
            page-break-inside: avoid;
          }

          /* ---- BADGES ---- */
          [class*="rounded-full"] {
            display: inline-block;
            background: #fdf2f5;
            color: #b98fa1;
            padding: 2px 10px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: 1px solid #f0e3e8;
            margin-bottom: 6px;
          }

          /* ---- FLEX ROWS ---- */
          [class*="flex"] {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          /* ---- DOTS (ingredient bullets) ---- */
          [class*="w-1"][class*="h-1"] {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #d8a7b5;
            display: inline-block;
            flex-shrink: 0;
          }

          /* ---- SPACING between sections ---- */
          [class*="mb-"] { margin-bottom: 10px; }
          [class*="mt-"] { margin-top: 10px; }
          [class*="gap-"] { gap: 8px; }
          [class*="space-y-"] > * + * { margin-top: 6px; }

          /* ---- STEP NUMBERS ---- */
          [class*="shrink-0"] {
            color: #d8a7b5;
            font-weight: 700;
            flex-shrink: 0;
          }

          /* ---- BENEFIT TAGS ---- */
          [class*="bg-\\[\\#fdf2f5\\]"] {
            background: #fdf2f5;
            color: #b98fa1;
            padding: 2px 8px;
            border-radius: 20px;
            font-size: 10px;
            display: inline-block;
            margin: 2px;
            border: 1px solid #f0e3e8;
          }

          /* ---- HIDE interactive elements ---- */
          button, input[type="checkbox"], [class*="btn-"], svg, [class*="hover:"] {
            /* keep visible but remove interactivity styling */
          }
          button { display: none; }
          .no-print { display: none !important; }
          input[type="checkbox"] {
            width: 14px;
            height: 14px;
            border: 1.5px solid #d8a7b5;
            border-radius: 3px;
            appearance: none;
            -webkit-appearance: none;
            flex-shrink: 0;
          }

          /* ---- TOTAL BAR ---- */
          [class*="bg-\\[\\#fdf2f5\\]"][class*="text-center"] {
            background: #fdf2f5;
            padding: 10px 16px;
            border-radius: 8px;
            text-align: center;
            margin: 14px 0;
          }

          /* ---- HIDDEN ELEMENTS ---- */
          [style*="display: none"], [class*="hidden"] { display: none; }

          /* ---- PRINT SPECIFIC ---- */
          @media print {
            body { padding: 14px; }
            [class*="grid"] { grid-template-columns: 1fr 1fr; }
          }

          @page {
            margin: 1cm;
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>✦ Veronica Method</h1>
          <p>${new Date().toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        ${content.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 600);
  }

  return (
    <button
      onClick={handlePrint}
      className="btn-outline flex items-center gap-2 text-sm"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      {label}
    </button>
  );
}
