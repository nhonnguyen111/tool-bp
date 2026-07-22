import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Swal from "sweetalert2";
import { FirebaseError } from "firebase/app";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng nhập đầy đủ Email và Mật khẩu.",
      });

      return;
    }
    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const token = await userCredential.user.getIdToken();

      localStorage.setItem("token", token);
      await Swal.fire({
        icon: "success",
        title: "Đăng nhập thành công",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/", { replace: true });
    } catch (error: unknown) {
      let message = "Có lỗi xảy ra khi đăng nhập.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            message = "Email không đúng định dạng.";
            break;

          case "auth/user-not-found":
          case "auth/invalid-credential":
            message = "Email hoặc mật khẩu không chính xác.";
            break;

          case "auth/wrong-password":
            message = "Mật khẩu không chính xác.";
            break;

          case "auth/too-many-requests":
            message = "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau.";
            break;

          case "auth/network-request-failed":
            message = "Không thể kết nối đến máy chủ.";
            break;

          default:
            message = error.message;
        }
      }

      await Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        text: message,
        confirmButtonText: "Đóng",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Submit");

    await handleLogin();
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#1976d2 0%,#42a5f5 50%,#90caf9 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}>
      <Paper
        elevation={8}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 4,
        }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Box
            sx={{
              width: 72,
              height: 72,
              bgcolor: "primary.main",
              color: "#fff",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}>
            <Lock sx={{ fontSize: 36 }} />
          </Box>

          <Typography variant="h4" fontWeight={700}>
            Shipment Tool
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Đăng nhập để sử dụng hệ thống
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 4,
              height: 50,
              borderRadius: 3,
              fontWeight: 700,
              textTransform: "none",
              fontSize: 17,
            }}>
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </Box>
        <Typography
          textAlign="center"
          mt={4}
          color="text.secondary"
          fontSize={13}>
          © 2026 Shipment Tool
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
