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
import { EyeIcon, EyeOffIcon, Sparkles, Chrome } from "lucide-react";
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase/config";
import AnimatedShaderBackground from "./animated-shader-background";

const AstraeusLogo = (props) => (
  <div className="relative inline-flex items-center justify-center">
    <Sparkles className="w-16 h-16 text-red-600 animate-pulse" {...props} />
  </div>
);

export default function SignInForm({ onSignUp }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User is automatically redirected by App.jsx's onAuthStateChanged
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

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
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed';
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
            
            <CardHeader className="relative space-y-3 text-center mb-2 mt-6">
              <div className="flex justify-center">
                <AstraeusLogo />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                  Welcome to Astraeus
                </h2>
                <p className="text-blue-200/80 text-sm mt-2">
                  Continue your journey through the cosmos
                </p>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-5 px-8">
              <form onSubmit={handleEmailPasswordSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90">Email address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@astraeus.space"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:bg-white/20 focus:border-blue-400/50 transition-all"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="password" className="text-white/90">Password</Label>
                    <a 
                      href="#" 
                      className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                    >
                      Reset password
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 backdrop-blur-sm focus:bg-white/20 focus:border-blue-400/50 transition-all pe-10"
                      placeholder="Enter your password"
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <button
                      className="text-white/60 hover:text-white absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-colors outline-none focus:z-10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        isPasswordVisible ? "Hide password" : "Show password"
                      }
                      aria-pressed={isPasswordVisible}
                      aria-controls="password"
                      disabled={loading}
                    >
                      {isPasswordVisible ? (
                        <EyeOffIcon size={16} aria-hidden="true" />
                      ) : (
                        <EyeIcon size={16} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked)}
                    className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    disabled={loading}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal text-white/70">
                    Remember me
                  </Label>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all border-0" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Launching..." : "Launch Mission"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all" 
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <Chrome className="mr-2 h-4 w-4 text-blue-400" />
                    Sign in with Google
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="relative flex justify-center border-t border-white/10 !py-4 backdrop-blur-sm">
              <p className="text-center text-sm text-white/70">
                New to Astraeus?{" "}
                <button 
                  onClick={onSignUp}
                  className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer bg-transparent border-none p-0 transition-colors"
                  disabled={loading}
                >
                  Sign up
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
