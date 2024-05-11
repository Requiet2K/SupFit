import { ReactNode, createContext, useEffect, useState } from 'react';

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

  useEffect(() => {
    if(isLoadingScreen){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "visible";
    }
  }, [isLoadingScreen])

  return (
    <LoadingContext.Provider value={{ isLoadingScreen, setIsLoadingScreen }}>
      {children}
    </LoadingContext.Provider>
  );
};