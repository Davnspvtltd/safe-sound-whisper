import { useState, useEffect, useCallback } from "react";

interface Location {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

interface UseLocationReturn {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
  isSupported: boolean;
  refreshLocation: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isSupported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const getLocation = useCallback(() => {
    if (!isSupported) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = "Unable to retrieve location";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [isSupported]);

  // Get location on mount
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // Watch position for updates
  useEffect(() => {
    if (!isSupported) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      () => {
        // Silent fail for watch - we already have initial position
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isSupported]);

  return {
    location,
    error,
    isLoading,
    isSupported,
    refreshLocation: getLocation,
  };
};
