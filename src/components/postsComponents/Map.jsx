import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
const apikey = import.meta.env.VITE_MAPS_API_KEY;

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: -0.181,
  lng: -78.483
};

function Map({setCoordinates}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apikey, 
  });

  const [marker, setMarker] = React.useState(null);

  const onMapClick = React.useCallback((e) => {
    const marker = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
    }
    setMarker(marker);
    setCoordinates(marker);
  }, []);

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={center}
      onClick={onMapClick}
    >
      {marker && <Marker position={{ lat: marker.lat, lng: marker.lng }} />}
    </GoogleMap>
  );
}

export default Map;
