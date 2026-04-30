import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loaderTrigger } from "@/utils/loaderTrigger";

interface LoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to external loader triggers (like from Axios)
    const unsubscribe = loaderTrigger.subscribe((loading) => {
      setIsLoading(loading);
    });

    return () => unsubscribe();
  }, []);

  const showLoader = () => loaderTrigger.show();
  const hideLoader = () => loaderTrigger.hide();

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};
