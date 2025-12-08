# Architecture Map - Offer Letter PDF Generation System

**Date**: 2025-12-08
**System**: Offer Letter PDF Generator
**Version**: 0.1.0

## Executive Summary

The Offer Letter PDF Generation system is built on a **Layered Monolithic Architecture** using Next.js 16 with React 19, implementing a clean separation between presentation, business logic, and data layers. The system follows a **Server-Side Rendering (SSR) first** approach with selective client-side interactivity, optimizing for performance and SEO while maintaining a simple deployment model.

## Architecture Type

**Pattern**: **Layered Monolithic with Server Components**

### Rationale
- **Monolithic chosen over Microservices**: Single focused domain (PDF generation), small team size, simple deployment requirements
- **Layered approach**: Clear separation of concerns between UI, API, business logic, and utilities
- **Server Components by default**: Leverages Next.js 16's server-first approach for optimal performance
- **Selective client interactivity**: Only forms and PDF preview components are client-side

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js App (Server-Rendered + Client Components)  │   │
│  │  - Server Components (Layout, Pages)                │   │
│  │  - Client Components (Forms, PDF Viewer)            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER (Node.js)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PRESENTATION LAYER                      │   │
│  │                                                      │   │
│  │  ├── /app                                           │   │
│  │  │   ├── page.tsx (Server Component)               │   │
│  │  │   ├── preview/page.tsx (Server Component)       │   │
│  │  │   └── layout.tsx (Root Layout)                  │   │
│  │                                                      │   │
│  │  ├── /components                                    │   │
│  │      ├── Server Components (ZingageLogo)           │   │
│  │      └── Client Components (Forms, PDFViewer)      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  API LAYER                          │   │
│  │                                                      │   │
│  │  ├── /api/generate-pdf                             │   │
│  │  │   └── POST: Generate PDF with offer data        │   │
│  │  │                                                  │   │
│  │  └── /api/offer-letter                             │   │
│  │      └── POST: Generate PDF from spreadsheet input │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              BUSINESS LOGIC LAYER                   │   │
│  │                                                      │   │
│  │  ├── pdf-generator.tsx                             │   │
│  │  │   ├── generatePDF()                             │   │
│  │  │   └── checkETagMatch()                          │   │
│  │                                                      │   │
│  │  ├── transform-input.ts                            │   │
│  │  │   ├── validateInput()                           │   │
│  │  │   └── transformInput()                          │   │
│  │                                                      │   │
│  │  └── PDF Components (/components/pdf/)             │   │
│  │      ├── OfferLetterDocument                       │   │
│  │      └── Page1-7 Components                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               UTILITY LAYER                         │   │
│  │                                                      │   │
│  │  ├── pdf-cache.ts (In-Memory LRU Cache)           │   │
│  │  ├── request-utils.ts (HTTP Utilities)             │   │
│  │  ├── fonts.ts (Font Registration)                  │   │
│  │  ├── styles.ts (Shared Styles)                     │   │
│  │  ├── assets.ts (Asset Management)                  │   │
│  │  └── types.ts (TypeScript Definitions)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Component Dependency Map

```
                    OfferLetterDocument
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
    Page1Cover      Page2Introduction    Page3Summary
        │                  │                  │
        │                  │                  │
    Page4Benefits    Page5Team         Page6GettingStarted
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                      Page7Vision
                           │
                    ┌──────┴──────┐
                    ▼              ▼
                ZingageLogo    Asset URLs
```

### Dependency Flow
1. **API Routes** → **pdf-generator** → **OfferLetterDocument** → **Individual Page Components**
2. **Page Components** → **lib/styles** (shared styles)
3. **Page Components** → **lib/assets** (image/asset URLs)
4. **API Routes** → **pdf-cache** (caching layer)
5. **API Routes** → **request-utils** (HTTP utilities)

## Technology Stack

### Core Framework
- **Next.js 16.0.7**: React framework with SSR/SSG capabilities
- **React 19.2.0**: UI library (with React Compiler enabled)
- **TypeScript 5.x**: Type safety and developer experience

### PDF Generation
- **@react-pdf/renderer 4.3.1**: Server-side PDF generation from React components
- **react-pdf 10.2.0**: Client-side PDF viewing capabilities

### Styling
- **Tailwind CSS 4.x**: Utility-first CSS framework (latest v4)
- **PostCSS**: CSS processing

### Development Tools
- **ESLint**: Code quality
- **Sharp**: Image optimization (dev dependency)
- **Babel React Compiler**: Optimization plugin

## Key Architectural Decisions

### 1. Server-First Rendering Strategy
**Decision**: Use Server Components by default, Client Components only where needed
**Rationale**:
- Reduces client bundle size
- Improves initial page load
- Better SEO (though less critical for this app)
- Simpler state management

**Implementation**:
- Main pages are Server Components
- Only forms and PDF viewer are Client Components
- Data fetching happens on server

### 2. In-Memory LRU Caching
**Decision**: Implement in-memory LRU cache for generated PDFs
**Rationale**:
- Avoid redundant PDF generation (expensive operation)
- Fast response times for repeated requests
- Simple implementation without external dependencies

**Trade-offs**:
- ✅ Fast, simple, no external dependencies
- ❌ Cache lost on server restart
- ❌ Not shared across multiple server instances

### 3. Dual API Endpoint Strategy
**Decision**: Two separate API endpoints for different input formats
**Rationale**:
- `/api/generate-pdf`: Simple JSON input for web form
- `/api/offer-letter`: Spreadsheet-compatible format
- Maintains backward compatibility while adding features

### 4. Component-Based PDF Architecture
**Decision**: Each PDF page as a separate React component
**Rationale**:
- Maintainable and modular
- Easy to update individual pages
- Reusable components across pages
- Type-safe with TypeScript

