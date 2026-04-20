"use client";

import { useEffect, useState } from "react";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { Badge } from "src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { Separator } from "src/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  CreditCard,
  Shield,
  Activity,
  Unlink,
  ExternalLink,
  User,
  Link,
  Subtitles,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
} from "./../../../utils/MotionVariants";
import { MainButton } from "../../../components/common/Customs/MainButton";
import { CustomInput } from "./../../../components/common/Customs/CustomInput";
import { Input } from "src/components/ui/input";
import { SecondaryButton } from "./../../../components/common/Customs/SecondaryButton";
import { CustomSelect } from "../../../components/common/Customs/CustomSelect";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Skeleton } from "src/components/ui/skeleton";
import UploadImageProfile from "../../../components/common/Upload/UploadImageProfile";
import axios from "axios";
import { BaseUrlApi, ErrorMessage } from "../../../lib/api";
import { toast } from "sonner";
import { useAPI } from "../../../context/ApiContext";

const getBrowserInfo = (userAgent = "") => {
  if (userAgent.includes("Edg/")) {
    return { name: "Microsoft Edge", icon: "edge" };
  } else if (userAgent.includes("Chrome/")) {
    return { name: "Google Chrome", icon: "chrome" };
  } else if (userAgent.includes("Firefox/")) {
    return { name: "Firefox", icon: "firefox" };
  } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) {
    return { name: "Safari", icon: "safari" };
  } else {
    return { name: "Unknown Browser", icon: "globe" };
  }
};

const getDeviceType = (userAgent = "") => {
  if (
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad") ||
    userAgent.includes("Android")
  ) {
    return "Mobile";
  } else if (
    userAgent.includes("Windows") ||
    userAgent.includes("Macintosh") ||
    userAgent.includes("Linux")
  ) {
    return "Desktop";
  } else {
    return "Unknown";
  }
};

