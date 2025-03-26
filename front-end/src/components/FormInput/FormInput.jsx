import './FormInput.css';

export default function FormInput({
  type,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete = 'off',
}) {
  return (
    <div className='form-input'>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
}
