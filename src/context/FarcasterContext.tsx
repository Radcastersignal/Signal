// src/context/FarcasterContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRealUser, RealUser } from "../hooks/useRealUser";

type FarcasterContextType = {
  user: RealUser | null;
  loading: boolean;
};

const FarcasterContext = createContext<FarcasterContextType>({
  user: null,
  loading: true,
});

export const FarcasterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useRealUser();
  const [currentUser, setCurrentUser] = useState<RealUser | null>(null);

  useEffect(() => {
    if (!loading && user) {
      console.log("✅ Farcaster user connected:", user);
      setCurrentUser(user);
    }
  }, [user, loading]);

  return (
    <FarcasterContext.Provider value={{ user: currentUser, loading }}>
      {children}
    </FarcasterContext.Provider>
  );
};

export const useFarcaster = () => useContext(FarcasterContext);
