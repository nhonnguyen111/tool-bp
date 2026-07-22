import { Menu } from "lucide-react";

interface HeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ open, setOpen }: HeaderProps) {
  return (
    <header className="bg-white h-16 shadow flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setOpen(!open)}>
          <Menu />
        </button>

        <h1 className="font-bold text-xl">Công cụ tạo file tự động</h1>
      </div>

      {/* <div className="flex gap-3">
        <button className="h-10 px-5 rounded-lg bg-blue-600 text-white flex items-center gap-2">
          <Upload size={18} />
          Tạo File
        </button>

        <button className="h-10 px-5 rounded-lg bg-green-600 text-white flex items-center gap-2">
          <Download size={18} />
          Download ZIP
        </button>
      </div> */}
    </header>
  );
}
