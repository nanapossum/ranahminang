# RanahMinang Destination Data Setup Guide

## Overview
This guide walks through setting up the destination database for RanahMinang, connecting the tourism UI to real database-backed destination data.

## Architecture Summary

The system now has a **dual-source destination architecture**:

### Data Sources
1. **Database Destinations** (Producer-uploaded)
   - Stored in Prisma `Destination` table (MariaDB)
   - Created by authenticated "producer" users
   - Include user-uploaded images
   - Have real coordinates (latitude/longitude)

2. **Curated Locations** (Static fallback)
   - Defined in `/data/locations.ts`
   - West Sumatra cultural landmarks
   - Always available as reference

### Components Flow
- **Homepage** (`app/page.tsx`)
  - Fetches destinations from Prisma database
  - Passes to TourismCards and MapSection
  
- **TourismCards** (`components/TourismCards.tsx`)
  - Merges producer destinations with curated locations
  - Filters by category
  - Shows empty state gracefully
  
- **MapSection** → **CulturalMap** (`components/CulturalMap.tsx`)
  - Renders Leaflet map
  - Shows database markers + curated markers
  - Dynamic filtering by category

- **Destination Detail** (`app/destinations/[id]/page.tsx`)
  - Fetches from database OR curated data
  - Shows producer info or "RanahMinang" for curated
  - Displays related destinations by category

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This installs `tsx` (newly added for running seed script).

### 2. Ensure Database Migrations Are Applied
```bash
npm run prisma:migrate
```

This ensures the `Destination` table exists in MariaDB with:
- Core fields: title, description, image, location, category
- Coordinates: latitude, longitude
- Relations: createdBy (foreign key to User)
- Indices: createdBy, category, createdAt

**Note:** The migration `20260526123000_reset_tokens_destination_coordinates` already added latitude/longitude fields.

### 3. Run the Seed Script
```bash
npm run prisma:seed
```

This creates:
- **Producer account** (if not exists)
  - Email: `producer@ranahminang.dev`
  - Password: `DemoProducer123!`
  - Role: `producer` (approved)
  
- **10 Destination records**
  - Jam Gadang (Historical Landmark)
  - Ngarai Sianok (Geological Heritage)
  - Danau Maninjau (Volcanic Lake)
  - Istano Basa Pagaruyung (Palace Heritage)
  - Lembah Harau (Hidden Nature)
  - Pantai Air Manis (Beach)
  - Bukit Tinggi Fort (Colonial Heritage)
  - Rumah Gadang Cultural Compound (Cultural Heritage)
  - Kelok 44 Road (Mountain Road)
  - Kampuang Minangkabau Cultural Village (Cultural Village)

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see:
- Homepage with merged destination cards
- Interactive map with real markers
- Working category filters
- Functional destination detail pages

## What's New/Changed

### Files Created
- `prisma/seed.ts` - Seed script with West Sumatra destinations

### Files Modified
- `package.json` - Added `prisma:seed` script and `tsx` dev dependency

### Files Unchanged (Already Correct)
- `prisma/schema.prisma` - Destination model already valid
- `app/page.tsx` - Already fetches from database
- `components/TourismCards.tsx` - Already handles database data
- `components/CulturalMap.tsx` - Already renders both sources
- `app/destinations/[id]/page.tsx` - Already queries database
- `app/api/destinations/route.ts` - Already has GET endpoint

## Database State

After seeding:

```
Destinations Table:
├─ 10 producer-created destinations (from seed)
├─ Owned by: producer@ranahminang.dev
├─ Categories: Historical, Nature, Beach, Cultural, Heritage
├─ Real coordinates for mapping
└─ Sample images: /uploads/placeholder-*.jpg
```

## Testing Checklist

- [ ] Run `npm run prisma:seed` successfully
- [ ] Homepage loads with TourismCards displaying database destinations
- [ ] Filter buttons work (All, Nature, Historical, etc.)
- [ ] Map renders with destination markers
- [ ] Click destination card → detail page loads
- [ ] Detail page shows producer name or "RanahMinang"
- [ ] Related destinations display by category
- [ ] Empty image fallback shows gradient placeholder
- [ ] No console errors

## Re-seeding & Development

The seed script is **idempotent** - it skips existing destinations:
```bash
npm run prisma:seed
```

To completely reset and reseed:
```bash
# WARNING: This deletes all data
npm run prisma:migrate:reset

# Then reseed
npm run prisma:seed
```

## Production Considerations

- **Image uploads**: Currently using `/uploads/placeholder-*.jpg` paths
  - Seed uses placeholders for development
  - Producer uploads should use real image paths from upload system
  
- **Producer accounts**: Seed creates one demo account
  - Create real producer accounts through registration UI
  - Ensure registration approval workflow is active
  
- **Coordinates**: All seed destinations have real West Sumatra coordinates
  - Validate coordinates when producers upload new destinations
  
- **Categories**: Standardized categories for filtering
  - Update category validation if needed

## Troubleshooting

**Error: "Destination table not found"**
- Run: `npm run prisma:migrate`

**Error: "Producer not found" in seed**
- Check DATABASE_URL in `.env`
- Ensure MariaDB is running and accessible

**Error: "prisma generate not run"**
- Run: `npm run prisma:generate`

**Destinations not showing on homepage**
- Clear Next.js cache: `rm -rf .next`
- Restart dev server: `npm run dev`
- Check browser console for API errors

## Environment Variables Needed

```env
DATABASE_URL="mysql://user:password@localhost:3306/ranahminang"
NEXT_PUBLIC_MAPBOX_TOKEN=""  # Optional: if using Mapbox
```

The project uses **Leaflet** (free), not Mapbox, so mapping works without API tokens.

---

**Setup Complete!** The destination data flow is now connected. The UI components fetch real data from the MariaDB database while maintaining curated locations as reference fallbacks.
