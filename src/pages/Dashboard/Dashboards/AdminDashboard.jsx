"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "src/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Label,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Users,
  DollarSign,
  FolderOpen,
  TrendingUp,
  Activity,
  Database,
  Crown,
} from "lucide-react";
import { CustomSelect } from "./../../../components/common/Customs/CustomSelect";
import { formateFullDate } from "../../../lib/utils";
import { Skeleton } from "../../../components/ui/skeleton";
import { useAuth } from "../../../context/AuthContext";
import { useAPI } from "../../../context/ApiContext";

const EVENT_TYPES = [
  "user_registration",
  "login",
  "project_created",
  "presentation_viewed",
  "template_used",
  "points_used",
];

// Radar Chart Component
const RadarChartComponent = () => {
  const radarData = EVENT_TYPES.map((eventType, index) => ({
    event: eventType.replace("_", " "),
    value: Math.floor(Math.random() * 100) + 20,
  }));

  return (
    <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
      <CardHeader>
        <CardTitle>Event Distribution</CardTitle>
        <CardDescription>Platform event types analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Events",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={radarData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="event" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-value)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("30d");
  // -------------------------------------------------------------------
  const { user, loading } = useAuth();
  const { analyticsSystemItems, analyticsAdminItems } = useAPI();
  const { analyticsAdmin, loadingAnalyticsAdmin } = analyticsAdminItems;
  const { analyticsSystem, loadingAnalyticsSystem } = analyticsSystemItems;
  // -------------------------------------------------------------------
  // Extract data from the provided datasets
  const adminAnalytics = analyticsAdmin?.summary || [];
  const systemStats = analyticsSystem?.dbStats || [];
  const userRegistrationTrend =
    analyticsAdmin?.trends?.userRegistrations?.map((item) => ({
      date: item._id.slice(5), // Extract MM-DD from date
      count: item.count,
    })) || [];
  const revenueTrend = analyticsAdmin?.trends?.revenueTrend?.map((item) => ({
    date: item._id.slice(5),
    revenue: item.revenue,
    count: item.count,
  }));
  const topTemplates = analyticsAdmin?.insights?.topTemplates || [];
  const userActivity =
    analyticsAdmin?.insights?.userActivity?.map((item) => ({
      type: item._id.replace("_", " "),
      count: item.count,
    })) || [];
  const planPopularity =
    analyticsAdmin?.insights?.planPopularity?.map((item) => ({
      name: item._id,
      count: item.count,
      revenue: item.revenue,
      fill:
        item._id === "Professional"
          ? "var(--color-Professional)"
          : item._id === "Basic"
          ? "var(--color-Basic)"
          : "var(--color-Enterprise)",
    })) || [];
  const recentActivity = analyticsSystem?.recentActivity || [];
  const errorLogs = analyticsSystem?.errorLogs || [];

  if (loading || loadingAnalyticsAdmin || loadingAnalyticsSystem)
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
    );

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Hello, {user?.name} 👋</h1>
          <Badge variant="outline" className="text-xs">
            <Crown className="w-3 h-3 mr-1" />
            Administrator
          </Badge>
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

      {/* Admin Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {adminAnalytics?.totalUsers ? (
              <>
                <div className="text-2xl font-bold">
                  {adminAnalytics.totalUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{adminAnalytics.newUsers} new users
                </p>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No users available!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {adminAnalytics?.totalRevenue ? (
              <>
                <div className="text-2xl font-bold">
                  ${adminAnalytics.totalRevenue}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No revenue data available!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {adminAnalytics?.totalProjects ? (
              <>
                <div className="text-2xl font-bold">
                  {adminAnalytics.totalProjects}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{adminAnalytics.newProjects} new projects
                </p>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No projects available!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {adminAnalytics?.activeSubscriptions ? (
              <>
                <div className="text-2xl font-bold">
                  {adminAnalytics.activeSubscriptions}
                </div>
                <p className="text-xs text-muted-foreground">
                  85% retention rate
                </p>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No subscriptions active!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {systemStats?.activeUsers && systemStats?.users ? (
              <>
                <div className="text-2xl font-bold">
                  {systemStats.activeUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(
                    (systemStats.activeUsers / systemStats.users) * 100
                  )}
                  % of total users
                </p>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No active users data!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Database Records
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {systemStats ? (
              <>
                <div className="text-2xl font-bold">
                  {systemStats.users +
                    systemStats.projects +
                    systemStats.templates}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all collections
                </p>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No database records found!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Success Rate
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {systemStats?.completedPayments && systemStats?.billings ? (
              <>
                <div className="text-2xl font-bold">
                  {Math.round(
                    (systemStats.completedPayments / systemStats.billings) * 100
                  )}
                  %
                </div>
                <p className="text-xs text-muted-foreground">
                  {systemStats.completedPayments} of {systemStats.billings}{" "}
                  payments
                </p>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No payment data available!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Templates
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {systemStats?.activeTemplates ? (
              <>
                <div className="text-2xl font-bold">
                  {systemStats.activeTemplates}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {systemStats.templates} total templates
                </p>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No active templates!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* User Registration Trend */}
        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader>
            <CardTitle>User Registrations</CardTitle>
            <CardDescription>New user sign-ups over time</CardDescription>
          </CardHeader>
          <CardContent>
            {userRegistrationTrend?.length ? (
              <ChartContainer
                config={{
                  count: {
                    label: "New Users",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-80"
              >
                <LineChart
                  data={userRegistrationTrend}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    dataKey="count"
                    type="monotone"
                    stroke="var(--color-count)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-count)" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                No user registration data!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Daily revenue and transaction count
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueTrend?.length ? (
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-80"
              >
                <AreaChart data={revenueTrend} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="revenue"
                    type="natural"
                    fill="var(--color-revenue)"
                    fillOpacity={0.4}
                    stroke="var(--color-revenue)"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                No revenue data!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RadarChartComponent />

        {/* Plan Popularity */}
        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Subscription plan popularity</CardDescription>
          </CardHeader>
          <CardContent>
            {planPopularity?.length ? (
              <ChartContainer
                config={{
                  Professional: {
                    label: "Professional",
                    color: "hsl(var(--chart-1))",
                  },
                  Basic: {
                    label: "Basic",
                    color: "hsl(var(--chart-2))",
                  },
                  Enterprise: {
                    label: "Enterprise",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={planPopularity}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {planPopularity.reduce(
                                  (acc, curr) => acc + curr.count,
                                  0
                                )}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Total Plans
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                No plan popularity data!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Templates */}
        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader>
            <CardTitle>Popular Templates</CardTitle>
            <CardDescription>Most used templates by users</CardDescription>
          </CardHeader>
          <CardContent>
            {topTemplates.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Usage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTemplates.map((template, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {template.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{template.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {template.usageCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground">
                No popular templates found!
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Activity Summary */}
        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Platform activity breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {userActivity.length ? (
              <div className="space-y-4">
                {userActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="font-medium">{activity.type}</div>
                    <div className="text-2xl font-bold">{activity.count}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No user activity data!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Error Logs */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
            <CardDescription>
              Latest user actions on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b last:border-0"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {activity.type === "login" &&
                            `${activity.user.name} logged in`}
                          {activity.type === "project_created" &&
                            `${activity.user.name} created "${activity?.projectName}"`}
                          {activity.type === "payment_completed" &&
                            `${activity.user.name} upgraded to ${activity?.planName}`}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          {formateFullDate(activity.date)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No recent activity data!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Logs */}
        <Card className="dark:bg-zinc-900 border dark:border-zinc-800">
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Recent errors and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            {errorLogs.length ? (
              <div className="space-y-4">
                {errorLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b last:border-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        log.level === "error" ? "bg-red-500" : "bg-yellow-500"
                      }`}
                    ></div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{log.message}</p>
                        <Badge
                          variant={
                            log.level === "error" ? "destructive" : "secondary"
                          }
                        >
                          {log.statusCode}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{log.method}</span>
                        <span>{log.path}</span>
                        <span>•</span>
                        <span>{formateFullDate(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No system logs found!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
