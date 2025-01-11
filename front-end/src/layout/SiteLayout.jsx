import { Outlet } from "react-router-dom";

export default function SiteLayout() {
  return (
    <>
      {/* <Header /> */}
      <div className="content">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </>
  );
}