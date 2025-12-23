function Table({ columns = [], data = [], renderCell, className = "" }) {
  return (
    <div
      className={`overflow-x-auto bg-white border border-stone-200 rounded-md ${className}`}
    >
      <table className="w-full border-collapse hidden md:table">
        <thead className="bg-stone-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="p-3 text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="border-t border-stone-200">
              {columns.map((col) => (
                <td key={col.key} className="p-3">
                  {renderCell ? renderCell(col, row, rowIndex) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---- RESPONSIVE VIEW (sm to md) ----- */}
      <div className="md:hidden flex flex-col divide-y">
        {data.map((row, rowIndex) => (
          <div key={row.id || rowIndex} className="p-4 grid gap-4">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between">
                <span className="font-medium">{col.label}</span>
                <span>
                  {renderCell ? renderCell(col, row, rowIndex) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Table;
