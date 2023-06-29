import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
  return (
    <>
        <nav className="fixed bg-white w-full border-b border-gray-200 z-20 top-0 left-0">
            <div className="max-w-screen-xl flex flex-wrap">
                <NavLink   className={({ isActive }) =>
                    "navLink" + (isActive ? " active" : "")
                } to="/">
                        Tasks
                </NavLink>

                <NavLink   className={({ isActive }) =>
                    "navLink" + (isActive ? " active" : "")
                } to="/add">
                        Add
                </NavLink>

            </div>
        </nav>

        <div className="mt-14 p-4">
            <Outlet />
        </div>
    </>
  )
};

export default Layout;