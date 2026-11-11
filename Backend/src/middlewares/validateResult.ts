import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateResult = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ 
            mensaje: "Error de validación en los datos enviados", 
            errores: errors.array() 
        });
        return;
    }
    next();
};
