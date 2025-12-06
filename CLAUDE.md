# Offer Letter PDF Generator

## Project Requirements

### Tech Stack
- **Next.js 16** (App Router) - v16.0.7
- **React 19** - v19.2.0
- **Tailwind CSS 4** - v4.x
- **@react-pdf/renderer** - v4.3.1 (latest available)

### Task
- Use Figma MCP to access the design at:
  `https://www.figma.com/design/WN8QL24GHWQLu7x9Za0jSC/Offer-Letter-Automation--Copy-`
- The design has **6 main frames**
- Each frame = **1 page** in landscape orientation (1920x1080)
- Generate a **single PDF document** containing all 6 pages
- The PDF output should match the Figma design

### Output
- A Next.js application that renders the Figma design as a multi-page PDF using `@react-pdf/renderer`

---

## Figma Design
- **File Key:** `HkyLlp3PL3ZBPcLNaiHvOz`
- **Design URL:** https://www.figma.com/design/HkyLlp3PL3ZBPcLNaiHvOz/Offer-Letter-Automation
- **Pages:** 7 frames (landscape orientation 1920x1080)

### Frame Details:
1. **Page 1 (1:13)** - Cover page with orange background, logo, "Offer Letter" title, candidate name
2. **Page 2 (1:22)** - Introduction with "Hey, {First Name}", intro paragraph, founders image
3. **Page 3 (1:35)** - Summary (Role, Salary, Stock Options, Vesting, Start Date)
4. **Page 4 (1:69)** - Benefits (Healthcare, PTO, Education, Equipment)
5. **Page 5 (1:97)** - Zingage Team (Builders, GTM/OPS, Experience, Investors with photos/logos)
6. **Page 6 (1:248)** - Getting Started (Orange page with onboarding steps)
7. **Page 7 (1:253)** - Vision/Mission with testimonials and press coverage

---

## Project Structure

```
offer-letter-pdf/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-pdf/
│   │   │       └── route.tsx      # API route for server-side PDF generation
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Main page with PDF viewer
│   ├── components/
│   │   ├── pdf/
│   │   │   ├── index.ts
│   │   │   ├── OfferLetterDocument.tsx  # Main PDF document
│   │   │   ├── Page1Cover.tsx           # Orange cover with candidate name
│   │   │   ├── Page2Introduction.tsx    # Hey FirstName with founders
│   │   │   ├── Page3Summary.tsx         # Role, Salary, Stock Options
│   │   │   ├── Page4Benefits.tsx        # Healthcare, PTO, Education
│   │   │   ├── Page5Team.tsx            # Team photos and company logos
│   │   │   ├── Page6GettingStarted.tsx  # Onboarding steps
│   │   │   └── Page7Vision.tsx          # Vision with testimonials
│   │   └── PDFViewer.tsx          # Client-side PDF viewer component
│   └── lib/
│       ├── assets.ts              # Asset URLs (Figma MCP)
│       ├── fonts.ts               # Font registration
│       ├── styles.ts              # Shared styles and colors
│       └── types.ts               # TypeScript types
├── public/
│   └── assets/                    # Downloaded Figma assets (images, SVGs)
├── package.json
└── CLAUDE.md
```

---

## Running the Project

```bash
cd offer-letter-pdf
npm install
npm run dev
```

Visit http://localhost:3000 to see the PDF preview.

---

## API Endpoints

- **GET /api/generate-pdf** - Generate and view PDF with default data
- **POST /api/generate-pdf** - Generate PDF with custom offer data

### POST Body Example:
```json
{
  "firstName": "John",
  "title": "Senior Software Engineer",
  "salary": "$180,000",
  "shares": "50,000",
  "equityPercentage": "0.5%",
  "startDate": "January 15, 2025"
}
```

---

## Design Colors
- Cream: `#FCFBE9`
- Green: `#2D6D4F`
- Orange: `#FF6B02`
- Orange Light: `#FF974D`
- White: `#FFFFFF`

---

## Notes
- Figma MCP asset URLs expire after 7 days - download images for production
- Emoji support requires additional font configuration
- PDF pages are 1920x1080 (landscape) to match Figma frames
