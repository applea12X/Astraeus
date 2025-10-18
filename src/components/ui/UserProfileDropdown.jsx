import { useState, useRef, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { User, LogOut, Settings, MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfileDropdown = ({ user, userProfile, onViewProfile, onSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setIsOpen(false);
  };

  const displayName = user?.displayName || userProfile?.firstName || 'User';
  const email = user?.email || '';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold shadow-lg">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-white font-semibold text-sm">{displayName}</div>
          <div className="text-blue-200 text-xs">{email}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden z-50"
          >
            {/* Profile Header */}
            <div className="p-6 bg-gradient-to-br from-red-600/20 to-purple-600/20 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{displayName}</h3>
                  <p className="text-blue-200 text-sm">{email}</p>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            {userProfile && (
              <div className="p-4 border-b border-white/10 space-y-3">
                {userProfile.phone && (
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>{userProfile.phone}</span>
                  </div>
                )}
                {userProfile.address && (
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span>{userProfile.address}</span>
                  </div>
                )}
                {userProfile.role && (
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="capitalize">{userProfile.role}</span>
                  </div>
                )}
              </div>
            )}

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  onViewProfile?.();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-all duration-200 text-left"
              >
                <User className="w-5 h-5 text-blue-400" />
                <span className="font-medium">View Profile</span>
              </button>
              
              <button
                onClick={() => {
                  onSettings?.();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-all duration-200 text-left"
              >
                <Settings className="w-5 h-5 text-purple-400" />
                <span className="font-medium">Settings</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 text-left mt-2 border-t border-white/10"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfileDropdown;

