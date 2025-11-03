import { Link, NavLink } from "react-router";

export default function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur dark:border-gray-800/60 dark:bg-gray-950/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-semibold tracking-tight">
          MySite
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavItem to="/home" label="首页" />
          <NavItem to="/notes" label="笔记" />
          <NavItem to="/new-note" label="新建" />
          <NavItem to="/dashboard" label="仪表盘" />
        </nav>
      </div>
    </header>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-900 ${
          isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"
        }`
      }
      prefetch="intent"
    >
      {label}
    </NavLink>
  );
}


