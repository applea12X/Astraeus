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
    <div className="relative min-h-screen overflow-auto">
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

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="relative p-8 bg-gradient-to-br from-red-600/20 to-purple-600/20 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-4xl shadow-xl">
                    {(displayData?.firstName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {displayData?.firstName} {displayData?.lastName}
                    </h1>
                    <p className="text-blue-200 text-lg">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2 text-white/60 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {joinDate}</span>
                    </div>
                  </div>
                </div>
                
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <Label className="text-white/90 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.firstName || ''}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <p className="text-white text-lg">{displayData?.firstName || 'Not provided'}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label className="text-white/90 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.lastName || ''}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  ) : (
                    <p className="text-white text-lg">{displayData?.lastName || 'Not provided'}</p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label className="text-white/90 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <p className="text-white/60 text-lg">{user?.email}</p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-white/90 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="+1 (555) 123-4567"
                    />
                  ) : (
                    <p className="text-white text-lg">{displayData?.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-white/90 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="123 Main St, City, State, ZIP"
                    />
                  ) : (
                    <p className="text-white text-lg">{displayData?.address || 'Not provided'}</p>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label className="text-white/90 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Role
                  </Label>
                  <p className="text-white text-lg capitalize">{displayData?.role || 'Not provided'}</p>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label className="text-white/90 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <p className="text-white text-lg">{displayData?.username || 'Not provided'}</p>
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

