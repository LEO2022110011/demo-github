import { useState } from 'react';

const useFormValidation = (validate, initalValue) => {
  const [value, setValue] = useState(initalValue || "");
  const [error, setError] = useState('');

  const handleChange = event => {
    setValue(event.target.value);
    setError(validate(event.target.value));
  };

  const handleSubmit = event => {
    if (event) event.preventDefault();
    const error = validate(value)
    setError(validate(value));
    return error
  };

  return {
    handleChange,
    handleSubmit,
    value,
    error,
  };
};

export default useFormValidation;
