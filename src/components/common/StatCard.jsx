function StatCard({ icon, count, label }) {
  return (
    <div className="flex items-center gap-4 bg-white px-4 py-3 shadow rounded-lg">
      <img src={icon} alt={label} className="w-10 h-10" />
      <div className="flex flex-col">
        <h6 className="text-lg font-semibold">{count}</h6>
        <p className="text-md text-stone-600">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
