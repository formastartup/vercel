"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SettingsIcon, UsersIcon, PackageIcon, Shield, Warehouse } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const routes = [
  { label: "Home", href: "", icon: GoHome, activeIcon: GoHomeFill },
  {
    label: "Minhas Tarefas",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
];

const cadastros = [
  {
    label: "EPIs",
    href: "/epis",
    icon: Shield,
    activeIcon: Shield,
  },
  {
    label: "Estoques",
    href: "/estoques",
    icon: Warehouse,
    activeIcon: Warehouse,
  },
];

const settingsRoutes = [
  {
    label: "Configurações",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Membros",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  // Verificar se alguma rota de cadastros está ativa
  const isCadastrosActive = cadastros.some((item) => {
    const fullHref = `/workspaces/${workspaceId}${item.href}`;
    return pathname === fullHref;
  });

  return (
    <ul className="flex flex-col">
      {/* Rotas principais */}
      {routes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        );
      })}

      {/* Accordion de Cadastros */}
      <Accordion
        type="single"
        collapsible
        defaultValue={isCadastrosActive ? "cadastros" : undefined}
        className="w-full"
      >
        <AccordionItem value="cadastros" className="border-none">
          <AccordionTrigger
            className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500 hover:no-underline",
              isCadastrosActive && "text-primary"
            )}
          >
            <div className="flex items-center gap-2.5 flex-1"> 
              <PackageIcon className="size-5 text-neutral-500" />
              <span>Cadastros</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0 pt-1">
            <div className="flex flex-col ml-7 space-y-1">
              {cadastros.map((item) => {
                const fullHref = `/workspaces/${workspaceId}${item.href}`;
                const isActive = pathname === fullHref;
                const Icon = isActive ? item.activeIcon : item.icon;

                return (
                  <Link key={item.href} href={fullHref}>
                    <div
                      className={cn(
                        "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500 text-sm",
                        isActive &&
                          "bg-white shadow-sm hover:opacity-100 text-primary"
                      )}
                    >
                      <Icon className="size-4 text-neutral-500" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Rotas de configurações */}
      {settingsRoutes.map((item) => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link key={item.href} href={fullHref}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
