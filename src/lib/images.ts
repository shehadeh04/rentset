// Marketing photography (Unsplash License: free for commercial use, no
// attribution required). Swap these for owned/licensed property photos when
// they are available; nothing else needs to change.
function unsplash(id: string, w: number, h: number) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=75&auto=format`
}

export const marketingImages = {
  hero: {
    src: unsplash('1638973140785-3b918e290682', 2000, 1100),
    alt: 'A row of modern apartment buildings on a sunny street',
  },
  unitInterior: {
    src: unsplash('1664892798972-079f15663b16', 1200, 1000),
    alt: 'Bright empty living space with floor-to-ceiling windows',
  },
  rooftops: {
    src: unsplash('1619994121345-b61cd610c5a6', 1400, 900),
    alt: 'Modern white apartment building against a clear sky',
  },
  townscape: {
    src: unsplash('1568295123886-8d09a5986b4e', 1200, 1600),
    alt: 'Apartment tower seen from street level against a blue sky',
  },
  unitA: {
    src: unsplash('1579632652768-6cb9dcf85912', 800, 600),
    alt: 'Brick apartment building with balconies',
  },
  unitB: {
    src: unsplash('1614115863913-b04024ec4ed1', 800, 600),
    alt: 'White apartment facade with balconies',
  },
  unitC: {
    src: unsplash('1600994562666-98dbd6d44e44', 800, 600),
    alt: 'Modern low-rise apartment building',
  },
}
