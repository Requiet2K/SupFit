import { ReactNode, createContext, useState } from 'react';

type LoadingContextType = {
    isLoadingScreen: boolean;
    setIsLoadingScreen: (value: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType>({
    isLoadingScreen: false,
    setIsLoadingScreen: () => {}
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoadingScreen, setIsLoadingScreen }}>
      {children}
    </LoadingContext.Provider>
  );
};