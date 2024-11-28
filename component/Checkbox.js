
const Checkbox = ({ label, checked, onChange, size = 'h-4 w-4', color = 'bg-blue-600' }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="hidden"
        // checked={checked}
        onChange={onChange}
      />
      <span
        className={`inline-block ${size} border-2 border-gray-300 rounded-sm transition-colors duration-200 ${checked ? `${color} border-transparent` : 'bg-white'}`}
      >
        {checked && (
          <svg
            className="w-full h-full text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="ml-2">{label}</span>
    </label>
  );
};

export default Checkbox;