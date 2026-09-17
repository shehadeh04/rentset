// Workspace imagery. The schema has no photo columns yet, so each unit and
// property gets a stable, representative photo derived from its id: the same
// record always renders the same image, across sessions and devices.
// Replace `photoFor` with a real stored URL once uploads exist.
//
// Unsplash License: free for commercial use, no attribution required.

const INTERIORS = [
  '1664892798972-079f15663b16',
  '1502672260266-1c1ef2d93688',
  '1493809842364-78817add7ffb',
  '1522708323590-d24dbb6b0267',
  '1484154218962-a197022b5858',
  '1600607687939-ce8a6c25118c',
  '1600566753086-00f18fb6b3ea',
  '1586023492125-27b2c045efd7',
  '1560448204-e02f11c3d0e2',
  '1600210492486-724fe5c67fb0',
]

const EXTERIORS = [
  '1638973140785-3b918e290682',
  '1619994121345-b61cd610c5a6',
  '1568295123886-8d09a5986b4e',
  '1579632652768-6cb9dcf85912',
  '1614115863913-b04024ec4ed1',
  '1600994562666-98dbd6d44e44',
]

function pick(pool: string[], seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return pool[h % pool.length]
}

function url(id: string, w: number, h: number) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=72&auto=format`
}

export function unitPhoto(unitId: string, w = 480, h = 320) {
  return url(pick(INTERIORS, unitId), w, h)
}

export function propertyPhoto(propertyId: string, w = 640, h = 360) {
  return url(pick(EXTERIORS, propertyId), w, h)
}
