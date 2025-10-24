const baseUrl="http://178.128.39.219/"

export const fetchGoodParcels = async (center: { lat: number; lng: number }, radius: number) => {
  const response = await fetch(`${baseUrl}good-parcels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ center, radius }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch parcels');
  }

  return response.json();
};
