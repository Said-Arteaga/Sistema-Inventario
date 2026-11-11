import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_respaldo_por_si_falla_el_env";


export interface CustomRequest extends Request {
    usuarioToken?: any;
}

export const verificarToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ mensaje: "Acceso denegado. No se proporcionó un token de seguridad." });
        return;
    }

    try {
        const verificado = jwt.verify(token, JWT_SECRET);
        req.usuarioToken = verificado;
        next();
    } catch (error) {
        res.status(403).json({ mensaje: "Token inválido o expirado." });
    }
};
