import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomInput } from "../../components/common/Customs/CustomInput";
import { LinkButton } from "../../components/common/Customs/LinkButton";
import { MainButton } from "../../components/common/Customs/MainButton";
import { Checkbox } from "src/components/ui/checkbox";
import { BaseUrlApi, ErrorMessage } from "../../lib/api";
import axios from "axios";
import Cookie from "js-cookie";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { SecondaryButton } from "../../components/common/Customs/SecondaryButton";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`${BaseUrlApi}/auth/check-email`, {
        email,
      });

      if (data.exists) {
        const { data } = await axios.post(`${BaseUrlApi}/auth/login`, {
          email,
          password,
        });
        Cookie.set("token", data.data.token, { expires: 365 });
        toast.success("You are now logged in, Enjoy 👋");
        navigate("/dashboard");
      } else {
        navigate("/on-boarding", { state: { email, password } });
      }
      
    } catch (error) {
      const result = ErrorMessage(error);
      if (typeof result !== "object") {
        toast.error(result);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (e) => {
    setLoading(true);
    window.location.href = `${BaseUrlApi}/auth/google`;
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-white">
            Email
          </label>
          <CustomInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-white">
            Password
          </label>
          <CustomInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center gap-2 justify-between flex-wrap !-mt-px">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                // checked={formData.agreeTerms}
                // onCheckedChange={handleCheckboxChange}
                className="data-[state=checked]:bg-main data-[state=checked]:text-black border border-main"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none text-muted-foreground  peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </div>

            <div className="text-end">
              <LinkButton
                type="button"
                className="p-0"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot your password?
              </LinkButton>
            </div>
          </div>
        </div>

        {/* Submit */}
        <MainButton
          type="submit"
          className="w-full h-11 text-lg"
          disabled={loading}
        >
          {loading && <Loader className="animate-spin" />}
          Continue With Email
        </MainButton>

        <div className="flex items-center gap-1 justify-center">
          {/* Don't have an account?{" "}
          <LinkButton
            type="button"
            className="p-0"
            onClick={() => navigate("/sign-up")}
            disabled={loading}
          >
            Sign Up
          </LinkButton> */}
          <span className="bg-muted-foreground h-px flex-1" /> Or continue with
          <span className="bg-muted-foreground h-px flex-1" />
        </div>
        <SecondaryButton
          className="w-full h-10"
          type="button"
          onClick={handleGoogle}
          disabled={loading}
        >
          {GoogleSVG}
          Continue With Google
        </SecondaryButton>
      </form>
    </div>
  );
}

const GoogleSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="100"
    height="100"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);