### 5. Static Asset Management
**Decision**: Assets served from public directory with Figma MCP integration
**Rationale**:
- Direct Figma design integration
- Automatic asset extraction
- Version control for assets

**Note**: Figma MCP URLs expire after 7 days - production should use downloaded assets

## Areas of Concern & Recommendations

### 🔴 Critical Concerns

#### 1. **No Authentication/Authorization**
- **Issue**: PDFs can be generated by anyone with API access
- **Risk**: Potential abuse, resource exhaustion
- **Recommendation**: Implement API key authentication or OAuth2

#### 2. **Sensitive Data in Memory**
- **Issue**: Offer data (salaries, equity) stored in cache
- **Risk**: Memory dumps could expose sensitive information
- **Recommendation**:
  - Encrypt cache entries
  - Implement cache TTL (currently 1 hour)
  - Consider Redis for production

### 🟡 Moderate Concerns

#### 3. **No Persistent Storage**
- **Issue**: No database, all data transient
- **Risk**: No audit trail, no historical records
- **Recommendation**:
  - Add PostgreSQL for offer letter records
  - Implement audit logging

#### 4. **Single Point of Failure**
- **Issue**: Monolithic architecture, single server
- **Risk**: Entire system down if server fails
- **Recommendation**:
  - Deploy multiple instances with load balancer
  - Implement health checks
  - Consider serverless deployment

#### 5. **Limited Error Handling**
- **Issue**: Basic try-catch blocks, minimal error recovery
- **Risk**: Poor user experience on failures
- **Recommendation**:
  - Implement comprehensive error boundaries
  - Add retry logic for transient failures
  - Better error messages for users

### 🟢 Minor Concerns

#### 6. **Asset Expiration**
- **Issue**: Figma MCP URLs expire after 7 days
- **Risk**: Broken images in production
- **Recommendation**: Download and version control critical assets

#### 7. **No Rate Limiting**
- **Issue**: API endpoints have no rate limits
- **Risk**: DoS attacks, resource exhaustion
- **Recommendation**: Implement rate limiting middleware

## Scalability Considerations

### Current Limitations
- **Vertical Scaling Only**: Single server instance
- **Memory-Based Cache**: Not shared across instances
- **Synchronous PDF Generation**: Blocks request thread

### Scaling Path
1. **Phase 1**: Add Redis cache (share across instances)
2. **Phase 2**: Implement queue-based PDF generation
3. **Phase 3**: Horizontal scaling with load balancer
4. **Phase 4**: Consider microservices for PDF generation

## Security Architecture

### Current Security Measures
- ✅ Input validation on API endpoints
- ✅ TypeScript for type safety
- ✅ Sanitized filenames for downloads
- ✅ ETag support for cache validation

### Missing Security Measures
- ❌ Authentication/Authorization
- ❌ Rate limiting
- ❌ Input sanitization for XSS
- ❌ CORS configuration
- ❌ Security headers
- ❌ Encrypted storage

## Deployment Architecture

### Current Model
```
┌──────────────┐     ┌──────────────┐
│   Vercel/    │────▶│   Next.js    │
│   Netlify    │     │   Server     │
└──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Public      │
                     │  Assets      │
                     └──────────────┘
```

### Recommended Production Model
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   CloudFlare │────▶│ Load Balancer│────▶│  Next.js     │
│     CDN      │     │   (Nginx)    │     │  Instances   │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                            ┌─────────────────────┼─────────┐
                            ▼                     ▼         ▼
                     ┌──────────────┐    ┌──────────────┐  │
                     │    Redis     │    │  PostgreSQL  │  │
                     │    Cache     │    │   Database   │  │
                     └──────────────┘    └──────────────┘  │
                                                            ▼
                                                    ┌──────────────┐
                                                    │  S3 Bucket   │
                                                    │   (Assets)   │
                                                    └──────────────┘
```

## Performance Characteristics

### Current Performance
- **PDF Generation**: ~500-2000ms (uncached)
- **Cached Response**: ~10-50ms
- **Cache Hit Rate**: Expected 60-80% in production
- **Memory Usage**: ~50MB base + 1-2MB per cached PDF

### Optimization Opportunities
1. **Lazy Loading**: Split client components for faster initial load
2. **Image Optimization**: Pre-process and compress assets
3. **Font Subsetting**: Reduce font file sizes
4. **Parallel Processing**: Generate PDF pages in parallel

## Monitoring & Observability

### Current Monitoring
- Basic console logging
- PDF generation timing logs
- Cache hit/miss logging

### Recommended Monitoring Stack
```
Application → Prometheus → Grafana
     │
     └────→ ELK Stack (Logs)
     │
     └────→ Sentry (Errors)
```

### Key Metrics to Track
- PDF generation time (P50, P95, P99)
- Cache hit rate
- API response times
- Error rates
- Memory usage
- Concurrent requests

## Conclusion

The Offer Letter PDF Generation system implements a clean, maintainable architecture suitable for its current scope. The layered monolithic approach with server-first rendering provides good performance and developer experience.

### Strengths
- Clean separation of concerns
- Type-safe with TypeScript
- Efficient caching strategy
- Modular component structure
- Simple deployment model

### Areas for Improvement
- Add authentication and authorization
- Implement persistent storage
- Enhance error handling
- Add comprehensive monitoring
- Prepare for horizontal scaling

The architecture is well-suited for a small to medium-scale application but will require enhancements for enterprise-scale deployment, particularly in areas of security, scalability, and observability.

---

**Document Version**: 1.0.0
**Last Updated**: 2025-12-08
**Author**: Software Architecture Team
**Status**: Current