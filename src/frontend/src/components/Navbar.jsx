import { Link, useLocation } from 'react-router-dom';
import { Activity, Wallet, Gift, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate 1-second wallet connection delay
    setTimeout(() => {
      const mockAddress = '0x123...abc';
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setIsConnecting(false);
    }, 1000);
  };
  
  const handleDisconnect = () => {
    setWalletAddress('');
    setIsConnected(false);
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-white tracking-tight">
            Shelby Node: Enzamk Hub
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Network Status: Devnet</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex space-x-6">
            <NavLink to="/" isActive={location.pathname === '/'}>
              Dashboard
            </NavLink>
            <NavLink to="/upload" isActive={location.pathname === '/upload'}>
              Upload
            </NavLink>
          </div>
          
          {/* Wallet & Rewards Section */}
          <div className="flex items-center gap-3">
            {/* Claim Builder Rewards Button */}
            <button
              disabled={!isConnected}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isConnected
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
              title={isConnected ? 'Claim your builder rewards' : 'Connect wallet to claim rewards'}
            >
              <Gift className="w-4 h-4" />
              Claim Builder Rewards
            </button>
            
            {/* Connect Aptos Wallet Button */}
            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="relative flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 overflow-hidden group"
              >
                <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-indigo-600 to-emerald-600"></div>
                <div className="relative flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  <span className="font-mono">{walletAddress}</span>
                </div>
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="relative flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-indigo-600 to-emerald-600"></div>
                <div className="relative flex items-center gap-2">
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      Connect Aptos Wallet
                    </>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-white p-2"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            <div className="flex flex-col space-y-4">
              <NavLink to="/" isActive={location.pathname === '/'} onClick={() => setIsMobileMenuOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/upload" isActive={location.pathname === '/upload'} onClick={() => setIsMobileMenuOpen(false)}>
                Upload
              </NavLink>
            </div>
            
            {/* Mobile Wallet Section */}
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
              {/* Claim Builder Rewards Button */}
              <button
                disabled={!isConnected}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isConnected
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <Gift className="w-4 h-4" />
                Claim Builder Rewards
              </button>
              
              {/* Connect Aptos Wallet Button */}
              {isConnected ? (
                <button
                  onClick={handleDisconnect}
                  className="relative flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/20 overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-indigo-600 to-emerald-600"></div>
                  <div className="relative flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span className="font-mono">{walletAddress}</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="relative flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-emerald-500/20 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-indigo-600 to-emerald-600"></div>
                  <div className="relative flex items-center gap-2">
                    {isConnecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        Connect Aptos Wallet
                      </>
                    )}
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Wallet Connection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <button
              onClick={handleCloseModal}
              disabled={isConnecting}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                {isConnecting ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Wallet className="w-8 h-8 text-white" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                {isConnecting ? 'Connecting...' : 'Petra Wallet'}
              </h3>
              
              <p className="text-slate-400 text-sm mb-6">
                {isConnecting
                  ? 'Connecting to Petra Wallet...'
                  : 'Connect your Petra wallet to access all features'
                }
              </p>
              
              {isConnecting && (
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 h-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={`text-slate-400 hover:text-white transition-colors relative ${
        isActive ? 'text-white font-medium' : ''
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50"></span>
      )}
    </Link>
  );
}
