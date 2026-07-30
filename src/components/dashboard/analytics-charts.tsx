"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/localization"

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f43f5e",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
]

type ChartDatum = {
  name: string
  value: number
}

type ChartProps = {
  data: ChartDatum[]
  currency: string
  locale: string
}

export function SpendingChart({
  data,
  currency,
  locale,
}: ChartProps) {
  const preferences = { currency, locale }

  return (
    <Card className="lg:col-span-2 border-none shadow-xl rounded-3xl bg-white overflow-hidden">
      <CardHeader className="pb-0 pt-6 px-8">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
          Spending Trend
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[300px] w-full px-2 pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="colorValue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#6366f1"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="#6366f1"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
                fontWeight: 600,
              }}
              dy={10}
            />

            <YAxis hide />

            <Tooltip
              formatter={(value) => [
                formatCurrency(
                  Array.isArray(value) ? Number(value[0]) : Number(value),
                  preferences,
                ),
                "Amount",
              ]}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function CategoryPie({
  data,
  currency,
  locale,
}: ChartProps) {
  const preferences = { currency, locale }

  return (
    <Card className="border-none shadow-xl rounded-3xl bg-white overflow-hidden">
      <CardHeader className="pb-0 pt-6 px-8">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
          Categories
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[300px] w-full pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={8}
              dataKey="value"
              cornerRadius={10}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name ?? index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [
                formatCurrency(
                  Array.isArray(value) ? Number(value[0]) : Number(value),
                  preferences,
                ),
                String(name),
              ]}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow:
                  "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
                fontWeight: "600",
              }}
            />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "12px",
                fontWeight: "700",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
