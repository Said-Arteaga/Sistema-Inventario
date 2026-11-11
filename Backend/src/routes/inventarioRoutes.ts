import { Router } from "express";
import { body, param } from "express-validator";
import { InventarioController } from "../controllers/InventarioController.js";
import { validateResult } from "../middlewares/validateResult.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
    "/familia/:idFamilia/productos",
    [
        verificarToken,
        param("idFamilia").isInt().withMessage("El ID de la familia debe ser un número entero"),
        validateResult
    ],
    InventarioController.listarProductosPorFamilia
);

router.get(
    "/familia/:idFamilia/stock",
    [
        verificarToken,
        param("idFamilia").isInt().withMessage("El ID de la familia debe ser un número entero"),
        validateResult
    ],
    InventarioController.obtenerStockActual
);

router.post(
    "/producto",
    [
        verificarToken,
        body("idFamilia").isInt().withMessage("El idFamilia debe ser un número entero"),
        body("idUsuario").isInt().withMessage("El idUsuario debe ser un número entero"),
        body("nombre").notEmpty().withMessage("El nombre del producto es obligatorio").trim(),
        body("presentacion").notEmpty().withMessage("La presentación es obligatoria").trim(),
        body("unidadMedida").notEmpty().withMessage("La unidad de medida es obligatoria").trim(),
        body("categoria").notEmpty().withMessage("La categoría es obligatoria").trim(),
        body("ubicacion").notEmpty().withMessage("La ubicación en el inventario es obligatoria").trim(),
        body("fechaCaducidad").isDate().withMessage("La fecha de caducidad debe ser una fecha válida (AAAA-MM-DD)"),
        body("cantidad").isFloat({ min: 0.01 }).withMessage("La cantidad debe ser un número mayor a cero"),
        body("costo").isFloat({ min: 0 }).withMessage("El costo debe ser un número igual o mayor a cero"),
        validateResult
    ],
    InventarioController.agregarProductoAInventario
);

export default router;
