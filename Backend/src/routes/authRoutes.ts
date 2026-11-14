import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";
import { validateResult } from "../middlewares/validateResult.js";
import { body, param } from "express-validator";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
    "/registrar",
    [
        body("nombreFamilia").if((value, { req }) => !req.body.idFamilia)
            .notEmpty().withMessage("El nombre de la familia es obligatorio").trim(),
        body("idFamilia").optional().isInt().withMessage("El código de hogar debe ser un número entero"),
        body("nombreUsuario").notEmpty().withMessage("El nombre de usuario es obligatorio").trim(),
        body("correo").isEmail().withMessage("Debe proporcionar un correo electrónico válido").normalizeEmail(),
        body("contrasenia").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
        validateResult
    ],
    AuthController.registrar
);


router.post(
    "/login",
    [
        body("correo").isEmail().withMessage("Debe ingresar un correo válido"),
        body("contrasenia").notEmpty().withMessage("La contraseña es obligatoria"),
        validateResult
    ],
    AuthController.login
);

router.get(
    "/familia/:idFamilia/miembros",
    [
        verificarToken,
        param("idFamilia").isInt().withMessage("El ID de la familia debe ser un número entero"),
        validateResult
    ],
    AuthController.listarMiembrosFamilia
);

export default router;
