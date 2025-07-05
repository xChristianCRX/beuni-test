import { Link, Outlet, useLocation } from "react-router-dom";
import { useContextSelector } from "use-context-selector";
import { AuthContext } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Building2,
  Gift,
  Send,
  LogOut,
} from "lucide-react";

export function Layout() {
  const logout = useContextSelector(AuthContext, (ctx) => ctx.logout);
  const location = useLocation();

  const menuItems = [
    { label: "Início", to: "/", icon: <Home size={18} /> },
    { label: "Usuários", to: "/usuarios", icon: <Users size={18} /> },
    { label: "Departamentos", to: "/departamentos", icon: <Building2 size={18} /> },
    { label: "Kits", to: "/kits", icon: <Gift size={18} /> },
    { label: "Aniversariantes", to: "/aniversariantes", icon: <Gift size={18} /> },
    { label: "Envios", to: "/envios", icon: <Send size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#fef7f0]">
      {/* Sidebar */}
      <aside className="w-64 h-screen sticky top-0 flex flex-col justify-between bg-gradient-to-b from-[#D35400] to-[#FF7F50] text-white p-6 shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold mb-10 tracking-tight text-white">
            Be<span className="text-yellow-200">uni</span>
          </h1>

          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#d14900]/70 transition-all",
                      location.pathname === item.to ? "bg-[#b43e00]" : ""
                    )}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <Separator className="bg-white/30 my-4" />
          <Button
            variant="destructive"
            onClick={logout}
            className="flex gap-2 items-center w-full"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
