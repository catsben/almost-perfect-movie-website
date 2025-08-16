import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Film,
  Tv,
  Heart,
  History,
  Radio,
  Gamepad2,
  Play,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Movies", href: "/movies", icon: Film },
  { name: "TV Shows", href: "/tv", icon: Tv },
  { name: "Anime", href: "/anime", icon: Gamepad2 },
  { name: "K-Drama", href: "/k-drama", icon: Play },
  { name: "Live TV", href: "/live-tv", icon: Radio },
  { name: "Watchlist", href: "/watchlist", icon: Heart },
  { name: "History", href: "/history", icon: History },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border">
          <Film className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold text-sidebar-foreground">
            StreamFlix
          </span>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors",
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive
                              ? "text-sidebar-primary"
                              : "text-sidebar-foreground group-hover:text-sidebar-primary",
                            "h-6 w-6 shrink-0",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
