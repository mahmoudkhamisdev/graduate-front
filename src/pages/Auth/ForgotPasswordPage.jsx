import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Snowflake,
  ArrowLeft,
  Mail,
  KeyRound,
  CheckCircle2,
  EyeOff,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SecondaryButton } from "../../components/common/Customs/SecondaryButton";
import { CustomInput } from "../../components/common/Customs/CustomInput";
import { MainButton } from "../../components/common/Customs/MainButton";
import { LinkButton } from "../../components/common/Customs/LinkButton";
import axios from "axios";
import { toast } from "sonner";
import { BaseUrlApi, ErrorMessage } from "../../lib/api";
import Cookie from "js-cookie";

export function ForgotPasswordPage({ onComplete }) {
  const navigate = useNavigate();

  // Step can be: "email" | "verification" | "reset" | "success"
  const [step, setStep] = useState("email");

  // Email step state
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verification step state
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [verificationError, setVerificationError] = useState("");
  const inputRefs = useRef([]);

  // Reset-password step state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");

  // Show/hide toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onBack = () => navigate(-1);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return setError("Email is invalid");

    try {
      setError("");
      setIsSubmitting(true);
      await axios.post(`${BaseUrlApi}/auth/forgot-password`, { email });
      toast.success("Check your email for the verification code.");
      setStep("verification");
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error) {
      const result = ErrorMessage(error);
      if (typeof result !== "object") {
        toast.error(result);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const code = [...verificationCode];
    code[i] = v;
    setVerificationCode(code);
    if (verificationError) setVerificationError("");
    if (v && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !verificationCode[i] && i > 0)
      inputRefs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) inputRefs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const txt = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(txt)) {
      const arr = txt.split("");
      setVerificationCode(arr);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.some((d) => !d))
      return setVerificationError("Enter all 6 digits");

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(
        `${BaseUrlApi}/auth/verify-reset-code`,
        {
          email,
          code: verificationCode.join(""),
        }
      );
      toast.success("Your code has been successfully verified.");
      Cookie.set("token", data.data.tempToken, { expires: 365 });
      setStep("reset");
    } catch (error) {
      const result = ErrorMessage(error);
      if (typeof result !== "object") {
        toast.error(result);
      }
      Cookie.remove("token");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword)
      return setResetError("All fields are required");
    if (password !== confirmPassword)
      return setResetError("Passwords do not match");
    try {
      setResetError("");
      setIsSubmitting(true);
      await axios.post(`${BaseUrlApi}/auth/reset-password`, {
        tempToken: Cookie.get("token"),
        password,
      });
      toast.success("Your password has been reset successfully.");
      setStep("success");
      Cookie.remove("token");
    } catch (error) {
      const result = ErrorMessage(error);
      if (typeof result !== "object") {
        toast.error(result);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 relative z-10 py-6">
      {/* Back */}
      <SecondaryButton
        onClick={onBack}
        className="border-none !bg-transparent hover:!text-white/50 p-0"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to login
      </SecondaryButton>

      {/* Header */}
      <div className="flex items-center gap-2">
        <Snowflake className="h-6 w-6 text-main" />
        <div>
          <h2 className="text-2xl font-bold text-white">
            {step === "email" && "Forgot your password?"}
            {step === "verification" && "Verify your email"}
            {step === "reset" && "Reset your password"}
            {step === "success" && "Success!"}
          </h2>
          <p className="text-muted-foreground ">
            {step === "email" && "We'll send you a verification code."}
            {step === "verification" &&
              "Enter the 6-digit code sent to your email."}
            {step === "reset" && "Choose a new password and confirm it below."}
            {step === "success" && "Your password has been reset."}
          </p>
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* EMAIL STEP */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-white">
                Email
              </label>
              <CustomInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <MainButton
              type="submit"
              className="w-full h-11 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Verification Code"}
            </MainButton>
          </form>
        )}

        {/* VERIFICATION STEP */}
        {step === "verification" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="mx-auto w-16 h-16 bg-main/20 rounded-full flex items-center justify-center mb-4">
                  <KeyRound className="h-8 w-8 text-main" />
                </div>
              </div>

              <p className="text-center text-muted-foreground  mb-4">
                We've sent a code to <span className="text-main">{email}</span>
              </p>

              <div className="flex justify-center gap-2">
                {verificationCode.map((d, i) => (
                  <CustomInput
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-xl"
                    disabled={isSubmitting}
                  />
                ))}
              </div>

              {verificationError && (
                <p className="text-red-500 text-sm text-center mt-2">
                  {verificationError}
                </p>
              )}

              <div className="text-center mt-2">
                <LinkButton onClick={handleEmailSubmit} className="text-sm">
                  Didn't receive a code? Resend
                </LinkButton>
              </div>
            </div>

            <MainButton
              onClick={handleVerifyCode}
              className="w-full h-11 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </MainButton>
          </div>
        )}

        {/* RESET STEP */}
        {step === "reset" && (
          <form
            onSubmit={handleResetSubmit}
            className="space-y-6 bg-zinc-900 p-6 rounded-2xl border border-zinc-700 relative"
          >
            <div className="space-y-2 relative">
              <label htmlFor="new-password" className="text-white">
                New Password
              </label>
              <CustomInput
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (resetError) setResetError("");
                }}
                placeholder="••••••••"
                className="pe-10"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute end-3 top-1/2 bottom-1/3 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground " />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground " />
                )}
              </button>
            </div>

            <div className="space-y-2 relative">
              <label htmlFor="confirm-password" className="text-white">
                Confirm Password
              </label>
              <CustomInput
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (resetError) setResetError("");
                }}
                placeholder="••••••••"
                className="pe-10"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute end-3 top-1/2 bottom-1/3 transform -translate-y-1/2"
              >
                {showConfirm ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground " />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground " />
                )}
              </button>
            </div>

            {resetError && <p className="text-red-500 text-sm">{resetError}</p>}

            <MainButton
              type="submit"
              className="w-full h-11 text-lg rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting…" : "Reset Password"}
            </MainButton>
          </form>
        )}

        {/* SUCCESS STEP */}
        {step === "success" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-gradient-to-b from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-8 flex flex-col items-center space-y-6 shadow-lg"
          >
            <div className="p-5 bg-main/30 rounded-full animate-bounce shadow-md">
              <CheckCircle2 className="h-12 w-12 text-main" />
            </div>
            <h3 className="text-2xl font-bold text-white text-center">
              Password Reset Successful!
            </h3>
            <p className="text-center text-muted-foreground  max-w-sm leading-relaxed">
              You’ve successfully reset your password. Click below to return to
              login.
            </p>
            <MainButton
              onClick={() => navigate("/")}
              className="w-full h-11 rounded-xl text-lg font-medium"
            >
              Return to Login
            </MainButton>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
