import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Mail, Lock, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';

const SignInPage = ({ onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user starts typing
  };

  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        setError('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setError('Signed in successfully!');
      }
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setError('Google sign-in successful!');
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
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Cosmic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1759480804632-47abee1ccd3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFyZmllbGQlMjBuaWdodCUyMHNreXxlbnwxfHx8fDE3NjA4MjI2NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      
      {/* Animated Stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

       {/* Back Button */}
       {onBack && (
         <motion.button
           onClick={onBack}
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.1, duration: 0.5 }}
           className="absolute top-6 left-6 z-20 flex items-center justify-center text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20"
         >
           <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
           Back to home
         </motion.button>
       )}

       {/* Sign In Card */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
         className="relative z-10 w-full max-w-md mx-4"
       >
         <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
           {/* Header */}
           <div className="text-center mb-8">
             <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.2, duration: 0.5 }}
               className="flex justify-center mb-4"
             >
               <div className="relative">
                 <Sparkles className="w-12 h-12 text-purple-300" />
                 <motion.div
                   className="absolute inset-0"
                   animate={{
                     rotate: 360,
                   }}
                   transition={{
                     duration: 20,
                     repeat: Infinity,
                     ease: "linear",
                   }}
                 >
                   <Sparkles className="w-12 h-12 text-blue-300 opacity-50" />
                 </motion.div>
               </div>
             </motion.div>
             <h1 className="text-white mb-2 text-2xl font-bold">
               {isSignUp ? 'Create Account' : 'Welcome Back'}
             </h1>
             <p className="text-purple-200">
               {isSignUp ? 'Join the cosmic journey' : 'Sign in to continue your cosmic journey'}
             </p>
           </div>

           {/* Form */}
           <form onSubmit={handleEmailPasswordAuth} className="space-y-6">
             {/* Email Field */}
             <div className="space-y-2">
               <label htmlFor="email" className="text-white text-sm font-medium">
                 Email
               </label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                 <input
                   id="email"
                   name="email"
                   type="email"
                   value={formData.email}
                   onChange={handleInputChange}
                   placeholder="your@email.com"
                   className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-purple-200/50 focus:border-purple-400 focus:ring-purple-400/30 focus:outline-none transition-all"
                   required
                 />
               </div>
             </div>

             {/* Password Field */}
             <div className="space-y-2">
               <label htmlFor="password" className="text-white text-sm font-medium">
                 Password
               </label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                 <input
                   id="password"
                   name="password"
                   type={showPassword ? 'text' : 'password'}
                   value={formData.password}
                   onChange={handleInputChange}
                   placeholder="Enter your password"
                   className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-purple-200/50 focus:border-purple-400 focus:ring-purple-400/30 focus:outline-none transition-all"
                   required
                 />
                 <button
                   type="button"
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-200"
                   onClick={() => setShowPassword(!showPassword)}
                 >
                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
               </div>
             </div>

             {/* Confirm Password Field (only for sign up) */}
             {isSignUp && (
               <div className="space-y-2">
                 <label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                   Confirm Password
                 </label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                   <input
                     id="confirmPassword"
                     name="confirmPassword"
                     type="password"
                     value={formData.confirmPassword}
                     onChange={handleInputChange}
                     placeholder="Confirm your password"
                     className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-purple-200/50 focus:border-purple-400 focus:ring-purple-400/30 focus:outline-none transition-all"
                     required
                   />
                 </div>
               </div>
             )}

             {/* Remember Me & Forgot Password */}
             {!isSignUp && (
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <input
                     type="checkbox"
                     id="remember"
                     checked={rememberMe}
                     onChange={(e) => setRememberMe(e.target.checked)}
                     className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                   />
                   <label
                     htmlFor="remember"
                     className="text-purple-200 cursor-pointer select-none text-sm"
                   >
                     Remember me
                   </label>
                 </div>
                 <button
                   type="button"
                   className="text-purple-300 hover:text-purple-200 transition-colors text-sm"
                 >
                   Forgot password?
                 </button>
               </div>
             )}

             {/* Error Message */}
             {error && (
               <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 px-4 py-3 rounded-lg text-sm">
                 {error}
               </div>
             )}

             {/* Submit Button */}
             <motion.div
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
             >
               <button
                 type="submit"
                 disabled={loading}
                 className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-purple-500/50 py-3 px-6 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {loading ? (
                   <div className="flex items-center justify-center">
                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                     {isSignUp ? 'Creating account...' : 'Signing in...'}
                   </div>
                 ) : (
                   <div className="flex items-center justify-center">
                     {isSignUp ? 'Create Account' : 'Sign In'}
                     <ArrowRight className="ml-2 h-4 w-4" />
                   </div>
                 )}
               </button>
             </motion.div>
           </form>

           {/* Footer */}
           <div className="mt-6 text-center">
             <p className="text-purple-200 text-sm">
               {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
               <button 
                 type="button"
                 onClick={() => setIsSignUp(!isSignUp)}
                 className="text-purple-300 hover:text-white transition-colors font-medium"
               >
                 {isSignUp ? 'Sign in' : 'Sign up'}
               </button>
             </p>
           </div>

           {/* Divider */}
           <div className="relative my-6">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-white/30" />
             </div>
             <div className="relative flex justify-center text-sm">
               <span className="px-2 bg-transparent text-white/70">Or continue with</span>
             </div>
           </div>

           {/* Google Sign In Button */}
           <motion.div
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
           >
             <button
               type="button"
               onClick={handleGoogleSignIn}
               disabled={loading}
               className="w-full flex justify-center items-center py-3 px-6 border border-white/30 rounded-lg shadow-sm bg-white/10 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                 <path
                   fill="#4285F4"
                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                 />
                 <path
                   fill="#34A853"
                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                 />
                 <path
                   fill="#FBBC05"
                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                 />
                 <path
                   fill="#EA4335"
                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.⁻ 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                 />
               </svg>
               Continue with Google
             </button>
           </motion.div>
         </div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 2,
          }}
         />
       </motion.div>
     </div>
   );
 };

 export default SignInPage;
