import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXSrR-8K2pOcaWHXZevcnQ605v5PcBLOA",
  authDomain: "shipment-tool.firebaseapp.com",
  projectId: "shipment-tool",
  storageBucket: "shipment-tool.firebasestorage.app",
  messagingSenderId: "251441137760",
  appId: "1:251441137760:web:7659f70c282c61eff69b05",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);

export default app;