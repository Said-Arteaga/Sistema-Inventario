import { Router } from "express";
import { body, param } from "express-validator";
import { ListaComprasController } from "../controllers/ListaComprasController.js";
import { validateResult } from "../middlewares/validateResult.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
    "/",
    [
        verificarToken,
        body("idFamilia").isInt().withMessage("El idFamilia debe ser un número entero"),
        validateResult
    ],
    ListaComprasController.crearLista
);

router.post(
    "/articulo",
    [
        verificarToken,
        body("idLista").isInt().withMessage("El idLista debe ser un número entero"),
        body("idProducto").isInt().withMessage("El idProducto debe ser un número entero"),
        body("precio").isFloat({ min: 0 }).withMessage("El precio debe ser un número decimal válido"),
        body("cantidad").isFloat({ min: 0.01 }).withMessage("La cantidad debe ser un número mayor a cero"),
        validateResult
    ],
    ListaComprasController.agregarArticuloALista
);

router.get(
    "/:idLista",
    [
        verificarToken,
        param("idLista").isInt().withMessage("El ID de la lista debe ser un número entero"),
        validateResult
    ],
    ListaComprasController.obtenerListaConDetalles
);

router.get(
    "/familia/:idFamilia",
    [
        verificarToken,
        param("idFamilia").isInt().withMessage("El ID de la familia debe ser un número entero"),
        validateResult
    ],
    ListaComprasController.obtenerOCrearListaFamilia
);

router.put(
    "/articulo/:idDetalle/toggle",
    [
        verificarToken,
        param("idDetalle").isInt().withMessage("El ID del detalle debe ser un número entero"),
        validateResult
    ],
    ListaComprasController.toggleEstadoArticulo
);


export default router;
