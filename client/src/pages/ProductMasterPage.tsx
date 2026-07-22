import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import api from "../api";
import Swal from "sweetalert2";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface Product {
  id: number;
  productCode: string;
  productName: string;
  category: string;
}

const emptyProduct: Product = {
  id: 0,
  productCode: "",
  productName: "",
  category: "",
};

export default function ProductMasterPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product>(emptyProduct);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const loadData = async () => {
    const res = await api.get("/master/products");
    setProducts(res.data.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/master/products");
      setProducts(res.data.data);
    };

    fetchData();
  }, []);

  const saveProduct = async () => {
    try {
      if (editing.id === 0) {
        await api.post("/master/products/create", editing);
        setOpen(false);

        await Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã thêm sản phẩm thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await api.put(`/master/products/${editing.id}`, editing);
        setOpen(false);

        await Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã cập nhật sản phẩm!",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      await loadData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: err.response?.data?.message ?? err.message,
        });
      }
    }
  };

  const handleAdd = () => {
    setEditing(emptyProduct);
    setOpen(true);
  };

  const handleEdit = (item: Product) => {
    setEditing(item);
    setOpen(true);
  };

  const handleDelete = async (item: Product) => {
    const result = await Swal.fire({
      title: "Xóa sản phẩm?",
      text: `Bạn có chắc muốn xóa ${item.productName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/master/products/${item.id}`);

      await Swal.fire({
        icon: "success",
        title: "Đã xóa!",
        timer: 1500,
        showConfirmButton: false,
      });

      await loadData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: err.response?.data?.message ?? err.message,
        });
      }
    }
  };

  const filtered = useMemo(() => {
    const key = keyword.toLowerCase();

    return products.filter(
      (x) =>
        x.productCode.toLowerCase().includes(key) ||
        x.productName.toLowerCase().includes(key) ||
        x.category.toLowerCase().includes(key),
    );
  }, [products, keyword]);

  const paginatedProducts = useMemo(() => {
    const start = page * rowsPerPage;

    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Thêm sản phẩm Master
        </Button>
      </Stack>

      <TextField
        fullWidth
        size="small"
        placeholder="Tìm theo Code, Tên hoặc Nhóm..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setPage(0);
        }}
        sx={{ mb: 3 }}
      />

      <Paper>
        <TableContainer
          sx={{
            height: 420, // chiều cao cố định
            overflow: "auto",
          }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={180}>Code</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell width={220}>Loại hàng</TableCell>
                <TableCell width={120} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedProducts.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>{item.productCode}</TableCell>

                  <TableCell>{item.productName}</TableCell>

                  <TableCell>{item.category}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(item)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm">
        <DialogTitle>
          {editing.id === 0 ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Product Code"
              value={editing.productCode}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  productCode: e.target.value,
                })
              }
            />

            <TextField
              label="Product Name"
              value={editing.productName}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  productName: e.target.value,
                })
              }
            />

            <TextField
              label="Category"
              value={editing.category}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  category: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>

          <Button variant="contained" onClick={saveProduct}>
            {editing.id === 0 ? "Thêm mới" : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
