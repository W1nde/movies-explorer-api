const { allowedCors } = require('../utils/allowedCors');

// обработка CORS-запросов
app.use ((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const reqHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHOD = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Acess-Controll-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHOD)
    res.header('Access-Control-Allow-Headers', reqHeaders);
    return res.end();
  }
  return next();
});
