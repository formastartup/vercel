import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import { DottedSeparator } from "./dotted-separator";

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <ScrollBar orientation="horizontal" />
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Todas as Tarefas"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Tarefas Atribuídas"
            value={data.assignedTaskCount}
            variant={data.assignedTaskCount > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskCount}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Tarefas Concluídas"
            value={data.completedTaskCount}
            variant={data.completedTaskCount > 0 ? "up" : "down"}
            increaseValue={data.completedTaskCount}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Tarefas Incompletas"
            value={data.inCompleteTaskCount}
            variant={data.inCompleteTaskCount > 0 ? "up" : "down"}
            increaseValue={data.inCompleteTaskCount}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Tarefas Atrasadas"
            value={data.overDueTaskCount}
            variant={data.overDueTaskCount > 0 ? "up" : "down"}
            increaseValue={data.overDueTaskCount}
          />
          <DottedSeparator direction="vertical" />
        </div>
      </div>
    </ScrollArea>
  );
};
