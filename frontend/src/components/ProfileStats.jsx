export default function ProfileStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, icon }) => (
        <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-blue-500 flex justify-center mb-1">
            {icon}
          </div>
          <p className="text-xl font-black text-gray-800">{value}</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
        </div>
      ))}
    </div>
  );
}