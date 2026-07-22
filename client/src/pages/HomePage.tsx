import React, { useRef, useState } from "react";
import { Upload, Loader2, FileSpreadsheet, Download } from "lucide-react";
import api from "../api";
import axios from "axios";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Typography,
  Chip,
} from "@mui/material";
import Swal from "sweetalert2";

interface MissingProduct {
  productCode: string;
  productName: string;
}

const HomePage = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const API = import.meta.env.VITE_SERVER_URL;

  const [missingProducts, setMissingProducts] = useState<MissingProduct[]>([]);

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setFile(e.target.files[0]);
    setDownloadUrl("");
  };

  const handleGenerate = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Chưa chọn file",
        text: "Vui lòng chọn file Excel trước.",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/shipment/upload", formData);

      setMissingProducts(response.data.missingProducts ?? []);
      setDownloadUrl(API + response.data.downloadUrl);

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã tạo file thành công!",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        Swal.fire({
          icon: "error",
          title: "Tạo file thất bại",
          text: err.response?.data?.message || err.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Tạo file thất bại",
          text: "Có lỗi xảy ra.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-5 shadow-xl">
            <Loader2 className="animate-spin text-blue-600 w-12 h-12" />

            <h2 className="text-xl font-semibold">Đang xử lý file...</h2>

            <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      )}

      <div className="h-screen bg-slate-100 flex flex-col gap-2">
        {/* ================= Upload ================= */}

        <div className="bg-white rounded-2xl shadow-lg p-6 h-[240px] flex flex-col">
          <div className="flex gap-5 flex-1">
            {/* Upload */}

            <div
              onClick={handleChooseFile}
              className="flex-1 border-2 border-dashed border-blue-300 rounded-xl hover:bg-blue-50 cursor-pointer flex items-center justify-center transition">
              <div className="text-center">
                <Upload className="mx-auto text-blue-600 w-12 h-12" />

                <h2 className="mt-3 text-lg font-semibold">
                  Chọn file Shipment
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Click hoặc kéo file Excel vào đây
                </p>
              </div>

              <input
                hidden
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </div>

            {/* Right */}

            <div className="w-[330px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="text-green-600" />

                  <div>
                    <p className="font-semibold">
                      {file ? file.name : "Chưa chọn file"}
                    </p>

                    {file && (
                      <p className="text-gray-500 text-sm">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  disabled={!file || loading}
                  onClick={handleGenerate}
                  className="h-12 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300">
                  {loading ? "Đang tạo..." : "TẠO FILE"}
                </button>

                <a
                  href={downloadUrl}
                  download
                  className={`h-12 rounded-lg flex items-center justify-center gap-2 text-white font-semibold transition
                  ${
                    downloadUrl
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-300 pointer-events-none"
                  }`}>
                  <Download size={20} />
                  DOWNLOAD FILE
                </a>
              </div>
            </div>
          </div>
        </div>
        {missingProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6" fontWeight={700}>
                Danh sách sản phẩm chưa có nhóm
              </Typography>

              <Chip
                color="warning"
                label={`${missingProducts.length} sản phẩm`}
              />
            </div>

            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 400,
              }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={80}>STT</TableCell>

                    <TableCell width={220}>Product Code</TableCell>

                    <TableCell>Tên sản phẩm</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {missingProducts.map((item, index) => (
                    <TableRow key={item.productCode} hover>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell>{item.productCode}</TableCell>

                      <TableCell>{item.productName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
