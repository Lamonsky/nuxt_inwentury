import axios from 'axios';

export const getCoordinates = async (address: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    const response = await axios.get('https://geocode.maps.co/search', {
      params: {
        q: address,
        api_key: '6823b3b41cffe727015759srn676281',
        limit: 1,
      },
    });

    if (response.data.length > 0) {
      const coordinates = response.data[0];
      return { lat: coordinates.lat, lon: coordinates.lon }; // Photon zwraca [lon, lat]
    } else {
      console.warn(`Nie znaleziono współrzędnych dla adresu: ${address}`);
      return null;
    }
  } catch (error) {
    console.error('Błąd podczas geokodowania adresu:', error);
    return null;
  }
};