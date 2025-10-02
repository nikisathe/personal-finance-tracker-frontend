import React from "react";

const NavLink = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? "bg-blue-100 text-primary"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen, user, onLogout }) => {
  const handleNavigation = (view) => {
    setActivePage(view);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {user && (
        <div
          className="flex items-center gap-3 px-4 py-4 border-b cursor-pointer hover:bg-gray-50"
          onClick={() => handleNavigation("Profile")}
        >
          <img
            src={
              user.profile_image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.full_name || "User"
              )}&background=0D8ABC&color=fff`
            }
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-800">
              {user.full_name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 px-4 py-6 space-y-2">
        <h4 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Management
        </h4>
        <NavLink
          icon="🏠"
          label="Dashboard"
          isActive={activePage === "Dashboard"}
          onClick={() => handleNavigation("Dashboard")}
        />
        <NavLink
          icon="➕"
          label="Add Income / Expense"
          isActive={activePage === "AddIncomeExpense"}
          onClick={() => handleNavigation("AddIncomeExpense")}
        />
        <NavLink
          icon="📂"
          label="Manage Expenses"
          isActive={activePage === "ManageExpenses"}
          onClick={() => handleNavigation("ManageExpenses")}
        />
        <NavLink
          icon="🎯"
          label="Goals"
          isActive={activePage === "Goals"}
          onClick={() => handleNavigation("Goals")}
        />
       

        <h4 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Account
        </h4>

        {!user && (
          <>
            <NavLink
              icon="🔑"
              label="Login"
              isActive={activePage === "Login"}
              onClick={() => handleNavigation("Login")}
            />
            <NavLink
              icon="📝"
              label="Sign Up"
              isActive={activePage === "SignUp"}
              onClick={() => handleNavigation("SignUp")}
            />
          </>
        )}

        {user && (
          <NavLink
            icon="🚪"
            label="Logout"
            isActive={false}
            onClick={onLogout}
          />
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="w-64 bg-white border-r">{sidebarContent}</div>
        <div
          className="flex-1 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-shrink-0 w-64">
        <div className="flex flex-col w-64 bg-white border-r">{sidebarContent}</div>
      </aside>
    </>
  );
};

export default Sidebar;
