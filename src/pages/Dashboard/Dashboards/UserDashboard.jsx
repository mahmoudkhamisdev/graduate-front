"use client"

import { useEffect, useMemo, useState } from "react"
import { DollarSign, FolderOpen, TrendingUp, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "src/components/ui/table"
import { Badge } from "src/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "src/components/ui/chart"
import { CustomSelect } from "./../../../components/common/Customs/CustomSelect"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useAPI } from "../../../context/ApiContext"
import { useAuth } from "../../../context/AuthContext"
import { SecondaryButton } from "../../../components/common/Customs/SecondaryButton"
import { useNavigate } from "react-router-dom"
import { formateFullDate } from "../../../lib/utils"
import { Skeleton } from "../../../components/ui/skeleton"
import { TranslatableText } from "../../../context/TranslationSystem"

const EVENT_TYPES = [
  "user_registration",
  "login",
  "project_created",
  "presentation_viewed",
  "template_used",
  "points_used",
]

export default function UserDashboard() {
  const [timeframe, setTimeframe] = useState("30d")
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  // -------------------------------------------------------------------
  const { analyticsUserItems, billingHistoryItems, projectsItems } = useAPI()
  const { analyticsUser, loadingAnalyticsUser, getAllAnalyticsUser } = analyticsUserItems

  useEffect(() => {
    if (timeframe !== "30d") {
      getAllAnalyticsUser(timeframe)
    }
  }, [timeframe])

  const activityTimeline = analyticsUser?.activityTimeline || []
  const dailyActivity = analyticsUser?.dailyActivity || []
  // -------------------------------------------------------------------
  const { billingHistory, loadingBillingHistory } = billingHistoryItems
  // -------------------------------------------------------------------
  const { projects, loadingProjects } = projectsItems
  // -------------------------------------------------------------------
  // Build activityData: one object per day with a count for each event type
  const activityData = useMemo(() => {
    return dailyActivity?.map((day) => {
      // start with date label
      const row = {
        date: new Date(day._id).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }
      // initialize every type to 0
      EVENT_TYPES.forEach((type) => {
        row[type] = 0
      })
      // fill counts from your API
      day.activities.forEach(({ type, count }) => {
        // if we know this type, assign it
        if (row[type] !== undefined) {
          row[type] = count
        }
      })
      return row
    })
  }, [dailyActivity])

  // Build spendingData: sum `payment_completed` amounts by month
  const spendingData = useMemo(() => {
    const payments = activityTimeline?.filter((evt) => evt.type === "payment_completed" && evt.data.amount)
    const byMonth = payments?.reduce((acc, { date, data: { amount } }) => {
      const m = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
      acc[m] = (acc[m] || 0) + amount
      return acc
    }, {})
    return Object.entries(byMonth).map(([month, amount]) => ({
      month,
      amount,
    }))
  }, [activityTimeline])

  if (loadingAnalyticsUser || loadingBillingHistory || loadingProjects || loading)
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className={"w-1/3 h-10"} />
          <Skeleton className={"w-32 h-10"} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className={"w-full h-36"} />
          <Skeleton className={"w-full h-36"} />
          <Skeleton className={"w-full h-36"} />
          <Skeleton className={"w-full h-36"} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className={"w-full h-80"} />
          <Skeleton className={"w-full h-80"} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className={"w-full h-80"} />
          <Skeleton className={"w-full h-80"} />
        </div>
      </div>
    )

  return (
    <div className="">
      {/* Top Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              <TranslatableText text="Hello" />, {user?.name} 👋
            </h1>
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

        {/* Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <TranslatableText text="Total Projects" />
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsUser?.summary?.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                +{Number.parseInt(analyticsUser?.summary?.totalProjects / 30)}{" "}
                <TranslatableText text="from last month" />
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <TranslatableText text="Total Spent" />
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analyticsUser?.summary?.totalSpent}</div>
              <p className="text-xs text-muted-foreground">
                +{Number.parseInt(analyticsUser?.summary?.totalSpent / 30)}%
                <TranslatableText text="from last month" />
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <TranslatableText text="Points Used" />
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsUser?.summary?.pointsUsed}</div>
              <p className="text-xs text-muted-foreground">
                {user?.points} <TranslatableText text="remaining" />
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <TranslatableText text="Templates Used" />
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsUser?.summary?.templatesUsed}</div>
              <p className="text-xs text-muted-foreground">
                +{Number.parseInt(analyticsUser?.summary?.templatesUsed / 7)} <TranslatableText text="from last week" />
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Dynamic Daily Activity Chart */}
          <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader>
              <CardTitle>
                <TranslatableText text="Daily Activity" />
              </CardTitle>
              <CardDescription>
                <TranslatableText text="Your activity over the selected period" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityData.length !== 0 ? (
                <ChartContainer
                  config={EVENT_TYPES.reduce((cfg, type, i) => {
                    // humanize the label: replace _ with space + capitalize
                    const label = type
                      .split("_")
                      .map((w) => w[0].toUpperCase() + w.slice(1))
                      .join(" ")
                    cfg[type] = { label, color: `hsl(var(--chart-${i + 1}))` }
                    return cfg
                  }, {})}
                  className="h-80"
                >
                  <AreaChart data={activityData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    {EVENT_TYPES.map((type, idx) => (
                      <Area
                        key={type}
                        dataKey={type}
                        type="natural"
                        stroke={`var(--color-${type})`}
                        fill={`var(--color-${type})`}
                        fillOpacity={0.4}
                        stackId="a"
                      />
                    ))}
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="text-center text-muted-foreground">
                  <TranslatableText text="No Daily Activity is Exist!" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Spending Chart */}
          <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader>
              <CardTitle>
                <TranslatableText text="Monthly Spending" />
              </CardTitle>
              <CardDescription>
                <TranslatableText text="Your spending trend over time" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              {spendingData.length !== 0 ? (
                <ChartContainer
                  config={{
                    amount: { label: "Amount", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-80"
                >
                  <BarChart data={spendingData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="text-center text-muted-foreground">
                  <TranslatableText text="No Monthly Spending is Exist!" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tables Section */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Billing History */}
          <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="grid gap-1">
                <CardTitle>
                  <TranslatableText text="Recent Billing" />
                </CardTitle>
                <CardDescription>
                  <TranslatableText text="Your recent payment transactions" />
                </CardDescription>
              </div>
              <SecondaryButton onClick={() => navigate("/settings", { state: { tab: "billing" } })}>
                <TranslatableText text="Show all" />
              </SecondaryButton>
            </CardHeader>
            <CardContent>
              {billingHistory.length !== 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <TranslatableText text="Transaction" />
                      </TableHead>
                      <TableHead>
                        <TranslatableText text="Plan" />
                      </TableHead>
                      <TableHead>
                        <TranslatableText text="Date" />
                      </TableHead>
                      <TableHead className="text-end">
                        <TranslatableText text="Amount" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingHistory.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium capitalize">{transaction?.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{transaction.plan.name}</Badge>
                        </TableCell>
                        <TableCell>{formateFullDate(transaction.createdAt)}</TableCell>
                        <TableCell className="text-end">${transaction.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground">
                  <TranslatableText text="No Recent Activity is Exist!" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Projects */}
          <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="grid gap-1">
                <CardTitle>
                  <TranslatableText text="Recent Projects" />
                </CardTitle>
                <CardDescription>
                  <TranslatableText text="Your latest project activity" />
                </CardDescription>
              </div>
              <SecondaryButton onClick={() => navigate("/projects")}>
                <TranslatableText text="Show all" />
              </SecondaryButton>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.length !== 0 ? (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border dark:border-zinc-800 rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{project.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{project.field}</span>
                          <span>•</span>
                          <span>
                            {project.views} <TranslatableText text="views" />
                          </span>
                          {project.isPublic && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                <TranslatableText text="Public" />
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{project.lastViewed}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    <TranslatableText text="No Recent Projects is Exist!" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Timeline */}
        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader>
            <CardTitle>
              <TranslatableText text="Recent Activity" />
            </CardTitle>
            <CardDescription>
              <TranslatableText text="Your latest actions and updates" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityTimeline.length !== 0 ? (
                activityTimeline.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className="w-2 h-2 bg-main rounded-full mt-2"></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {activity.type === "user_registration" && <TranslatableText text="New user registered" />}
                          {activity.type === "login" && <TranslatableText text="User logged in" />}
                          {activity.type === "project_created" && `Created project "${activity.data.projectName}"`}
                          {activity.type === "presentation_viewed" &&
                            `Viewed presentation "${activity.data.presentationTitle}"`}
                          {activity.type === "template_used" && `Used template "${activity.data.templateTitle}"`}
                          {activity.type === "points_used" && `Used ${activity.data.pointsUsed} points`}
                          {activity.type === "payment_completed" &&
                            `Payment completed for ${activity.data.planName} plan`}
                        </p>
                        <span className="text-sm text-muted-foreground">{formateFullDate(activity.date)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.type === "user_registration" && <TranslatableText text="Welcome aboard!" />}
                        {activity.type === "login" && <TranslatableText text="Login successful" />}
                        {activity.type === "project_created" && `Used ${activity.data.pointsUsed} points`}
                        {activity.type === "presentation_viewed" && `Presentation ID: ${activity.data.presentationId}`}
                        {activity.type === "template_used" && `Category: ${activity.data.category}`}
                        {activity.type === "points_used" && `Deducted ${activity.data.pointsUsed} points`}
                        {activity.type === "payment_completed" &&
                          `$${activity.data.amount} — ${activity.data.creditsAdded} credits added`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  <TranslatableText text="No Recent Activity exists!" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
