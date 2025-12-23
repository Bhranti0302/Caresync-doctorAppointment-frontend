function Form({
  fields,
  form,
  errors,
  handleChange,
  handleSubmit,
  submitText,
}) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="text-stone-700 font-medium">{field.label}</label>

          {field.type === "select" ? (
            <select
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="border border-stone-300 rounded-md px-4 py-2 focus:outline-blue-500"
            >
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={field.name}
              type={field.type || "text"}
              value={form[field.name]}
              onChange={handleChange}
              className="border border-stone-300 rounded-md px-4 py-2 focus:outline-blue-500"
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
          )}

          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md py-2.5 mt-3 transition"
      >
        {submitText}
      </button>
    </form>
  );
}

export default Form;
