import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.myapp",
  appName: "My Solana App",
  webDir: "out",
  server: {
    androidScheme: "https",  // use https for internal web serving
  },
  plugins: {
    Browser: {},
    App: {},
  },
};

export default config;
