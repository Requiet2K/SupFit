import { ReactNode } from "react";
import { CartProvider } from "./CartContext";
import { LoadingProvider } from "./LoadingContext";

export const CombinedProvider = ({ children }: { children: ReactNode }) => {
    return (
      <CartProvider>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </CartProvider>
    );
};