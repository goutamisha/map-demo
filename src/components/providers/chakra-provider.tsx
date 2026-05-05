"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type { ReactNode } from "react";

type AppChakraProviderProps = {
  children: ReactNode;
};

export function AppChakraProvider({
  children,
}: AppChakraProviderProps) {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
}
