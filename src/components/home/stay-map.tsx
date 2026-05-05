"use client";

import { Box, Text, VStack, chakra } from "@chakra-ui/react";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import { useMemo } from "react";
import type { Listing } from "@/data/listings";

export type MapViewport = {
  latitude: number;
  longitude: number;
  zoom: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
};

export type CitySummary = {
  city: string;
  state: string;
  count: number;
  latitude: number;
  longitude: number;
  avgPrice: number;
  image: string;
};

type StayMapProps = {
  listings: Listing[];
  citySummaries: CitySummary[];
  activeListingId: number;
  isCityMode: boolean;
  onSelect: (listingId: number) => void;
  onViewportChange: (viewport: MapViewport) => void;
};

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

export function StayMap({
  listings,
  citySummaries,
  activeListingId,
  isCityMode,
  onSelect,
  onViewportChange,
}: StayMapProps) {
  const activeListing = useMemo(
    () => listings.find((listing) => listing.id === activeListingId) ?? listings[0],
    [activeListingId, listings],
  );

  const syncViewport = (map: maplibregl.Map) => {
    const center = map.getCenter();
    const bounds = map.getBounds();

    onViewportChange({
      latitude: center.lat,
      longitude: center.lng,
      zoom: map.getZoom(),
      bounds: {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      },
    });
  };

  return (
    <Box position="relative" h="100%" minH={{ base: "360px", lg: "100vh" }}>
      <Map
        initialViewState={{
          latitude: 22.9734,
          longitude: 78.6569,
          zoom: 4.4,
        }}
        mapLib={maplibregl}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
        onLoad={(event) => syncViewport(event.target)}
        onMoveEnd={(event) => syncViewport(event.target)}
      >
        <NavigationControl position="top-right" />
        {isCityMode
          ? citySummaries.map((city) => (
              <Marker
                key={city.city}
                latitude={city.latitude}
                longitude={city.longitude}
                anchor="bottom"
              >
                <chakra.div
                  px="4"
                  py="3"
                  borderRadius="24px"
                  bg="#111111"
                  color="white"
                  boxShadow="0 12px 24px rgba(17,17,17,0.24)"
                  textAlign="center"
                >
                  <Text fontSize="sm" fontWeight="700" lineHeight="1">
                    {city.count}
                  </Text>
                  <Text fontSize="xs" mt="1" lineHeight="1">
                    {city.city}
                  </Text>
                </chakra.div>
              </Marker>
            ))
          : listings.map((listing) => {
          const isActive = listing.id === activeListingId;

          return (
            <Marker
              key={listing.id}
              latitude={listing.lat}
              longitude={listing.lng}
              anchor="bottom"
            >
              <chakra.button
                onClick={() => onSelect(listing.id)}
                px="3"
                py="2"
                borderRadius="999px"
                borderWidth="1px"
                borderColor={isActive ? "transparent" : "blackAlpha.300"}
                bg={isActive ? "#111111" : "white"}
                color={isActive ? "white" : "#111111"}
                boxShadow={isActive ? "0 12px 24px rgba(17,17,17,0.28)" : "md"}
                fontSize="sm"
                fontWeight="700"
                transition="all 0.2s ease"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 14px 28px rgba(17,17,17,0.18)",
                }}
              >
                Rs. {listing.price}
              </chakra.button>
            </Marker>
          );
        })}

        {!isCityMode && activeListing ? (
          <Popup
            closeButton={false}
            closeOnClick={false}
            anchor="top"
            longitude={activeListing.lng}
            latitude={activeListing.lat}
            offset={24}
            maxWidth="260px"
          >
            <VStack align="start" gap="1">
              <Text fontWeight="700">{activeListing.title}</Text>
              <Text fontSize="sm" color="gray.600">
                {activeListing.location}
              </Text>
              <Text fontSize="sm" fontWeight="600">
                Rs. {activeListing.price} contribution
              </Text>
            </VStack>
          </Popup>
        ) : null}
      </Map>
    </Box>
  );
}
