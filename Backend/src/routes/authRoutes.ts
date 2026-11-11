import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController.js";
import { validateResult } from "../middlewares/validateResult.js";

const router = Router();

router.post(
    "/registrar",
    [
        body("nombreFamilia").notEmpty().withMessage("El nombre de la familia es obligatorio").trim(),
        body("nombreUsuario").notEmpty().withMessage("El nombre de usuario es obligatorio").trim(),
        body("correo").isEmail().withMessage("Debe proporcionar un correo electrónico válido").normalizeEmail(),
        body("contrasenia").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
        validateResult // Valida todo lo anterior
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

export default router;
