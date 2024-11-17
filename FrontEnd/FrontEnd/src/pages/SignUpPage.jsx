import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import ReCAPTCHA from "react-google-recaptcha";

import File from "../assets/folder-fill.svg";
import sideIMG from "../assets/sideIMG-2.svg";
import buksuLOGO from "../assets/buksu-white.png";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaForGoogle, setCaptchaForGoogle] = useState(false);
  const [capVal, setCapVal] = useState(null);
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = (e) => {
    e.preventDefault();
    setCaptchaForGoogle(false); 
    setShowCaptcha(true); 
  };

  const handleGoogleSignUp = (e) => {
    e.preventDefault();
    setCaptchaForGoogle(true); 
    setShowCaptcha(true); 
  };

  const handleCaptchaChange = async (value) => {
    setCapVal(value);
    if (value) {
      if (captchaForGoogle) {
        
        window.location.href = "http://localhost:5000/auth/google";
        setCaptchaForGoogle(false);
      } else {
        
        try {
          await signup(email, password, name);
          navigate("/verify-email");
        } catch (error) {
          console.log(error);
        }
      }
      setShowCaptcha(false); 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-screen bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl overflow-hidden"
    >
      <section className="h-screen bg-white dark:bg-gray-900">
        <div className="grid h-full grid-cols-12">
          <section className="relative flex h-full items-end bg-gray-900 col-span-5 xl:col-span-6">
            <img
              alt=""
              src={sideIMG}
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
              <img
                src={buksuLOGO}
                alt="Buksu Logo"
                title="Bukidnon State University"
                className="w-32 h-32 sm:w-32 sm:h-32"
              />
            </div>
            <div className="hidden relative p-12 lg:block">
              <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl flex items-center">
                Welcome to Syllabus Checker{" "}
                <img
                  src={File}
                  alt="CITL Logo"
                  className="w-10 h-10 sm:w-20 sm:h-20"
                />
              </h2>
              <p className="mt-4 leading-relaxed text-white/90">
                Our platform simplifies syllabus review and finalization for
                Bukidnon State University instructors and checkers.
              </p>
            </div>
          </section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 col-span-7 xl:col-span-6">
            <div className="max-w-lg lg:max-w-2xl">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                Create Account
              </h2>

              <form onSubmit={handleSignUp} className="space-y-4">
                <Input
                  icon={User}
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-lg"
                />
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-lg"
                />
                <div className="relative">
                  <Input
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-lg"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#50C878" />
                    ) : (
                      <Eye size={20} color="#50C878" />
                    )}
                  </div>
                </div>

                {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
                <PasswordStrengthMeter password={password} />

                {showCaptcha && (
                  <div className="mt-4">
                    <ReCAPTCHA
                      sitekey="6LcpiXcqAAAAAFTRKphIkaBBXtJ0aQ_bOpRNaUG5"
                      onChange={handleCaptchaChange}
                    />
                  </div>
                )}

                <motion.button
                  className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                  font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                  focus:ring-offset-gray-900 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="animate-spin mx-auto" size={24} />
                  ) : (
                    "Sign Up"
                  )}
                </motion.button>
              </form>

              <div className="flex items-center my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-500">OR</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

              <motion.button
                className='w-full mt-4 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignUp}
              >
                <div className="flex items-center justify-center space-x-3">
                  <img
                    src="https://img.icons8.com/color/16/000000/google-logo.png"
                    alt="Google logo"
                    className="w-6 h-6"
                  />
                  <span>Sign Up with Google</span>
                </div>
              </motion.button>

              <div className="flex justify-center mt-4">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="text-green-400 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </main>
        </div>
      </section>
    </motion.div>
  );
};

export default SignUpPage;
