import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
	const { login, googleLogin, isLoading, error } = useAuthStore(); 
	const [capVal, setCapVal] = useState(null);
	const [showCaptcha, setShowCaptcha] = useState(false);
	const [captchaForGoogle, setCaptchaForGoogle] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!showCaptcha) {
			setShowCaptcha(true);
		} else if (capVal) {
			await login(email, password);
		}
	};

	const handleGoogleLoginClick = (e) => {
		e.preventDefault();
		setCaptchaForGoogle(true);
		setShowCaptcha(true);
		console.log("Captcha for Google:", captchaForGoogle);
		console.log("Show Captcha:", showCaptcha);
	};

	const handleCaptchaChange = async (value) => {
		setCapVal(value);
		if (value) {
			if (captchaForGoogle) {
				await googleLogin();
				setCaptchaForGoogle(false);
			} else {
				await login(email, password);
			}
			setShowCaptcha(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Welcome Back
				</h2>

				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<div className="relative">
						<Input
							icon={Lock}
							type={showPassword ? 'text' : 'password'} // Toggle type based on showPassword
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{/* Eye icon for toggling password visibility */}
						<div
							className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <EyeOff size={20} color="#50C878" /> : <Eye size={20} color="#50C878" />}
						</div>
					</div>

					<div className='flex items-center mb-6'>
						<Link to='/forgot-password' className='text-sm text-green-400 hover:underline'>
							Forgot password?
						</Link>
					</div>
					{error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

					{showCaptcha && (
						<ReCAPTCHA
							sitekey="6LcpiXcqAAAAAFTRKphIkaBBXtJ0aQ_bOpRNaUG5"
							onChange={handleCaptchaChange}
						/>
					)}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Login"}
					</motion.button>

					{/* Google login button */}
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full mt-4 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						onClick={handleGoogleLoginClick}
						disabled={isLoading}
					>
						{isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Login with Google"}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Don't have an account?{" "}
					<Link to='/signup' className='text-green-400 hover:underline'>
						Sign up
					</Link>
				</p>
			</div>
		</motion.div>
	);
};

export default LoginPage;
