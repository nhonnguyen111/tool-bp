import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "./auth-context";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (!currentUser) {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return;
      }

      const token = await currentUser.getIdToken();

      localStorage.setItem("token", token);

      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
