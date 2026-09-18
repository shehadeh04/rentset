// Marketing photography (Unsplash License: free for commercial use, no
// attribution required). Swap these for owned/licensed property photos when
// they are available; nothing else needs to change.
function unsplash(id: string, w: number, h: number) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=78&auto=format`
}

export const marketingImages = {
  hero: {
    src: unsplash('1638973140785-3b918e290682', 2400, 1400),
    alt: 'A row of modern apartment buildings on a sunny street',
  },
  unitInterior: {
    src: unsplash('1664892798972-079f15663b16', 1600, 1200),
    alt: 'Bright empty living space with floor-to-ceiling windows',
  },
  rooftops: {
    src: unsplash('1619994121345-b61cd610c5a6', 1600, 1100),
    alt: 'Modern white apartment building against a clear sky',
  },
  townscape: {
    src: unsplash('1568295123886-8d09a5986b4e', 1200, 1600),
    alt: 'Apartment tower seen from street level against a blue sky',
  },
  unitA: {
    src: unsplash('1579632652768-6cb9dcf85912', 1000, 750),
    alt: 'Brick apartment building with balconies',
  },
  unitB: {
    src: unsplash('1614115863913-b04024ec4ed1', 1000, 750),
    alt: 'White apartment facade with balconies',
  },
  unitC: {
    src: unsplash('1600994562666-98dbd6d44e44', 1000, 750),
    alt: 'Modern low-rise apartment building',
  },
  livingRoom: {
    src: unsplash('1502672260266-1c1ef2d93688', 1600, 1100),
    alt: 'Living room with plants and natural light',
  },
  kitchen: {
    src: unsplash('1484154218962-a197022b5858', 1600, 1100),
    alt: 'Clean white kitchen with stainless appliances',
  },
  loft: {
    src: unsplash('1600566753086-00f18fb6b3ea', 1600, 1100),
    alt: 'Open loft living area with tall windows',
  },
  emptyRoom: {
    src: unsplash('1586023492125-27b2c045efd7', 1600, 1100),
    alt: 'Minimal room with a single chair and bare walls',
  },
  lounge: {
    src: unsplash('1600210492486-724fe5c67fb0', 1600, 1100),
    alt: 'Furnished living room ready for viewing',
  },
}
