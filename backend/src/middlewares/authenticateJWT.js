import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');

    let token;
    if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2) {
            token = parts[1];
        }
    }
    
    if (!token) {
        return res.status(401).send('Acesso negado. Token não fornecido.');
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send('Acesso negado. Token expirado.');
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).send('Acesso negado. Token inválido.');
            } else {
                return res.status(403).send('Acesso negado. Erro na verificação do token.');
            }
        }

        req.user = user;
        const issuedAtISO = new Date(user.iat * 1000).toISOString();
        const expiresAtISO = new Date(user.exp * 1000).toISOString();

        console.log(`Token validado para usuário: ${user.username}
            Emitido em: ${issuedAtISO}
            Expira em: ${expiresAtISO}
        `);

        next();
    });
}

export default authenticateJWT;