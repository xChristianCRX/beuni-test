import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  let token = null;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader;
  }

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Acesso negado. Token expirado.' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Acesso negado. Token inválido.' });
      } else {
        return res.status(403).json({ message: 'Acesso negado. Erro na verificação do token.' });
      }
    }

    req.user = user;
    next();
  });
};

export default authenticateJWT;