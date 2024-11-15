import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import ReCAPTCHA from "react-google-recaptcha";

import sideIMG from '../assets/sideIMG-3.svg'
import buksuLOGO from '../assets/buksu-white.png'

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
			className='w-full h-screen bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl overflow-hidden'
		>
			<section className="h-screen bg-white dark:bg-gray-900">
				<div className="grid h-full grid-cols-12">
					<section className="relative flex h-full items-end bg-gray-900 col-span-5 xl:col-span-6">
						<img
							alt=""
							src={sideIMG}
							// src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
							className="absolute inset-0 h-full w-full object-cover opacity-80"
						/>

						<div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4"
							style={{ top: "-83%", left: "-85%" }}>
							
							<img 
							src={buksuLOGO} 
							alt="Buksu Logo" 
							title="Bukidnon State University"
							className="w-1 h-1 sm:w-32 sm:h-32 md:w-4 md:h-4 lg:w-20 lg:h-20"
							/>
						</div>

						<div className="hidden relative p-12 lg:block">
							<a className="block text-white" href="#">
								<span className="sr-only">Home</span>
							</a>
							<h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">Syllabus Checker </h2>
							<p className="mt-4 leading-relaxed text-white/90">
							Our platform simplifies syllabus review and finalization for Bukidnon State University instructors and checkers.
							</p>
						</div>
					</section>
	
					<main className="flex items-center justify-center px-8 py-8 sm:px-12 col-span-7 px-16 py-12 xl:col-span-6">
						<div className="max-w-xl lg:max-w-3xl">
							<div className="relative -mt-16 block lg:hidden"></div>
	
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
											type={showPassword ? 'text' : 'password'}
											placeholder='Password'
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
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
						</div>
					</main>
				</div>
			</section>
		</motion.div>
	);
	
};

export default LoginPage;
