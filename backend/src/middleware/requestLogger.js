const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // When the response finishes, calculate request time
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
};

module.exports = requestLogger;
