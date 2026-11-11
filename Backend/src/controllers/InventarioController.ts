import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.js";
import { Producto } from "../entities/Producto.js";
import { Inventario } from "../entities/Inventario.js";
import { DetalleInventario } from "../entities/DetalleInventario.js";
import { HistoricoMovimientos } from "../entities/HistoricoMovimientos.js";

const productoRepository = AppDataSource.getRepository(Producto);
const inventarioRepository = AppDataSource.getRepository(Inventario);
const detalleRepository = AppDataSource.getRepository(DetalleInventario);
const historicoRepository = AppDataSource.getRepository(HistoricoMovimientos);

export class InventarioController {
    static async listarProductosPorFamilia(req: Request, res: Response) {
        try {
            const { idFamilia } = req.params;
            const productos = await productoRepository.find({
                where: { idFamilia: Number(idFamilia) }
            });
            res.json(productos);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al listar productos", error });
        }
    }

    static async agregarProductoAInventario(req: Request, res: Response) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { idFamilia, idUsuario, nombre, presentacion, unidadMedida, categoria, ubicacion, fechaCaducidad, cantidad, costo } = req.body;

            const nuevoProducto = queryRunner.manager.create(Producto, {
                idFamilia, nombre, presentacion, unidadMedida, categoria
            });
            const productoGuardado = await queryRunner.manager.save(nuevoProducto);

            const nuevoInventario = queryRunner.manager.create(Inventario, {
                idProducto: productoGuardado.idProducto, ubicacion
            });
            const inventarioGuardado = await queryRunner.manager.save(nuevoInventario);

            const nuevoDetalle = queryRunner.manager.create(DetalleInventario, {
                idInventario: inventarioGuardado.idInventario, fechaCaducidad, cantidad, costo
            });
            await queryRunner.manager.save(nuevoDetalle);

            const nuevoMovimiento = queryRunner.manager.create(HistoricoMovimientos, {
                idUsuario,
                idProducto: productoGuardado.idProducto,
                fechaMovimiento: new Date().toISOString().split('T')[0],
                cantidadAfectada: cantidad,
                tipoMovimiento: "Entrada Inicial",
                costo
            });
            await queryRunner.manager.save(nuevoMovimiento);

            await queryRunner.commitTransaction();
            res.status(201).json({ mensaje: "Producto e inventario registrados correctamente", producto: productoGuardado });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            res.status(500).json({ mensaje: "Error en la transacción de inventario", error });
        } finally {
            await queryRunner.release();
        }
    }

    static async obtenerStockActual(req: Request, res: Response) {
        try {
            const { idFamilia } = req.params;
            const stock = await productoRepository.find({
                where: { idFamilia: Number(idFamilia) },
                relations: { inventarios: { detallesInventario: true } }
            });
            res.json(stock);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al consultar existencias", error });
        }
    }
}
