import React, { useState } from "react";
import { Crown, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { showToast } from "@repo/ui/Toast";
import { useTheme } from "../hooks/useTheme";

export const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { isDark } = useTheme();
	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const axiosResponse = await axios.post(
				`${BACKEND_URL}/user/signin`,
				{
					email: email,
					password: password,
				},
				{ withCredentials: true } // This helps BE to store cookies and other information
			);
			console.log(axiosResponse);

			if (axiosResponse.status === 200) {
				navigate("/dashboard");
			}
			setIsLoading(false);
		} catch (error) {
			if (error instanceof AxiosError) {
				showToast(
					error.response?.data.message || "Login Error",
					"error",
					isDark
				);
				setIsLoading(false);
			} else {
				showToast("Error while logging", "error", isDark);
			}
		}
	};

	return (
		<div
			className={`min-h-screen transition-all duration-500 select-none ${
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
									className={`h-10 w-10 ${
										isDark ? "text-gray-300" : "text-gray-700"
									}`}
								/>
							</div>
							<span
								className={`text-4xl font-bold ${
									isDark ? "text-white" : "text-black"
								}`}
							>
								Chess Verse
							</span>
						</div>

						<h1
							className={`text-5xl font-bold mb-6 ${
								isDark ? "text-white" : "text-black"
							}`}
						>
							Welcome Back
						</h1>

						<p
							className={`text-xl leading-relaxed ${
								isDark ? "text-gray-400" : "text-gray-600"
							}`}
						>
							Continue your chess journey and challenge players from around the
							world.
						</p>
					</div>
				</div>

				{/* Right Side - Login Form */}
				<div className="w-full lg:w-1/2 flex items-center justify-center p-8 select-none">
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
										className={`h-8 w-8 ${
											isDark ? "text-gray-300" : "text-gray-700"
										}`}
									/>
								</div>
								<span
									className={`text-3xl font-bold ${
										isDark ? "text-white" : "text-black"
									}`}
								>
									Chess Verse
								</span>
							</div>
							<h1
								className={`text-3xl font-bold ${
									isDark ? "text-white" : "text-black"
								}`}
							>
								Welcome Back
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
										Email Address
									</label>
									<div className="relative">
										<Mail
											className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
												isDark ? "text-gray-500" : "text-gray-400"
											}`}
										/>
										<input
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
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
									<div className="relative">
										<Lock
											className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
												isDark ? "text-gray-500" : "text-gray-400"
											}`}
										/>
										<input
											type={showPassword ? "text" : "password"}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-colors ${
												isDark
													? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
													: "bg-white border-gray-300 text-black placeholder-gray-400 focus:border-gray-500"
											} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
											placeholder="Enter your password"
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

								<div className="flex items-center justify-between">
									<label className="flex items-center">
										<input type="checkbox" className="rounded mr-2" />
										<span
											className={`text-sm ${
												isDark ? "text-gray-400" : "text-gray-600"
											}`}
										>
											Remember me
										</span>
									</label>
									<a
										href="#"
										className={`text-sm ${
											isDark
												? "text-gray-400 hover:text-gray-300"
												: "text-gray-600 hover:text-gray-800"
										} transition-colors`}
									>
										Forgot password?
									</a>
								</div>

								<button
									type="submit"
									disabled={isLoading}
									className={`w-full py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
										isDark
											? "bg-white text-black hover:bg-gray-100"
											: "bg-black text-white hover:bg-gray-900"
									} disabled:opacity-50 disabled:cursor-not-allowed`}
								>
									{isLoading ? "Signing In..." : "Sign In"}
								</button>

								<div className="text-center">
									<span
										className={`text-sm ${
											isDark ? "text-gray-400" : "text-gray-600"
										}`}
									>
										Don't have an account?{" "}
										<Link
											to="/signup"
											className={`font-semibold ${
												isDark
													? "text-white hover:text-gray-300"
													: "text-black hover:text-gray-700"
											} transition-colors`}
										>
											Sign up
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
