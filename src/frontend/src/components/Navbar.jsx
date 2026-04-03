import { Link, useLocation } from 'react-router-dom';
import { Activity, Wallet, Gift, Menu, X, Lock } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

export default function Navbar() {
  const location = useLocation();
  const { isConnected, walletAddress, isConnecting, handleConnect, handleDisconnect } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
              <span className="flex items-center gap-2">
                Upload
                {!isConnected && <Lock className="w-3 h-3 text-amber-500" />}
              </span>
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
