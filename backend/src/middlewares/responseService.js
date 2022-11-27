let responseService = {
  success: (res, data) => {
    res.status(200).json({
      status: "success",
      data: data,
    });
  },
  error: (res, error) => {
    res.status(error.status || 500).json({
      status: "error",
      message: error.message,
    });
  },
};

module.exports = responseService;
