export const ErrorBox = ({ message = "Something went wrong." }) => {
  return (
    <div className="error-box">
      <strong>Error:</strong> {message}
    </div>
  );
};
