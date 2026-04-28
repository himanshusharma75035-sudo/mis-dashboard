# Financial MIS Dashboard

An interactive monthly financial reporting dashboard built on **Google Apps Script** and **Chart.js**, deployed as a domain-restricted web app that reads from a private Google Sheet.

Designed for finance and operations leadership to monitor revenue, profitability, segment performance, and transaction volumes across a fiscal year — without exposing the underlying spreadsheet to end users.

---

## Features

- **KPI summary cards** — Total Revenue, Operating Profit (with margin %), EBITDA, PAT, GMV
- **Period filtering** — Year-to-date and quarterly toggles, applied across all charts and KPIs simultaneously
- **Segment-wise P&L visualization** — Stacked revenue and EBITDA charts by business unit
- **Volume metrics** — Dual-axis chart showing GMV (in Crores) against transaction count (in thousands)
- **Cost structure analysis** — Revenue vs. direct costs vs. operating expenses, monthly trend
- **Expense mix** — Donut chart showing breakdown of direct costs, employee cost, overheads, depreciation, and provisions
- **Detailed P&L table** — Monthly columns with section headers, total rows highlighted, all figures in Lakhs
- **Responsive layout** — Sticky header, hover tooltips, finance-first aesthetic
- **Indian numbering conventions** — Crores for large totals, Lakhs for line items, thousands for transactions

---

## Tech stack

| Layer        | Technology                                |
| ------------ | ----------------------------------------- |
| Backend      | Google Apps Script (V8 runtime)           |
| Data source  | Google Sheets (private, server-read)      |
| Frontend     | HTML5, CSS3, Vanilla JavaScript           |
| Charts       | Chart.js (loaded via CDN)                 |
| Deployment   | GAS Web App, domain-restricted access     |

---

## Architecture

The dashboard follows a server-rendered, data-injected pattern:

1. **Server side (`Code.js`)** — Apps Script runs with the script owner's credentials, opens the private Google Sheet via `SpreadsheetApp.openById()`, parses it into a structured JSON object, and serves the HTML template with data injected.
2. **Client side (`Dashboard.html`)** — Receives the parsed data on page load, builds Chart.js visualizations, and handles period-filter interactivity entirely in the browser.
3. **Access model** — End users authenticate via Google but never need access to the underlying sheet. The script acts as a controlled data gateway.

### Key design decision: composite parser keys

Financial MIS sheets often repeat row labels across sections (e.g., "Total" appears under Revenue, Direct Costs, EBITDA). Naive parsing by row name causes silent data corruption — later rows overwrite earlier ones in the lookup map.

The `SheetParser` here uses a **section + name composite key** (e.g., `"Revenue::SegmentA"`, `"EBITDA::SegmentA"`) so each line item is preserved correctly even when names collide across P&L sections.

---

## Setup

### Prerequisites
- A Google account with access to the source MIS spreadsheet
- Google Apps Script enabled at https://script.google.com

### Steps

1. **Clone this repo**
   ```bash
   git clone https://github.com/himanshusharma75035-sudo/mis-dashboard.git
   ```

2. **Create a new Apps Script project**
   - Go to https://script.google.com → New Project
   - Replace the default `Code.gs` with the contents of `Code.js` from this repo
   - Add an HTML file named `Dashboard` and paste in `Dashboard.html`

3. **Configure your sheet**
   - Open `Code.js` in the Apps Script editor
   - Replace `YOUR_SHEET_ID_HERE` with the ID of your Google Sheet (found in the sheet URL between `/d/` and `/edit`)
   - Update the `SHEET_MAP` object with the actual tab names from your spreadsheet

4. **Deploy as a Web App**
   - Click **Deploy** → **New deployment** → Type: Web app
   - Execute as: **Me**
   - Who has access: **Anyone within your organization** (recommended) or **Anyone**
   - Click Deploy and grant the requested permissions

5. **Open the deployment URL** — your dashboard is live.

---

## Expected sheet structure

The script expects a financial MIS layout with:
- **Row 2:** Month headers as datetime values, columns D onward
- **Section rows** that group line items: Revenue, Direct Costs, Operating Profit, OpEx, EBITDA, etc.
- **Line items per segment** under each section
- **Total rows** at the end of each section

Cells containing `'-'` or `#VALUE!` are treated as zero. The script auto-detects how many months of data are present and adjusts charts accordingly.

---

## Display conventions

| Metric type                        | Unit      | Decimals |
| ---------------------------------- | --------- | -------- |
| Revenue, GMV, large totals         | Crores    | 2        |
| EBITDA, PAT, smaller line items    | Lakhs     | 1        |
| Transaction count                  | Thousands | 0        |

Negative values render in red (`#ef4444`) without parentheses, in line with finance dashboard conventions.

---

## Screenshots

Add screenshots of the deployed dashboard to a `docs/` folder and embed them here:

```markdown
![Dashboard Overview](docs/screenshot-overview.png)
![Segment Performance](docs/screenshot-segment-view.png)
![P&L Detail](docs/screenshot-pnl-table.png)
```

Use anonymized or dummy data in screenshots — never expose real financial figures from a private deployment.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Author

**Himanshu Sharma** — Finance & Operations
[GitHub](https://github.com/himanshusharma75035-sudo)
