# Basemap Tester

A simple Mapbox web app for testing and comparing different basemap styles.

## Basemap Styles

- 🗺️ **Topo Light** - Mapbox Outdoors style
- 🌑 **Topo Dark** - Mapbox Dark style  
- 🛰️ **Satellite** - Mapbox Satellite Streets style

## Setup

1. Clone the repo
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with your Mapbox token:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

## Adding Custom Styles

Edit `components/BasemapTester.tsx` and add entries to the `BASEMAP_STYLES` array:

```typescript
{
  id: "my-style",
  name: "My Custom Style",
  icon: "🎨",
  url: "mapbox://styles/username/style-id",
}
```
