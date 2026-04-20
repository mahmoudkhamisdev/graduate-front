import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import Cookie from "js-cookie";
import { BaseUrlApi, ErrorMessage } from "../lib/api";
import { useAuth } from "./AuthContext";

const APIContext = createContext();

export const useAPI = () => {
  return useContext(APIContext);
};

export const APIProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const token = Cookie.get("token");

  // -------------AnalyticsUser-------------
  const [loadingAnalyticsUser, setLoadingAnalyticsUser] = useState(true);
  const [analyticsUser, setAnalyticsUser] = useState([]);

  const getAllAnalyticsUser = async (timeframe = "30d") => {
    try {
      const { data } = await axios.get(
        `${BaseUrlApi}/analytics/user?timeframe=${timeframe}`
      );
      setAnalyticsUser(data.data);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoadingAnalyticsUser(false);
    }
  };

  const analyticsUserItems = {
    analyticsUser,
    loadingAnalyticsUser,
    getAllAnalyticsUser,
  };

  useEffect(() => {
    if (token) getAllAnalyticsUser();
  }, [token]);

  // -------------AnalyticsAdmin-------------(Admin)
  const [loadingAnalyticsAdmin, setLoadingAnalyticsAdmin] = useState(true);
  const [analyticsAdmin, setAnalyticsAdmin] = useState([]);

  const getAllAnalyticsAdmin = async (timeframe = "30d") => {
    try {
      const { data } = await axios.get(
        `${BaseUrlApi}/analytics/admin?timeframe=${timeframe}`
      );
      setAnalyticsAdmin(data.data);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoadingAnalyticsAdmin(false);
    }
  };

  const analyticsAdminItems = {
    analyticsAdmin,
    loadingAnalyticsAdmin,
    getAllAnalyticsAdmin,
  };

  useEffect(() => {
    if (token && !loading && user?.role === "admin") getAllAnalyticsAdmin();
  }, [token, loading, user]);
  // -------------AnalyticsSystem-------------(Admin)
  const [loadingAnalyticsSystem, setLoadingAnalyticsSystem] = useState(true);
  const [analyticsSystem, setAnalyticsSystem] = useState([]);

  const getAllAnalyticsSystem = async (timeframe = "30d") => {
    try {
      const { data } = await axios.get(
        `${BaseUrlApi}/analytics/system?timeframe=${timeframe}`
      );
      setAnalyticsSystem(data.data);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoadingAnalyticsSystem(false);
    }
  };

  const analyticsSystemItems = {
    analyticsSystem,
    loadingAnalyticsSystem,
    getAllAnalyticsSystem,
  };

  useEffect(() => {
    if (token && !loading && user?.role === "admin") getAllAnalyticsSystem();
  }, [token, loading, user]);

  // -------------Projects-------------
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projects, setProjects] = useState([]);

  const getAllProjects = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/projects`);
      setProjects(data.data.projects);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoadingProjects(false);
    }
  };

  const projectsItems = {
    projects,
    loadingProjects,
    getAllProjects,
  };

  useEffect(() => {
    if (token) getAllProjects();
  }, [token]);

  // -------------TrashProjects-------------
  const [loadingTrashProjects, setLoadingTrashProjects] = useState(true);
  const [trashProjects, setTrashProjects] = useState([]);

  const getAllTrashProjects = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/projects/trash/all`);
      setTrashProjects(data.data.projects);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoadingTrashProjects(false);
    }
  };

  const trashProjectsItems = {
    trashProjects,
    loadingTrashProjects,
    getAllTrashProjects,
  };

  useEffect(() => {
    if (token) getAllTrashProjects();
  }, [token]);

  // -------------SharedProjects-------------
  const [loadingSharedProjects, setLoadingSharedProjects] = useState(true);
  const [sharedProjects, setSharedProjects] = useState([]);

  const getAllSharedProjects = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/projects/shared/all`);
      setSharedProjects(data.data.projects);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoadingSharedProjects(false);
    }
  };

  const sharedProjectsItems = {
    sharedProjects,
    loadingSharedProjects,
    getAllSharedProjects,
  };

  useEffect(() => {
    if (token) getAllSharedProjects();
  }, [token]);

  // -------------Templates-------------
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [templates, setTemplates] = useState([]);

  const getAllTemplates = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/templates`);
      setTemplates(data.data.templates);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoadingTemplates(false);
    }
  };

  const templatesItems = {
    templates,
    loadingTemplates,
    getAllTemplates,
  };

  useEffect(() => {
    if (token) getAllTemplates();
  }, [token]);

  // -------------Plans-------------
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [plans, setPlans] = useState([]);

  const getAllPlans = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/plans`);
      setPlans(data.data.plans);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoadingPlans(false);
    }
  };

  const plansItems = {
    plans,
    loadingPlans,
    getAllPlans,
  };

  useEffect(() => {
    if (token) getAllPlans();
  }, [token]);

  // -------------BillingHistory-------------
  const [loadingBillingHistory, setLoadingBillingHistory] = useState(true);
  const [billingHistory, setBillingHistory] = useState([]);

  const getAllBillingHistory = async () => {
    try {
      const { data } = await axios.get(`${BaseUrlApi}/billing/history`);
      setBillingHistory(data.data.billings);
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoadingBillingHistory(false);
    }
  };

  const billingHistoryItems = {
    billingHistory,
    loadingBillingHistory,
    getAllBillingHistory,
  };

  useEffect(() => {
    if (token) getAllBillingHistory();
  }, [token]);

  return (
    <APIContext.Provider
      value={{
        analyticsUserItems,
        analyticsAdminItems,
        analyticsSystemItems,
        projectsItems,
        trashProjectsItems,
        sharedProjectsItems,
        templatesItems,
        plansItems,
        billingHistoryItems,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};
