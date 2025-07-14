import React, { useState } from "react";
import { Crown, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

interface SignupProps {
	isDark: boolean;
}

export const SignUp: React.FC<SignupProps> = ({ isDark }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			alert("Passwords do not match!");
			return;
		}

		setIsLoading(true);

		const axiosRequest = await axios.post(
			"http://localhost:8080/api/v1/user/signup",
			{
				name: formData.name,
				email: formData.email,
				password: formData.password,
			}
		);
		console.log(axiosRequest);
		// axiosRequest ? (window.location.href = "/dashboard") : null;
		setIsLoading(false);
	};

	return (
		<div
			className={`min-h-screen transition-all duration-500 ${
				isDark ? "bg-black" : "bg-white"
			}`}
		>
			{/* Background Pattern */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div
					className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-5 animate-pulse ${
						isDark ? "bg-gray-400" : "bg-gray-600"
					}`}
				></div>
				<div
					className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-5 animate-pulse delay-1000 ${
						isDark ? "bg-gray-500" : "bg-gray-500"
					}`}
				></div>
			</div>

			<div className="relative z-10 flex min-h-screen">
				{/* Left Side - Branding */}
				<div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12">
					<div className="max-w-md">
						<div className="flex items-center space-x-3 mb-8">
							<div
								className={`p-3 rounded-xl ${
									isDark
										? "bg-gray-800 border border-gray-700"
										: "bg-gray-100 border border-gray-200"
								}`}
							>
								<Crown
									className={`h-10 w-10 ${isDark ? "text-gray-300" : "text-gray-700"}`}
								/>
							</div>
							<span
								className={`text-4xl font-bold ${isDark ? "text-white" : "text-black"}`}
							>
								Chess Verse
							</span>
						</div>

						<h1
							className={`text-5xl font-bold mb-6 ${isDark ? "text-white" : "text-black"}`}
						>
							Join the Elite
						</h1>

						<p
							className={`text-xl leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}
						>
							Start your journey to becoming a chess grandmaster. Join millions
							of players worldwide.
						</p>
					</div>
				</div>

				{/* Right Side - Signup Form */}
				<div className="w-full lg:w-1/2 flex items-center justify-center p-8">
					<div className="w-full max-w-md">
						{/* Mobile Header */}
						<div className="lg:hidden text-center mb-8">
							<div className="flex items-center justify-center space-x-3 mb-4">
								<div
									className={`p-2 rounded-xl ${
										isDark
											? "bg-gray-800 border border-gray-700"
											: "bg-gray-100 border border-gray-200"
									}`}
								>
									<Crown
										className={`h-8 w-8 ${isDark ? "text-gray-300" : "text-gray-700"}`}
									/>
								</div>
								<span
									className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}
								>
									Chess Verse
								</span>
							</div>
							<h1
								className={`text-3xl font-bold ${isDark ? "text-white" : "text-black"}`}
							>
								Join the Elite
							</h1>
						</div>

						<div
							className={`rounded-2xl p-8 ${
								isDark
									? "bg-gray-900 border border-gray-800"
									: "bg-gray-50 border border-gray-200 shadow-xl"
							}`}
						>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label
										className={`block text-sm font-medium mb-2 select-none ${
											isDark ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Full Name
									</label>
									<div className="relative select-none">
										<User
											className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
												isDark ? "text-gray-500" : "text-gray-400"
											}`}
										/>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleChange}
											className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
												isDark
													? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
													: "bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
											} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
											placeholder="Enter your full name"
											required
										/>
									</div>
								</div>

								<div>
									<label
										className={`block text-sm font-medium mb-2 select-none ${
											isDark ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Email Address
									</label>
									<div className="relative select-none">
										<Mail
											className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
												isDark ? "text-gray-500" : "text-gray-400"
											}`}
										/>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
												isDark
													? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
													: "bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
											} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
											placeholder="Enter your email"
											required
										/>
									</div>
								</div>

								<div>
									<label
										className={`block text-sm font-medium mb-2 select-none ${
											isDark ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Password
									</label>
									<div className="relative select-none">
										<Lock
											className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
												isDark ? "text-gray-500" : "text-gray-400"
											}`}
										/>
										<input
											type={showPassword ? "text" : "password"}
											name="password"
											value={formData.password}
											onChange={handleChange}
											className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
												isDark
													? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
													: "bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
											} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
											placeholder="Create a password"
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
												isDark
													? "text-gray-500 hover:text-gray-400"
													: "text-gray-400 hover:text-gray-600"
											}`}
										>
											{showPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
								</div>

								<div>
									<label
										className={`block text-sm font-medium mb-2 select-none ${
											isDark ? "text-gray-300" : "text-gray-700"
										}`}
									>
										Confirm Password
									</label>
									<div className="relative select-none">
										<Lock
											className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
												isDark ? "text-gray-500" : "text-gray-400"
											}`}
										/>
										<input
											type={showConfirmPassword ? "text" : "password"}
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleChange}
											className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
												isDark
													? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
													: "bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
											} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
											placeholder="Confirm your password"
											required
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
												isDark
													? "text-gray-500 hover:text-gray-400"
													: "text-gray-400 hover:text-gray-600"
											}`}
										>
											{showConfirmPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
								</div>

								<div className="flex items-center select-none">
									<input type="checkbox" className="rounded mr-2" required />
									<span
										className={`text-sm select-none ${isDark ? "text-gray-400" : "text-gray-600"}`}
									>
										I agree to the{" "}
										<a
											href="#"
											className={`${
												isDark
													? "text-white hover:text-gray-300"
													: "text-black hover:text-gray-700"
											} transition-colors`}
										>
											Terms of Service
										</a>{" "}
										and{" "}
										<a
											href="#"
											className={`${
												isDark
													? "text-white hover:text-gray-300"
													: "text-black hover:text-gray-700"
											} transition-colors`}
										>
											Privacy Policy
										</a>
									</span>
								</div>

								<button
									type="submit"
									disabled={isLoading}
									className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-105 select-none ${
										isDark
											? "bg-white text-black hover:bg-gray-100"
											: "bg-black text-white hover:bg-gray-900"
									} disabled:opacity-50 disabled:cursor-not-allowed`}
								>
									{isLoading ? "Creating Account..." : "Create Account"}
								</button>

								<div className="text-center select-none">
									<span
										className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
									>
										Already have an account?{" "}
										<Link
											to="/login"
											className={`font-semibold ${
												isDark
													? "text-white hover:text-gray-300"
													: "text-black hover:text-gray-700"
											} transition-colors`}
										>
											Sign in
										</Link>
									</span>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};