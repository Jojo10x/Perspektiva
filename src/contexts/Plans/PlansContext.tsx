import React, { ReactNode, createContext, useContext } from 'react';
import { useFirebasePlans } from '../../types/useFirebasePlans';
import {Plan} from '../../types/types'

interface PlansContextType {
    user: any;
    plans: { [key: string]: Plan[] };
    favoritePlans: Plan[];
    addPlan: (day: string, task: string) => Promise<void>;
    editPlan:(day: string, id: string) => Promise<void>;
    toggleStarPlan: (day: string, planId: string) => Promise<void>;
    completePlan: (day: string, id: string, completed: boolean) => Promise<void>;
    deletePlan: (day: string, id: string) => Promise<void>;
    savePlan: (day: string, id: string, task: string) => Promise<void>;
  
  }

type PlansProviderProps = {
    children: ReactNode;
    currentWeek: {
      start: Date;
      end: Date;
    };
  };

  const PlansContext = createContext<PlansContextType | null>(null);

export const PlansProvider = ({ children, currentWeek }:PlansProviderProps) => {
  const plansData = useFirebasePlans(currentWeek);

  return (
    <PlansContext.Provider value={plansData}>
      {children}
    </PlansContext.Provider>
  );
};

export const usePlans = () => {
    const context = useContext(PlansContext);
    if (!context) {
      throw new Error('usePlans must be used within a PlansProvider');
    }
    return context;
  };