const errorHandler = (err, req, res, next) => {
  // Log the error (you can extend this to log to a file or a logging service)
  console.error(err.stack);

  // Send a generic error response
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
};

export default errorHandler;
