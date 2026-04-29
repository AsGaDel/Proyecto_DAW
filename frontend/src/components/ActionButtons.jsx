import { useLocation } from "react-router-dom";

export default function ActionButtons({ actions = [] }) {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-row lg:flex-col gap-2 w-full min-w-0 lg:rounded-lg lg:border lg:border-gray-100 lg:bg-white lg:shadow-sm lg:overflow-hidden lg:p-2">

        <div className="font-bold text-gray-500 uppercase text-md m-3 hidden overflow-hidden lg:inline">
          Acciones
        </div>
      {actions.map(({ label, svg, onClick, href }) => {
        const isActive = href && pathname === href;
        return (
          <button
            key={label}
            onClick={onClick}
            title={label}
            className={`flex flex-1 min-w-0 truncate items-center justify-center lg:justify-start gap-2 lg:border border-gray-100 lg:shadow-sm w-full px-3 py-5 rounded-lg transition-colors duration-200 leading-tight uppercase lg:font-bold lg:text-sm
                ${isActive
                  ? "text-blue-500 bg-blue-50 border border-blue-300"
                  : "bg-white text-gray-600 lg:hover:bg-gray-00 lg:hover:text-blue-500"
                }`
            }
          >
            <div>{svg}</div>
            {<span className="hidden lg:inline truncate">{label}</span>}
          </button>
        );
      })}
    </div>
  );
}