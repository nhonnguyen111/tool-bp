import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="h-screen flex bg-slate-100">
      <Sidebar open={open} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header open={open} setOpen={setOpen} />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
