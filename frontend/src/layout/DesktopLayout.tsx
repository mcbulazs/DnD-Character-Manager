import { Scrollbars } from "react-custom-scrollbars-2";
import { Outlet } from "react-router-dom";
import { useHeaderContext } from "./Contexts/HeaderContext";
import Menu from "./components/Sidebar";
import Background from "/publicfile_bg.jpg";

const DesktopLayout = () => {
  const { title } = useHeaderContext();

  // TODO: give more thought to background!
  return (
    <div className="h-dvh">
      <Scrollbars
        style={{
          background: `url(${Background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className=""
        universal
      >
        <header className="bg-ancient-gold text-white px-4 py-1 h-16 flex items-center justify-between text-3xl">
          <Menu />
          <div className="flex-1 text-center">{title}</div>
        </header>
        <main className="py-10 px-0 sm:px-10 flex justify-center">
          <Outlet />
        </main>
      </Scrollbars>
    </div>
  );
};

export default DesktopLayout;
