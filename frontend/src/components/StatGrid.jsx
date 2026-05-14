export default function StatGrid({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          onClick={stat.onClick}
          className={`flex flex-col h-full justify-between bg-white border shadow-sm border-gray-100 rounded-md px-3 py-4
            ${stat.onClick ? "lg:cursor-pointer lg:hover:border-gray-200 lg:hover:shadow-blue-200 transition-all duration-200" : ""}`}
        >
          <div className="text-center text-md font-semibold text-gray-600">{stat.label}</div>
          <div className="text-center text-4xl font-extrabold text-gray-600">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}