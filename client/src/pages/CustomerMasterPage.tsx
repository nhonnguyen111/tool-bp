import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
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
  DialogContent,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import api from "../api";
import Swal from "sweetalert2";
import axios from "axios";
import BusinessIcon from "@mui/icons-material/Business";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Customer {
  id: number;
  cvCode: string;
  cvName: string;
  shipToCode: string;
  address: string;
}

const emptyCustomer: Customer = {
  id: 0,
  cvCode: "",
  cvName: "",
  shipToCode: "",
  address: "",
};

const CustomerMasterPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [keyword, setKeyword] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer>(emptyCustomer);
  const [originalKey, setOriginalKey] = useState({
    cvCode: "",
    shipToCode: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const filtered = useMemo(() => {
    const key = keyword.toLowerCase();

    return customers.filter(
      (x) =>
        x.cvCode.toLowerCase().includes(key) ||
        x.cvName.toLowerCase().includes(key) ||
        x.shipToCode.toLowerCase().includes(key) ||
        x.address.toLowerCase().includes(key),
    );
  }, [customers, keyword]);
  const loadData = async () => {
    const res = await api.get("/master/customers");
    setCustomers(res.data.data);
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/master/customers");
      setCustomers(res.data.data);
    };

    fetchData();
  }, []);
  const handleSave = async () => {
    try {
      if (
        !editing.cvCode.trim() ||
        !editing.cvName.trim() ||
        !editing.shipToCode.trim() ||
        !editing.address.trim()
      ) {
        await Swal.fire({
          icon: "warning",
          title: "Thiếu thông tin",
          text: "Vui lòng nhập đầy đủ thông tin.",
        });

        return;
      }

      if (editing.id === 0) {
        // Thêm mới
        await api.post("/master/customers/create", editing);
        setOpen(false);

        await Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã thêm khách hàng.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Cập nhật
        await api.put(
          `/master/customers/edit/${originalKey.cvCode}/${originalKey.shipToCode}`,
          editing,
        );
        setOpen(false);

        await Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã cập nhật khách hàng.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setEditing(emptyCustomer);

      await loadData();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        await Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: err.response?.data?.message ?? err.message,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra.",
        });
      }
    }
  };
  const handleDelete = async (item: Customer) => {
    const result = await Swal.fire({
      title: "Xóa khách hàng?",
      text: `${item.cvName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    await api.delete(
      `/master/customers/delete/${item.cvCode}/${item.shipToCode}`,
    );

    await loadData();

    Swal.fire({
      icon: "success",
      title: "Đã xóa",
      timer: 1200,
      showConfirmButton: false,
    });
  };
  const paginatedCustomers = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  return (
    <Box
      sx={{
        height: "calc(100vh - 130px)",
        display: "flex",
        flexDirection: "column",
      }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(emptyCustomer);

            setOriginalKey({
              cvCode: "",
              shipToCode: "",
            });

            setOpen(true);
          }}>
          Thêm khách hàng Master
        </Button>
      </Stack>

      <TextField
        size="small"
        fullWidth
        placeholder="Tìm theo Code, Tên hoặc Địa chỉ..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setPage(0);
        }}
        sx={{ mb: 2 }}
      />

      <Paper
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}>
        <TableContainer
          sx={{
            height: 420, // chiều cao cố định
            overflow: "auto",
          }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell width={170}>CV Code</TableCell>
                <TableCell>CV Name</TableCell>
                <TableCell width={170}>ShipTo Code</TableCell>
                <TableCell>Address</TableCell>
                <TableCell width={120} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedCustomers.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>{item.cvCode}</TableCell>

                  <TableCell>{item.cvName}</TableCell>

                  <TableCell>{item.shipToCode}</TableCell>

                  <TableCell>{item.address}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditing({ ...item });

                        setOriginalKey({
                          cvCode: item.cvCode,
                          shipToCode: item.shipToCode,
                        });

                        setOpen(true);
                      }}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => handleDelete(item)}
                      color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
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
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}>
        <DialogTitle>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BusinessIcon color="primary" />

            <Typography variant="h6" fontWeight={700}>
              {editing.id === 0
                ? "Thêm khách hàng Master"
                : "Cập nhật khách hàng"}
            </Typography>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="CV Code"
              placeholder="Nhập CV Code..."
              value={editing.cvCode}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  cvCode: e.target.value,
                })
              }
            />

            <TextField
              fullWidth
              label="CV Name"
              placeholder="Nhập tên khách hàng..."
              value={editing.cvName}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  cvName: e.target.value,
                })
              }
            />

            <TextField
              fullWidth
              label="ShipTo Code"
              placeholder="Nhập ShipTo Code..."
              value={editing.shipToCode}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  shipToCode: e.target.value,
                })
              }
            />

            <TextField
              fullWidth
              label="Address"
              placeholder="Nhập địa chỉ..."
              multiline
              minRows={3}
              value={editing.address}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  address: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setOpen(false)}>
            Hủy
          </Button>

          <Button variant="contained" onClick={handleSave}>
            {editing.id === 0 ? "Thêm mới" : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerMasterPage;
