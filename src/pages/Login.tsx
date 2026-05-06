import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/Inputs/TextInput";
import { toast } from "sonner";
import logo from "@/assets/kanimai-logo.gif";
import ramanas_logo from "@/assets/ramanas_logo.png";
import collegeBg from "@/assets/ramanas_image.png";
import bg_images from "@/assets/bg_images.jpg";
import illustration from "@/assets/login_illustration.png";
import { useForm } from "react-hook-form";
import { User, Lock } from "lucide-react";
import { authApi } from "@/services/api";

const Login = () => {
  const navigate = useNavigate();

  // Dynamic data based on user request example
  const collegeName = sessionStorage.getItem("clientName");
  const collegeBgImage =
    sessionStorage.getItem("TenantID") === "ramanaarts" ? collegeBg : bg_images;
  const collegeLogoImage =
    sessionStorage.getItem("TenantID") === "ramanaarts" ? ramanas_logo : logo;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const result = await authApi.login(
        data as { username: string; password: string },
      );
      if (result.data.status === 1) {
        let data = result.data;
        if (data.entityName == "Faculty") {
          // this.router.navigateByUrl('/main/my-detail/subject-list')
          navigate("/faculty");
          sessionStorage.setItem("userID", data.entityID);
        } else {
          // this.router.navigateByUrl('/main/dashboard')
          navigate("/admin");
        }
        sessionStorage.setItem("jwttoken", data.jwttoken);
        sessionStorage.setItem("UserName", data.firstName);
        sessionStorage.setItem("entityName", data.entityName);
        let datas = JSON.stringify(data.privileges);
        sessionStorage.setItem("preList", datas);
        toast.success("Login successful!");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.response?.responseMessage || "Login failed",
      );
    }
  };

  const onError = () => {
    toast.error("Please fill in all fields correctly");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background with dynamic image support */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${collegeBgImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Brand Logo - Top Left */}
      <div className="absolute top-8 left-8 z-20 hidden md:flex items-center gap-2">
        <div className="bg-white/90 p-2 rounded-xl backdrop-blur-md shadow-lg">
          <img
            src={logo}
            alt={collegeName}
            className="h-8 w-auto object-contain"
          />
        </div>
        {/* <span className="text-2xl font-bold text-white tracking-wider drop-shadow-md hidden sm:block">
          {brandName}
        </span> */}
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col md:flex-row animate-in fade-in zoom-in duration-500">
        {/* Left Side - Illustration (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-primary/10 items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 text-center space-y-6">
            <img
              src={illustration}
              alt="Collaboration"
              className="w-full max-w-sm mx-auto drop-shadow-2xl animate-float"
            />
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-primary">{collegeName}</h2>
              <p className="text-slate-600 max-w-xs mx-auto">
                Managing education with excellence and innovation.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/40">
          <div className="w-full max-w-md mx-auto space-y-8">
            {/* Form Header */}
            <div className="text-center space-y-3">
              <div className="md:hidden mx-auto w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-3 mb-4">
                <img
                  src={collegeLogoImage}
                  alt="College Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Login Portal
              </h1>
              <p className="text-slate-500">
                Welcome back! Please enter your details.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <TextInput
                  control={control}
                  errors={errors}
                  name="username"
                  type="text"
                  textLable="Username"
                  placeholderName="Enter your username"
                  variant="outlined"
                  startIcon={<User className="w-4 h-4 text-primary" />}
                  requiredMsg="Username is required"
                  labelMandatory
                />

                <TextInput
                  control={control}
                  errors={errors}
                  name="password"
                  type="password"
                  textLable="Password"
                  placeholderName="••••••••"
                  variant="outlined"
                  startIcon={<Lock className="w-4 h-4 text-primary" />}
                  requiredMsg="Password is required"
                  labelMandatory
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-slate-600 group-hover:text-primary transition-colors">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform active:scale-[0.98]"
              >
                Sign In
              </Button>
            </form>

            {/* Footer info */}
            <div className="pt-8 border-t border-slate-200/50 text-center">
              <p className="text-slate-400 text-xs">
                © {new Date().getFullYear()} Kanimai. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
