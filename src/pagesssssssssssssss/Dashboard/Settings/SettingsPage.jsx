"use client"

import { useState, useEffect } from "react"
import { Button } from "src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card"
import { Input } from "src/components/ui/input"
import { Separator } from "src/components/ui/separator"
import { Badge } from "src/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "src/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs"
import { User, CreditCard, Bell, Shield, Download, Trash2, Eye } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import { useAPI } from "../../../context/ApiContext"
import { formateFullDate } from "../../../lib/utils"
import { useLocation } from "react-router-dom"
import { TranslatableText } from "../../../context/TranslationSystem"

export default function SettingsPage() {
  const location = useLocation()
  const initialTab = location.state?.tab || "profile"

  const [activeTab, setActiveTab] = useState(initialTab)
  const { user } = useAuth()
  const { billingHistoryItems } = useAPI()
  const { billingHistory } = billingHistoryItems

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    securityAlerts: true,
  })

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab)
    }
  }, [location.state])

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    // Handle profile update logic here
    console.log("Profile updated:", profileData)
  }

  const handleNotificationUpdate = () => {
    // Handle notification settings update
    console.log("Notifications updated:", notificationSettings)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          <TranslatableText text="Settings" />
        </h1>
        <p className="text-muted-foreground">
          <TranslatableText text="Manage your account settings and preferences" />
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <TranslatableText text="Profile" />
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <TranslatableText text="Billing" />
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <TranslatableText text="Notifications" />
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <TranslatableText text="Security" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatableText text="Profile Information" />
              </CardTitle>
              <CardDescription>
                <TranslatableText text="Update your personal information and preferences" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name">
                      <TranslatableText text="Full Name" />
                    </label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email">
                      <TranslatableText text="Email" />
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone">
                      <TranslatableText text="Phone" />
                    </label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location">
                      <TranslatableText text="Location" />
                    </label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" className="bg-main text-black hover:bg-main/90">
                  <TranslatableText text="Save Changes" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatableText text="Account Status" />
              </CardTitle>
              <CardDescription>
                <TranslatableText text="Your current plan and usage information" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    <TranslatableText text="Current Plan" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user?.plan?.name || <TranslatableText text="Free Plan" />}
                  </p>
                </div>
                <Badge variant="secondary">{user?.plan?.name || <TranslatableText text="Free" />}</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    <TranslatableText text="Credits Remaining" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <TranslatableText text="Available for creating presentations" />
                  </p>
                </div>
                <Badge variant="outline">{user?.points || 0}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatableText text="Billing History" />
              </CardTitle>
              <CardDescription>
                <TranslatableText text="View your past transactions and invoices" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              {billingHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <TranslatableText text="Date" />
                      </TableHead>
                      <TableHead>
                        <TranslatableText text="Description" />
                      </TableHead>
                      <TableHead>
                        <TranslatableText text="Plan" />
                      </TableHead>
                      <TableHead>
                        <TranslatableText text="Amount" />
                      </TableHead>
                      <TableHead>
                        <TranslatableText text="Status" />
                      </TableHead>
                      <TableHead>
                        <TranslatableText text="Actions" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingHistory.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{formateFullDate(transaction.createdAt)}</TableCell>
                        <TableCell className="capitalize">
                          {transaction.paymentMethod} <TranslatableText text="Payment" />
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{transaction.plan.name}</Badge>
                        </TableCell>
                        <TableCell>${transaction.amount}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    <TranslatableText text="No billing history found" />
                  </p>
                  <p className="text-sm">
                    <TranslatableText text="Your transactions will appear here once you make a purchase" />
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatableText text="Notification Preferences" />
              </CardTitle>
              <CardDescription>
                <TranslatableText text="Choose how you want to be notified" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    <TranslatableText text="Email Notifications" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <TranslatableText text="Receive updates about your projects" />
                  </p>
                </div>
                <Button
                  variant={notificationSettings.emailNotifications ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: !notificationSettings.emailNotifications,
                    })
                  }
                >
                  {notificationSettings.emailNotifications ? (
                    <TranslatableText text="On" />
                  ) : (
                    <TranslatableText text="Off" />
                  )}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    <TranslatableText text="Push Notifications" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <TranslatableText text="Get notified in your browser" />
                  </p>
                </div>
                <Button
                  variant={notificationSettings.pushNotifications ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: !notificationSettings.pushNotifications,
                    })
                  }
                >
                  {notificationSettings.pushNotifications ? (
                    <TranslatableText text="On" />
                  ) : (
                    <TranslatableText text="Off" />
                  )}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    <TranslatableText text="Marketing Emails" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <TranslatableText text="Receive tips and product updates" />
                  </p>
                </div>
                <Button
                  variant={notificationSettings.marketingEmails ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      marketingEmails: !notificationSettings.marketingEmails,
                    })
                  }
                >
                  {notificationSettings.marketingEmails ? (
                    <TranslatableText text="On" />
                  ) : (
                    <TranslatableText text="Off" />
                  )}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    <TranslatableText text="Security Alerts" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <TranslatableText text="Important security notifications" />
                  </p>
                </div>
                <Button
                  variant={notificationSettings.securityAlerts ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      securityAlerts: !notificationSettings.securityAlerts,
                    })
                  }
                >
                  {notificationSettings.securityAlerts ? (
                    <TranslatableText text="On" />
                  ) : (
                    <TranslatableText text="Off" />
                  )}
                </Button>
              </div>
              <Button onClick={handleNotificationUpdate} className="bg-main text-black hover:bg-main/90">
                <TranslatableText text="Save Preferences" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <TranslatableText text="Security Settings" />
              </CardTitle>
              <CardDescription>
                <TranslatableText text="Manage your account security and privacy" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    <TranslatableText text="Change Password" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <TranslatableText text="Update your account password" />
                  </p>
                </div>
                <Button variant="outline">
                  <TranslatableText text="Change Password" />
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    <TranslatableText text="Two-Factor Authentication" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <TranslatableText text="Add an extra layer of security" />
                  </p>
                </div>
                <Button variant="outline">
                  <TranslatableText text="Enable 2FA" />
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">
                    <TranslatableText text="Delete Account" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <TranslatableText text="Permanently delete your account and all data" />
                  </p>
                </div>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  <TranslatableText text="Delete Account" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
