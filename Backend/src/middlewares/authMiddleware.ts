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
        const verificado: any = jwt.verify(token, JWT_SECRET);
        req.usuarioToken = verificado;

        const idFamiliaParam = req.params?.idFamilia;
        const idFamiliaBody = req.body?.idFamilia;

        if (idFamiliaParam && Number(idFamiliaParam) !== Number(verificado.idFamilia)) {
            res.status(403).json({ mensaje: "No tienes permiso para acceder al inventario de otra familia." });
            return;
        }

        if (idFamiliaBody && Number(idFamiliaBody) !== Number(verificado.idFamilia)) {
            res.status(403).json({ mensaje: "No tienes permiso para registrar datos en otra familia." });
            return;
        }

        next();
    } catch (error) {
        res.status(403).json({ mensaje: "Token inválido o expirado." });
    }
};
