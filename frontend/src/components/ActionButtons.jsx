  export default function ActionButtons({actions = []}) {
  return (
    <div className="flex flex-row md:flex-col gap-2 w-full min-w-0
      md:rounded-lg md:border md:border-gray-200 md:dark:border-gray-500 md:bg-gray-100 md:dark:bg-gray-600 md:shadow-sm md:overflow-hidden md:p-2">
      <div className="font-bold text-gray-500 dark:text-gray-400 uppercase text-md m-3 hidden overflow-hidden md:inline">Acciones</div>
      {actions.map(({ label, svg, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="flex items-center justify-start gap-2 bg-gray-100 dark:bg-gray-600 md:border border-gray-200 text-blue-500 
          md:hover:bg-gray-200 dark:md:hover:bg-gray-500 md:hover:text-blue-500 md:active:bg-gray-300 dark:md:active:bg-gray-400 md:active:text-blue-400 
          md:text-gray-600 dark:md:text-gray-100 md:text-xs md:font-bold lg:text-sm md:shadow-sm w-full px-3 py-5 rounded-lg transition-colors duration-200 leading-tight uppercase">
          <div>{svg}</div>
          <span className="hidden md:inline truncate">{label}</span>
        </button>
      ))}
    </div>  
  );
}