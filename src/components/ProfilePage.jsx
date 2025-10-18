import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, X, ArrowLeft } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase/config';
import AnimatedShaderBackground from './ui/animated-shader-background';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const ProfilePage = ({ user, onBack }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile(data);
        setEditedProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), editedProfile);
      
      // Update Auth profile
      const displayName = `${editedProfile.firstName} ${editedProfile.lastName}`.trim();
      await updateProfile(auth.currentUser, { displayName });
      
      setUserProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const displayData = isEditing ? editedProfile : userProfile;
  const joinDate = userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A';

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-auto">
      {/* Background */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <AnimatedShaderBackground />
      </div>
      <div 
        className="fixed inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%)',
          zIndex: 1
        }}
      />

      {/* Content - Centered */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 space-y-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Home</span>
        </motion.button>

        {/* Profile Cards Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Profile Header Card */}
          <div className="w-full bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative px-10 py-12 bg-gradient-to-br from-red-600/20 to-purple-600/20">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full md:w-auto">
                  {/* Avatar */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-6xl shadow-2xl ring-4 ring-white/30">
                    {(displayData?.firstName || 'U').charAt(0).toUpperCase()}
                  </div>
                  
                  {/* User Info */}
                  <div className="text-center md:text-left space-y-3">
                    <h1 className="text-5xl font-bold text-white">
                      {displayData?.firstName} {displayData?.lastName}
                    </h1>
                    <p className="text-blue-200 text-xl flex items-center justify-center md:justify-start gap-3">
                      <Mail className="w-6 h-6" />
                      {user?.email}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-white/70 text-base">
                      <Calendar className="w-5 h-5" />
                      <span>Member since {joinDate}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto text-lg font-semibold"
                    >
                      <Edit2 className="w-5 h-5 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 h-auto text-lg font-semibold"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 px-8 py-4 h-auto text-lg font-semibold"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Card */}
          <div className="w-full bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-10 py-12">
              {/* Section Header */}
              <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
                <User className="w-8 h-8 text-blue-400" />
                Personal Information
              </h2>
              
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {/* First Name */}
                <div className="space-y-4">
                  <Label className="text-white font-semibold flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-blue-400" />
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.firstName || ''}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="bg-white/10 border-white/20 text-white h-14 text-lg px-5"
                    />
                  ) : (
                    <p className="text-white text-xl bg-white/5 px-5 py-4 rounded-xl border border-white/10">
                      {displayData?.firstName || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-4">
                  <Label className="text-white font-semibold flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-blue-400" />
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.lastName || ''}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="bg-white/10 border-white/20 text-white h-14 text-lg px-5"
                    />
                  ) : (
                    <p className="text-white text-xl bg-white/5 px-5 py-4 rounded-xl border border-white/10">
                      {displayData?.lastName || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-4">
                  <Label className="text-white font-semibold flex items-center gap-2 text-lg">
                    <Mail className="w-5 h-5 text-purple-400" />
                    Email Address
                  </Label>
                  <p className="text-white/70 text-xl bg-white/5 px-5 py-4 rounded-xl border border-white/10">
                    {user?.email}
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-4">
                  <Label className="text-white font-semibold flex items-center gap-2 text-lg">
                    <Phone className="w-5 h-5 text-green-400" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="bg-white/10 border-white/20 text-white h-14 text-lg px-5"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <p className="text-white text-xl bg-white/5 px-5 py-4 rounded-xl border border-white/10">
                      {displayData?.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-4">
                  <Label className="text-white font-semibold flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-orange-400" />
                    Username
                  </Label>
                  <p className="text-white text-xl bg-white/5 px-5 py-4 rounded-xl border border-white/10">
                    {displayData?.username || 'Not provided'}
                  </p>
                </div>

                {/* Role */}
                <div className="space-y-4">
                  <Label className="text-white font-semibold flex items-center gap-2 text-lg">
                    <Briefcase className="w-5 h-5 text-pink-400" />
                    Role
                  </Label>
                  <p className="text-white text-xl bg-white/5 px-5 py-4 rounded-xl border border-white/10 capitalize">
                    {displayData?.role || 'Not provided'}
                  </p>
                </div>

                {/* Address - Full Width */}
                <div className="space-y-4 md:col-span-2">
                  <Label className="text-white font-semibold flex items-center gap-2 text-lg">
                    <MapPin className="w-5 h-5 text-red-400" />
                    Address
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="bg-white/10 border-white/20 text-white h-14 text-lg px-5"
                      placeholder="123 Main St, City, State, ZIP"
                    />
                  ) : (
                    <p className="text-white text-xl bg-white/5 px-5 py-4 rounded-xl border border-white/10">
                      {displayData?.address || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
