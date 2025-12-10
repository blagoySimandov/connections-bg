import { Outlet } from "react-router";
import { Navbar } from "./navbar";

export function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
