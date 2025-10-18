import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rocket, Satellite, Star, Eye, EyeOff, Sparkles, Chrome } from "lucide-react";
import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/config";
import AnimatedShaderBackground from "./animated-shader-background";

const AstraeusLogo = (props) => (
  <div className="relative inline-flex items-center justify-center">
    <Sparkles className="w-16 h-16 text-blue-400 animate-pulse" {...props} />
  </div>
);

export default function SignUpForm({ onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "explorer"
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleEmailPasswordSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!termsAccepted) {
      setError("Please accept the Terms and Conditions");
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      // Update user profile with display name
      const displayName = `${formData.firstName} ${formData.lastName}`.trim();
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }

      // User is automatically redirected by App.jsx's onAuthStateChanged
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");

    if (!termsAccepted) {
      setError("Please accept the Terms and Conditions");
      setLoading(false);
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // User is automatically redirected by App.jsx's onAuthStateChanged
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled';
      case 'auth/popup-closed-by-user':
        return 'Sign-up popup was closed';
      default:
        return 'An error occurred. Please try again';
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-auto">
      {/* Animated Space Background */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <AnimatedShaderBackground />
      </div>

      {/* Background Gradient Overlay */}
      <div 
        className="fixed inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%)',
          zIndex: 1
        }}
      />

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-screen py-12 px-4" style={{ zIndex: 10 }}>
        <div className="w-full max-w-md">
          {/* Glass-morphism Card */}
          <Card className="border border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl pb-0 overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            
            <CardHeader className="relative flex flex-col items-center space-y-3 pb-4 pt-8">
              <AstraeusLogo className="w-16 h-16 mb-2" />
              <div className="space-y-1 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                  Join Astraeus
                </h2>
                <p className="text-blue-200/80 text-center">
                  Begin your journey through the stars
                </p>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-5 px-8 pb-6">
              <form onSubmit={handleEmailPasswordSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white/90">Role</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange} disabled={loading}>
                    <SelectTrigger
                      id="role"
                      className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-all [&>span]:flex [&>span]:items-center [&>span]:gap-2"
                    >
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 border-white/20 backdrop-blur-xl text-white">
                      <SelectItem value="explorer" className="focus:bg-blue-600/50 focus:text-white">
                        <Rocket size={16} aria-hidden="true" />
                        <span className="truncate">Space Explorer</span>
                      </SelectItem>
                      <SelectItem value="navigator" className="focus:bg-blue-600/50 focus:text-white">
                        <Satellite size={16} aria-hidden="true" />
                        <span className="truncate">Navigator</span>
                      </SelectItem>
                      <SelectItem value="commander" className="focus:bg-blue-600/50 focus:text-white">
                        <Star size={16} aria-hidden="true" />
                        <span className="truncate">Mission Commander</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white/90">First name</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:bg-white/20 focus:border-blue-400/50 transition-all"
                      placeholder="John"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white/90">Last name</Label>
                    <Input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:bg-white/20 focus:border-blue-400/50 transition-all"
                      placeholder="Doe"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white/90">Username</Label>
                  <Input 
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:bg-white/20 focus:border-blue-400/50 transition-all"
                    placeholder="starwalker"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">Email address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:bg-white/20 focus:border-blue-400/50 transition-all"
                    placeholder="you@astraeus.space"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:bg-white/20 focus:border-blue-400/50 transition-all pr-10"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-white/60 hover:text-white hover:bg-white/10"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked)}
                    className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="text-sm text-white/70">
                    I agree to the{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                      Conditions
                    </a>
                  </label>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all border-0"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Launching..." : "Launch Your Journey"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all" 
                    type="button"
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                  >
                    <Chrome className="mr-2 h-4 w-4 text-blue-400" />
                    Sign up with Google
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="relative flex justify-center border-t border-white/10 !py-4 backdrop-blur-sm">
              <p className="text-center text-sm text-white/70">
                Already have an account?{" "}
                <button 
                  onClick={onSignIn}
                  className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer bg-transparent border-none p-0 transition-colors"
                  disabled={loading}
                >
                  Sign in
                </button>
              </p>
            </CardFooter>
          </Card>

          {/* Ambient glow effects */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
        </div>
      </div>
    </div>
  );
}
