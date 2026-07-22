import { FileSpreadsheet, LogOut, Package, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Đăng xuất?",
      text: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#1976d2",
    });

    if (!result.isConfirmed) return;

    try {
      await signOut(auth);

      localStorage.removeItem("token");

      await Swal.fire({
        icon: "success",
        title: "Đăng xuất thành công",
        timer: 1200,
        showConfirmButton: false,
      });

      await signOut(auth);

      localStorage.clear();
      sessionStorage.clear();

      navigate("/login", { replace: true });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể đăng xuất.",
      });
    }
  };
  const menu = [
    {
      title: "Tạo file kiểm dịch",
      icon: <FileSpreadsheet size={20} />,
      path: "/",
    },
    {
      title: "Danh sách sản phẩm",
      icon: <Package size={20} />,
      path: "/products",
    },
    {
      title: "Danh sách khách hàng",
      icon: <User size={20} />,
      path: "/customer",
    },
    {
      title: "Đăng xuất",
      icon: <LogOut size={20} />,
      onClick: handleLogout,
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-white transition-all duration-300 ${
        open ? "w-64" : "w-20"
      }`}>
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-slate-700">
        {open ? "Logistics Center" : "LC"}
      </div>

      <div className="p-4 space-y-2">
        {menu.map((item) =>
          item.path ? (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full p-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 text-slate-200"
                }`
              }>
              {item.icon}
              {open && <span>{item.title}</span>}
            </NavLink>
          ) : (
            <button
              key={item.title}
              onClick={item.onClick}
              className="flex items-center gap-3 w-full p-3 rounded-lg transition hover:bg-red-600 text-slate-200">
              {item.icon}
              {open && <span>{item.title}</span>}
            </button>
          ),
        )}
      </div>
    </aside>
  );
}
