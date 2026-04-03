import { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Load wallet state from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    const savedConnected = localStorage.getItem('isConnected');
    if (savedAddress && savedConnected === 'true') {
      setWalletAddress(savedAddress);
      setIsConnected(true);
    }
  }, []);

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate 1-second wallet connection delay
    setTimeout(() => {
      const mockAddress = '0x123...abc';
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setIsConnecting(false);
      
      // Save to localStorage
      localStorage.setItem('walletAddress', mockAddress);
      localStorage.setItem('isConnected', 'true');
    }, 1000);
  };
  
  const handleDisconnect = () => {
    setWalletAddress('');
    setIsConnected(false);
    
    // Clear from localStorage
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('isConnected');
  };

  const value = {
    isConnected,
    walletAddress,
    isConnecting,
    handleConnect,
    handleDisconnect
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
