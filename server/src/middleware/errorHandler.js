export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal server error';

  // Prisma Known Request Errors
  if (err.code === 'P2002') {
    statusCode = 409;
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
    message = `A record with this ${target} already exists.`;
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested record not found.';
  } else if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Foreign key constraint failed.';
  }

  // Generic validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  // Prevent leaking stack in production
  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

