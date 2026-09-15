export interface NearbyVendor {
  id: string
  name: string
  address: string
  phone: string | null
  rating: number | null
  type: string | null
}

const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY

export const placesConfigured = Boolean(apiKey)

interface PlacesTextSearchResponse {
  places?: {
    id: string
    displayName?: { text: string }
    formattedAddress?: string
    nationalPhoneNumber?: string
    rating?: number
    primaryTypeDisplayName?: { text: string }
  }[]
}

export async function searchNearbyVendors(trade: string, location: string): Promise<NearbyVendor[]> {
  if (!apiKey) {
    throw new Error('Vendor search isn’t connected yet.')
  }

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.primaryTypeDisplayName',
    },
    body: JSON.stringify({
      textQuery: `${trade} near ${location}`,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Search failed (${res.status}): ${body}`)
  }

  const data = (await res.json()) as PlacesTextSearchResponse
  return (data.places ?? []).map((p) => ({
    id: p.id,
    name: p.displayName?.text ?? 'Unknown',
    address: p.formattedAddress ?? '',
    phone: p.nationalPhoneNumber ?? null,
    rating: p.rating ?? null,
    type: p.primaryTypeDisplayName?.text ?? null,
  }))
}
