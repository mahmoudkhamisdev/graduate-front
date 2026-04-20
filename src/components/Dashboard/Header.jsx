import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "../ui/sidebar";
import { Plus, Search, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { LanguageSwitcher } from "../../context/TranslationSystem";

export const Header = () => {
  const navigate = useNavigate();
  const { credits } = useAuth();
  const [creditsCounter, setCreditsCounter] = useState(0);

  useEffect(() => {
    let target = credits; // الرقم النهائي
    let step = Math.ceil(target / 100); // سرعة العد
    let interval = setInterval(() => {
      setCreditsCounter((prev) => {
        if (prev + step >= target) {
          clearInterval(interval);
          return target;
        }
        return prev + step;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [credits]);

  return (
    <div
      className="px-5 h-14 flex items-center gap-2 justify-between border-b"
      //   dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger />
        <div className="flex items-center gap-2 bg-sidebar py-2 px-3 rounded-full w-1/2 border">
          <Search className="size-5" />
          <input
            type="search"
            name="filter"
            id="filter"
            placeholder="Seacrh by name, email, status"
            className="flex-1 outline-none bg-transparent text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* <SelectLanguage /> */}
          {/* <SelectTheme /> */}
        </div>
      </div>
      <div className="flex items-center gap-2 w-fit">
        {/* <Button variant="secondary">
          <Upload /> Import
        </Button> */}
        <div
          className="flex items-center gap-2 cursor-pointer py-[.4rem] px-2 bg-main/20 rounded-full"
          onClick={() => navigate("/pricing")}
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-ufo text-black">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ufo opacity-75"></span>
            <Zap className="h-5 w-5 relative z-10" />
          </div>
          <span className="text-base font-semibold mb-px">
            {creditsCounter}
          </span>
        </div>
        <Button onClick={() => navigate("/project-form")}>
          <Plus /> New Project
        </Button>

        <LanguageSwitcher />
      </div>
    </div>
  );
};