export default function AccountSettings() {
  const { user, loading: userLaoading, getProfile } = useAuth();
  const { billingHistoryItems, analyticsUserItems } = useAPI();
  const { billingHistory, loadingBillingHistory } = billingHistoryItems;
  const { analyticsUser, loadingAnalyticsUser, getAllAnalyticsUser } =
    analyticsUserItems;

  const location = useLocation();
  const customTabValue = location?.state?.tab;

  const [tabValue, setTabValue] = useState(customTabValue || "profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(user?.name);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [timeframe, setTimeframe] = useState("30d");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (timeframe) getAllAnalyticsUser(timeframe);
  }, [timeframe]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${BaseUrlApi}/users/password/change`, {
        currentPassword: user?.password ? currentPassword : "google",
        newPassword,
      });
      toast.success("Password changed successfully");
      setConfirmPassword("");
      setCurrentPassword("");
      setNewPassword("");
      getProfile();
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${BaseUrlApi}/users/profile/update`, {
        name,
        avatar,
      });
      await getProfile();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLink = async () => {
    setLoading(true);

    try {
      await axios.post(`${BaseUrlApi}/auth/google/link`, {
        googleId: user?._id,
        googleEmail: user?.email,
        googleName: user?.name,
        googleAvatar: user?.avatar,
      });
      await getProfile();
      toast.success("Google account linked successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleUnlink = async () => {
    setLoading(true);

    try {
      await axios.delete(`${BaseUrlApi}/auth/google/unlink`);
      await getProfile();
      toast.success("Google account unlinked successfully");
    } catch (error) {
      toast.error(ErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filterActivitiesByTimeframe = (activities, timeframe) => {
    const now = new Date();
    let cutoffDate;

    switch (timeframe) {
      case "7d":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return activities;
    }

    return activities.filter(
      (activity) => new Date(activity.date) >= cutoffDate
    );
  };

  const filteredActivities = filterActivitiesByTimeframe(
    analyticsUser?.activityTimeline?.filter((item) => item.type === "login") ||
      [],
    timeframe
  );

  if (userLaoading || loadingBillingHistory || loadingAnalyticsUser)
    return (
      <div className="space-y-4 mx-auto py-10 max-w-5xl">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  return (
    <div className="mx-auto py-10 max-w-5xl">
      <Tabs
        defaultValue={tabValue}
        onValueChange={setTabValue}
        className="space-y-6"
      >
        <TabsList className="grid w-full h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-5 dark:bg-zinc-900 border dark:border-zinc-700">
          <TabsTrigger
            className="data-[state=active]:bg-main data-[state=active]:text-black"
            value="profile"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-main data-[state=active]:text-black"
            value="security"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-main data-[state=active]:text-black"
            value="subscription"
          >
            Subscription
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-main data-[state=active]:text-black"
            value="billing"
          >
            Billing
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-main data-[state=active]:text-black"
            value="activity"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="dark:bg-zinc-900 border dark:border-zinc-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your profile information and avatar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center md:justify-normal flex-wrap md:flex-nowrap gap-4"
                  >
                    <UploadImageProfile
                      imageUrl={avatar}
                      onImageUploaded={(img) => setAvatar(img)}
                      isUploading={(isUpload) => setLoading(isUpload)}
                    />

                    <div className="space-y-1 w-full">
                      <p className="text-xl font-bold capitalize">{name}</p>
                      <p className="text-muted-foreground">
                        {user?.subscription?.plan?.name || "Free"} Plan
                      </p>
                    </div>
                  </motion.div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label htmlFor="name">Name *</label>
                      <CustomInput
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="space-y-2">
                        <label>Email</label>
                        <div className="flex items-center gap-2">
                          <Input value={user?.email} disabled />
                          {user?.isEmailVerified ? (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge
                              variant="destructive"
                              className="flex items-center gap-1"
                            >
                              <XCircle className="h-3 w-3" />
                              Unverified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label>Last Login</label>
                        <CustomInput
                          value={formatDate(user?.lastLogin)}
                          disabled
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="space-y-2">
                        <label>Points</label>
                        <CustomInput
                          value={user?.points.toLocaleString()}
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <label>Member Since</label>
                        <CustomInput
                          value={formatDate(user?.createdAt)}
                          disabled
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MainButton type="submit" disabled={loading}>
                        {loading && <Loader2 className="animate-spin" />} Update
                        Profile
                      </MainButton>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="dark:bg-zinc-900 border dark:border-zinc-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    {user?.password && (
                      <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="current-password">
                          Current Password *
                        </label>
                        <CustomInput
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) =>
                            user?.password && setCurrentPassword(e.target.value)
                          }
                          required={user?.password ? true : false}
                        />
                      </motion.div>
                    )}

                    <motion.div variants={itemVariants} className="space-y-2">
                      <label htmlFor="new-password">New Password *</label>
                      <CustomInput
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <label htmlFor="confirm-password">
                        Confirm New Password *
                      </label>
                      <CustomInput
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <MainButton type="submit" disabled={loading}>
                        {loading && <Loader2 className="animate-spin" />} Change
                        Password
                      </MainButton>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="dark:bg-zinc-900 border dark:border-zinc-700">
                <CardHeader>
                  <CardTitle>Google Account</CardTitle>
                  <CardDescription>
                    Manage your Google account connection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center">
                        {GoogleSVG}
                      </div>
                      <div>
                        <p className="font-medium">Google Account</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.googleId ? (
                            <span className="text-green-800">Connected</span>
                          ) : (
                            <span className="text-destructive">
                              Not connected
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {user?.googleId ? (
                      <SecondaryButton
                        variant="outline"
                        onClick={handleGoogleUnlink}
                        className="flex items-center gap-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Unlink className="h-4 w-4" />
                        )}
                        Unlink
                      </SecondaryButton>
                    ) : (
                      <SecondaryButton
                        onClick={handleGoogleLink}
                        className="flex items-center gap-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Link className="h-4 w-4" />
                        )}
                        Link Account
                      </SecondaryButton>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="dark:bg-zinc-900 border dark:border-zinc-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Subtitles />
                    Current Subscription
                  </CardTitle>
                  <CardDescription>
                    Your current plan and features
                  </CardDescription>
                </CardHeader>
                {user?.subscription?.isActive ? (
                  <CardContent className="space-y-4">
                    <div className="flex items-center flex-wrap justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {user?.subscription?.plan?.name} Plan
                        </h3>
                        <p className="text-muted-foreground">
                          {user?.subscription?.plan?.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          ${user?.subscription?.plan?.price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{user?.subscription?.plan?.currency}
                          </span>
                        </p>
                        <Badge
                          variant={
                            user?.subscription?.isActive
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user?.subscription?.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label>Credits</label>
                        <p className="text-lg font-semibold">
                          {user?.subscription?.plan?.credits}
                        </p>
                      </div>
                      <div>
                        <label>Billing Period</label>
                        <p className="text-sm">
                          {formatDate(user?.subscription.startDate)} -{" "}
                          {formatDate(user?.subscription.endDate)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label>Plan Features</label>
                      <ul className="mt-2 space-y-2">
                        {user?.subscription?.plan?.features.map((feature) => (
                          <li
                            key={feature._id}
                            className="flex items-center gap-2"
                          >
                            {feature.checked ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={
                                feature.checked
                                  ? ""
                                  : "line-through text-muted-foreground"
                              }
                            >
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No Subscription found right now.
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="dark:bg-zinc-900 border dark:border-zinc-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing History
                  </CardTitle>
                  <CardDescription>
                    View your payment history and invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Invoice</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.length !== 0 ? (
                        billingHistory.map((billing) => (
                          <TableRow>
                            <TableCell className="text-nowrap">
                              {formatDate(billing.createdAt)}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {billing.plan.name}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              ${billing.amount} {billing.currency}
                            </TableCell>
                            <TableCell className="text-nowrap">
                              <Badge
                                variant={
                                  billing.paymentStatus === "pending"
                                    ? "secondary"
                                    : billing.paymentStatus === "completed"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {billing.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-nowrap">
                              {billing.paymentGatewayResponse?.Data
                                ?.InvoiceURL ? (
                                <SecondaryButton
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <a
                                    href={
                                      billing.paymentGatewayResponse.Data
                                        .InvoiceURL
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    {billing.paymentStatus === "pending"
                                      ? "Pay Now"
                                      : "View Invoice"}
                                  </a>
                                </SecondaryButton>
                              ) : (
                                <span className="text-muted-foreground">
                                  N/A
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell className="text-nowrap flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            No Billing Exist
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="dark:bg-zinc-900 border dark:border-zinc-700">
                <CardHeader>
                  <div className="flex items-center flex-wrap gap-2 justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Account Activity
                      </CardTitle>
                      <CardDescription>
                        Recent login activity and account usage
                      </CardDescription>
                    </div>
                    <CustomSelect
                      className="w-full sm:w-[150px]"
                      value={timeframe}
                      onChange={setTimeframe}
                      options={[
                        { label: "Last 7 days", value: "7d" },
                        { label: "Last 30 days", value: "30d" },
                        { label: "Last 90 days", value: "90d" },
                        { label: "Last year", value: "1y" },
                      ]}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    variants={containerVariants}
                    className="space-y-4"
                  >
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => (
                        <motion.div
                          key={activity._id}
                          variants={itemVariants}
                          className="flex flex-col p-4 border dark:border-zinc-800 rounded-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-main/20 rounded-full flex items-center justify-center">
                                <Activity className="h-5 w-5 text-main" />
                              </div>
                              <div>
                                <p className="font-medium capitalize">
                                  {activity.type}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {activity.data.method
                                    ? `via ${activity.data.method.replace(
                                        "_",
                                        " "
                                      )}`
                                    : activity.data.email}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {formatDate(activity.date)}
                              </p>
                              {activity.data.isNewUser !== undefined && (
                                <Badge
                                  variant={
                                    activity.data.isNewUser
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {activity.data.isNewUser
                                    ? "New User"
                                    : "Returning"}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm border-t dark:border-zinc-800 pt-3">
                            <div>
                              <p className="text-muted-foreground">
                                IP Address
                              </p>
                              <p className="font-medium">
                                {activity.ipAddress}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Device</p>
                              <p className="font-medium">
                                {getDeviceType(activity.userAgent)}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-muted-foreground">Browser</p>
                              <p className="font-medium">
                                {getBrowserInfo(activity.userAgent).name}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        variants={itemVariants}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No activity found for the selected timeframe.
                      </motion.div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
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
