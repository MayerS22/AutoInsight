"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { jobTitle: "Data Analyst", users: 100, fill: "hsl(var(--chart-1))" },
  { jobTitle: "Data Engineer", users: 73, fill: "hsl(var(--chart-2))" },
  { jobTitle: "Data Scientist", users: 48, fill: "hsl(var(--chart-3))" },
  { jobTitle: "Manager", users: 29, fill: "hsl(var(--chart-4))" },
  { jobTitle: "Others", users: 10, fill: "hsl(var(--chart-5))" },
];

const chartConfig = {
  users: {
    label: "Users",
  },
  "Data Analyst": {
    label: "Data Analyst",
    color: "hsl(var(--chart-1))",
  },
  "Data Engineer": {
    label: "Data Engineer",
    color: "hsl(var(--chart-2))",
  },
  "Data Scientist": {
    label: "Data Scientist",
    color: "hsl(var(--chart-3))",
  },
  Manager: {
    label: "Manager",
    color: "hsl(var(--chart-4))",
  },
  Others: {
    label: "Others",
    color: "hsl(var(--chart-5))",
  },
};

export function TopJobTitles() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Job Titles</CardTitle>
        <CardDescription>Distribution of Users by Job Titles</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="jobTitle"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex ?? undefined}
              activeShape={({ outerRadius = 0, ...props }) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing the distribution of users by job titles
        </div>
      </CardFooter>
    </Card>
  );
}

export default TopJobTitles;