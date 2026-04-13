/* import Stat from "../components/Stat"; */
 
export default function StatGrid({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {stats.map((stat) => (
/*         <Stat key={stat.id} label={stat.label} value={stat.value} /> */
        <div key={stat.label} className="flex flex-col h-full justify-between bg-gray-100 dark:bg-gray-600 border shadow-sm border-gray-200 dark:border-gray-800 rounded-md px-3 py-4">
          <div className="text-center text-md font-semibold text-gray-600 dark:text-gray-100 mb-1">{stat.label}</div>
          <div className="text-center text-4xl font-extrabold text-gray-600 dark:text-gray-100">{stat.value}</div>
      </div>
      ))}
    </div>
  );
}