export const calculateDistance = (coord1: { lat: number; lon: number }, coord2: { lat: number; lon: number }): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
  
    const R = 6371; // Promień Ziemi w kilometrach
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lon - coord1.lon);
    const lat1 = toRad(coord1.lat);
    const lat2 = toRad(coord2.lat);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Dystans w kilometrach
  };