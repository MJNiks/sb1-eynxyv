import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ClinicInfo {
  name: string;
  logo: string;
}

interface ClinicContextType {
  clinicInfo: ClinicInfo;
  updateClinicInfo: (info: Partial<ClinicInfo>) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const useClinicContext = () => {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error('useClinicContext must be used within a ClinicProvider');
  }
  return context;
};

export const ClinicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>({
    name: 'City Health Clinic',
    logo: 'https://placehold.co/100x100?text=CH',
  });

  const updateClinicInfo = (info: Partial<ClinicInfo>) => {
    setClinicInfo(prevInfo => ({ ...prevInfo, ...info }));
  };

  return (
    <ClinicContext.Provider value={{ clinicInfo, updateClinicInfo }}>
      {children}
    </ClinicContext.Provider>
  );
};