import React, { createContext, useContext, useState } from 'react';
import ChannelLayer from './TubeLayer/layers/undergroundLayers/ChannelLayer';

const ChannelLayerContext = createContext<ChannelLayer | null>(null);

export const ChannelLayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [channelLayer, setChannelLayer] = useState<ChannelLayer | null>(null);

  return (
    <ChannelLayerContext.Provider value={channelLayer}>
      {children}
    </ChannelLayerContext.Provider>
  );
};

export const useAppContext = () => useContext(ChannelLayerContext);