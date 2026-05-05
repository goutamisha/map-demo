"use client";

import {
  Badge,
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  HStack,
  Image,
  Separator,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { listings, type Listing } from "@/data/listings";
import { StayMap, type CitySummary, type MapViewport } from "./stay-map";

const filters = [
  "Inner Engineering",
  "Hatha Yoga",
  "Residential",
  "Beginner",
  "Advanced",
  "Weekend",
];

const CITY_MODE_ZOOM = 5.6;

export function HomePage() {
  const [activeListingId, setActiveListingId] = useState(listings[0]?.id ?? 0);
  const [viewport, setViewport] = useState<MapViewport | null>(null);
  const isCityMode = viewport ? viewport.zoom < CITY_MODE_ZOOM : false;

  const isWithinBounds = useCallback((lat: number, lng: number) => {
    if (!viewport) {
      return true;
    }

    return (
      lat <= viewport.bounds.north &&
      lat >= viewport.bounds.south &&
      lng <= viewport.bounds.east &&
      lng >= viewport.bounds.west
    );
  }, [viewport]);

  const sortedListings = useMemo(() => {
    if (!viewport) {
      return listings;
    }

    const distanceFromCenter = (lat: number, lng: number) => {
      const latDelta = lat - viewport.latitude;
      const lngDelta = lng - viewport.longitude;

      return Math.sqrt(latDelta ** 2 + lngDelta ** 2);
    };

    return [...listings].sort((first, second) => {
      const firstInView = isWithinBounds(first.lat, first.lng);
      const secondInView = isWithinBounds(second.lat, second.lng);

      if (firstInView !== secondInView) {
        return firstInView ? -1 : 1;
      }

      return (
        distanceFromCenter(first.lat, first.lng) -
        distanceFromCenter(second.lat, second.lng)
      );
    });
  }, [isWithinBounds, viewport]);

  const visibleListingsCount = useMemo(
    () => listings.filter((listing) => isWithinBounds(listing.lat, listing.lng)).length,
    [isWithinBounds],
  );

  const citySummaries = useMemo<CitySummary[]>(() => {
    const cityMap = new Map<string, CitySummary>();

    listings.forEach((listing) => {
      if (!isWithinBounds(listing.lat, listing.lng)) {
        return;
      }

      const existing = cityMap.get(listing.city);

      if (existing) {
        existing.count += 1;
        existing.avgPrice = Math.round((existing.avgPrice * (existing.count - 1) + listing.price) / existing.count);
        return;
      }

      cityMap.set(listing.city, {
        city: listing.city,
        state: listing.state,
        count: 1,
        latitude: listing.lat,
        longitude: listing.lng,
        avgPrice: listing.price,
        image: listing.image,
      });
    });

    return [...cityMap.values()].sort((first, second) => second.count - first.count);
  }, [isWithinBounds]);

  const groupedVisibleListings = useMemo(() => {
    if (!isCityMode) {
      return [];
    }

    return citySummaries;
  }, [citySummaries, isCityMode]);

  const visibleResultsLabel = isCityMode
    ? `${groupedVisibleListings.length} cities in current map view`
    : `${visibleListingsCount} programs in current map view`;

  return (
    <Box minH="100vh" bg="#f7f7f2" color="#111111">
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6, xl: 8 }}
        py="4"
        borderBottom="1px solid"
        borderColor="blackAlpha.100"
        bg="rgba(247, 247, 242, 0.94)"
        backdropFilter="blur(18px)"
        position="sticky"
        top="0"
        zIndex="20"
      >
        <Heading size="md" letterSpacing="-0.04em">
          isha programs map
        </Heading>
        <HStack
          display={{ base: "none", md: "flex" }}
          bg="white"
          borderRadius="999px"
          px="2"
          py="2"
          gap="1"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="blackAlpha.100"
        >
          <Button variant="ghost" rounded="full" size="sm">
            India
          </Button>
          <Separator orientation="vertical" h="5" />
          <Button variant="ghost" rounded="full" size="sm">
            Upcoming dates
          </Button>
          <Separator orientation="vertical" h="5" />
          <Button rounded="full" size="sm" bg="#ff385c" color="white">
            Explore programs
          </Button>
        </HStack>
        <HStack gap="2">
          <Button rounded="full" variant="outline" bg="white">
            Isha centers
          </Button>
          <Button rounded="full" bg="#111111" color="white">
            Sadhana
          </Button>
        </HStack>
      </Flex>

      <Box px={{ base: 4, md: 6, xl: 8 }} py="4">
        <HStack gap="3" overflowX="auto" pb="2" css={{ scrollbarWidth: "none" }}>
          {filters.map((filter) => (
            <Button
              key={filter}
              rounded="full"
              variant="outline"
              bg="white"
              borderColor="blackAlpha.200"
              whiteSpace="nowrap"
            >
              {filter}
            </Button>
          ))}
        </HStack>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="0" alignItems="stretch">
        <Box px={{ base: 4, md: 6, xl: 8 }} pb={{ base: 8, lg: 10 }}>
          <Stack gap="6">
            <Box pt="2">
              <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.16em" color="gray.600">
                {visibleResultsLabel}
              </Text>
              <Heading mt="2" size="2xl" maxW="12ch" lineHeight="0.95" letterSpacing="-0.05em">
                {isCityMode
                  ? "Zoom into a city to explore individual Isha programs."
                  : "Find the right Isha offering near the centers you care about."}
              </Heading>
            </Box>

            {isCityMode ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="5">
                {groupedVisibleListings.map((city) => (
                  <Box
                    key={city.city}
                    bg="white"
                    borderRadius="28px"
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor="blackAlpha.100"
                    boxShadow="0 10px 30px rgba(17,17,17,0.06)"
                  >
                    <Image
                      src={city.image}
                      alt={city.city}
                      h="220px"
                      w="100%"
                      objectFit="cover"
                    />
                    <Stack gap="3" p="5">
                      <Flex align="start" justify="space-between" gap="4">
                        <Box>
                          <Text fontWeight="700" fontSize="xl" lineHeight="1.2">
                            {city.city}
                          </Text>
                          <Text color="gray.600">{city.state}</Text>
                        </Box>
                        <Badge rounded="full" px="3" py="1.5" bg="#111111" color="white">
                          {city.count} programs
                        </Badge>
                      </Flex>
                      <Text color="gray.600">
                        Average contribution level across current map view.
                      </Text>
                      <Text fontWeight="700">From Rs. {city.avgPrice} per program</Text>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} gap="5">
                {sortedListings.map((listing) => {
                  const isActive = listing.id === activeListingId;

                  return (
                    <ListingCard
                      key={listing.id}
                      isActive={isActive}
                      listing={listing}
                      onSelect={() => setActiveListingId(listing.id)}
                    />
                  );
                })}
              </SimpleGrid>
            )}
          </Stack>
        </Box>

        <Box
          position={{ base: "relative", lg: "sticky" }}
          top={{ lg: "81px" }}
          h={{ base: "420px", lg: "calc(100vh - 81px)" }}
          borderTopWidth={{ base: "1px", lg: "0" }}
          borderLeftWidth={{ lg: "1px" }}
          borderColor="blackAlpha.100"
        >
          <StayMap
            listings={listings}
            citySummaries={citySummaries}
            activeListingId={activeListingId}
            isCityMode={isCityMode}
            onSelect={setActiveListingId}
            onViewportChange={setViewport}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
}

type ListingCardProps = {
  listing: Listing;
  isActive: boolean;
  onSelect: () => void;
};

function ListingCard({ listing, isActive, onSelect }: ListingCardProps) {
  return (
    <chakra.button
      textAlign="left"
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      bg="white"
      borderRadius="28px"
      overflow="hidden"
      borderWidth="1px"
      borderColor={isActive ? "#111111" : "blackAlpha.100"}
      boxShadow={isActive ? "0 24px 44px rgba(17,17,17,0.16)" : "0 10px 30px rgba(17,17,17,0.06)"}
      transform={isActive ? "translateY(-4px)" : "none"}
      transition="all 0.22s ease"
    >
      <Box position="relative">
        <Image
          src={listing.image}
          alt={listing.title}
          h="260px"
          w="100%"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top="4"
          left="4"
          px="3"
          py="1.5"
          rounded="full"
          bg="rgba(255,255,255,0.88)"
          color="#111111"
          fontWeight="700"
        >
          {listing.tag}
        </Badge>
      </Box>

      <Stack gap="3" p="5">
        <Flex align="start" justify="space-between" gap="4">
          <Box>
            <Text fontWeight="700" fontSize="lg" lineHeight="1.2">
              {listing.title}
            </Text>
            <Text color="gray.600">{listing.location}</Text>
          </Box>
          <Text fontWeight="700">★ {listing.rating}</Text>
        </Flex>
        <Text color="gray.600">
          {listing.distance}
          <br />
          {listing.dates}
        </Text>
        <Text fontWeight="700">Rs. {listing.price} contribution</Text>
      </Stack>
    </chakra.button>
  );
}
