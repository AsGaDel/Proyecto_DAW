export default function ActionButtons({ actions = [], isCompact = false }) {
  return (
    <div className={isCompact
      ? "grid grid-cols-4 gap-2 w-full min-w-0 lg:rounded-lg lg:border lg:border-gray-100 lg:bg-white lg:shadow-sm lg:overflow-hidden lg:p-2 lg:mb-3"
      : "flex flex-row lg:flex-col gap-2 w-full min-w-0 lg:rounded-lg lg:border lg:border-gray-100 lg:bg-white lg:shadow-sm lg:overflow-hidden lg:p-2"
    }>
      {!isCompact && (
        <div className="font-bold text-gray-500 uppercase text-md m-3 hidden overflow-hidden lg:inline">
          Acciones
        </div>
      )}
      {actions.map(({ label, svg, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          title={isCompact ? label : undefined}
          className={isCompact
            ? "aspect-square flex items-center justify-center bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-blue-500 active:bg-gray-100 rounded-lg transition-colors duration-200"
            : "flex items-center justify-start gap-2 bg-white lg:border border-gray-100 text-blue-500 lg:hover:bg-gray-100 lg:hover:text-blue-500 lg:active:bg-gray-200 lg:active:text-blue-400 lg:text-gray-600 lg:text-xs lg:font-bold md:text-sm lg:shadow-sm w-full px-3 py-5 rounded-lg transition-colors duration-200 leading-tight uppercase"
          }
        >
          <div>{svg}</div>
          {!isCompact && <span className="hidden lg:inline truncate">{label}</span>}
        </button>
      ))}
    </div>
  );
}