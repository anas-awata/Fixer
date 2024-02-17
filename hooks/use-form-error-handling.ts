const useFormErrorHandling = (error: any, setError: any) => {
  if (error.response && error.response.status == 400) {
    const errorData = error.response.data;
    console.log("errorDAta", errorData);
    // Iterate through each field in the error object
    Object.keys(errorData).forEach((field) => {
      // Set error for each field
      setError(field, {
        type: "manual",
        message: errorData[field][0], // Assuming only one error message per field
      });
    });
  }
};

export default useFormErrorHandling;
