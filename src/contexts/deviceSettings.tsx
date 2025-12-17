"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface WirelessSettings {
  airplaneMode: boolean;
  wifiEnabled: boolean;
  wifiNetwork: string;
  wifiSignal: number;
  bluetoothEnabled: boolean;
}

interface DeviceSettingsContextType {
  wireless: WirelessSettings;
  setAirplaneMode: (enabled: boolean) => void;
  setWifiEnabled: (enabled: boolean) => void;
  setBluetoothEnabled: (enabled: boolean) => void;
}

const defaultSettings: WirelessSettings = {
  airplaneMode: false,
  wifiEnabled: true,
  wifiNetwork: "Home_Network",
  wifiSignal: 3,
  bluetoothEnabled: false,
};

const DeviceSettingsContext = createContext<DeviceSettingsContextType | null>(null);

export const DeviceSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wireless, setWireless] = useState<WirelessSettings>(defaultSettings);

  const setAirplaneMode = (enabled: boolean) => {
    setWireless(prev => ({
      ...prev,
      airplaneMode: enabled,
      // Airplane mode disables all wireless
      wifiEnabled: enabled ? false : prev.wifiEnabled,
      bluetoothEnabled: enabled ? false : prev.bluetoothEnabled,
    }));
  };

  const setWifiEnabled = (enabled: boolean) => {
    setWireless(prev => ({
      ...prev,
      wifiEnabled: enabled,
      // If enabling wifi, turn off airplane mode
      airplaneMode: enabled ? false : prev.airplaneMode,
    }));
  };

  const setBluetoothEnabled = (enabled: boolean) => {
    setWireless(prev => ({
      ...prev,
      bluetoothEnabled: enabled,
      // If enabling bluetooth, turn off airplane mode
      airplaneMode: enabled ? false : prev.airplaneMode,
    }));
  };

  return (
    <DeviceSettingsContext.Provider value={{
      wireless,
      setAirplaneMode,
      setWifiEnabled,
      setBluetoothEnabled,
    }}>
      {children}
    </DeviceSettingsContext.Provider>
  );
};

export const useDeviceSettings = () => {
  const context = useContext(DeviceSettingsContext);
  if (!context) {
    throw new Error("useDeviceSettings must be used within DeviceSettingsProvider");
  }
  return context;
};

