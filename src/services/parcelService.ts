export const fetchGoodParcels = async (center: { lat: number; lng: number }, radius: number) => {
  const response = await fetch('http://159.223.245.34/good-parcels', {
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
