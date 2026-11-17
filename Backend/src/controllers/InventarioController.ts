import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.js";
import { Producto } from "../entities/Producto.js";
import { Inventario } from "../entities/Inventario.js";
import { DetalleInventario } from "../entities/DetalleInventario.js";
import { HistoricoMovimientos } from "../entities/HistoricoMovimientos.js";

const productoRepository = AppDataSource.getRepository(Producto);
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

    static async consumirProducto(req: Request, res: Response) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const { idProducto, idUsuario, cantidadConsumida } = req.body;

            const inventario = await queryRunner.manager.findOne(Inventario, {
                where: { idProducto: Number(idProducto) },
                relations: { detallesInventario: true }
            });

            if (!inventario || !inventario.detallesInventario?.length) {
                await queryRunner.rollbackTransaction();
                res.status(404).json({ mensaje: "Producto no encontrado en inventario" });
                return;
            }

            const detalle = inventario.detallesInventario[0];
            const nuevaCantidad = Math.max(0, Number(detalle.cantidad) - Number(cantidadConsumida));

            detalle.cantidad = nuevaCantidad;
            await queryRunner.manager.save(detalle);

            const movimiento = queryRunner.manager.create(HistoricoMovimientos, {
                idUsuario: Number(idUsuario),
                idProducto: Number(idProducto),
                fechaMovimiento: new Date().toISOString().split('T')[0],
                cantidadAfectada: Number(cantidadConsumida),
                tipoMovimiento: "Consumo",
                costo: 0 as any
            });
            await queryRunner.manager.save(movimiento);

            await queryRunner.commitTransaction();
            res.json({ mensaje: "Consumo registrado correctamente", restante: nuevaCantidad });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Error en consumirProducto:", error);
            res.status(500).json({ mensaje: "Error al registrar consumo", error });
        } finally {
            await queryRunner.release();
        }
    }

        static async obtenerMovimientosPorFamilia(req: Request, res: Response) {
        try {
            const { idFamilia } = req.params;
            const movimientos = await historicoRepository.find({
                where: {
                    producto: { idFamilia: Number(idFamilia) }
                },
                relations: {
                    usuario: true,
                    producto: true
                },
                order: {
                    idMovimiento: "DESC"
                }
            });
            res.json(movimientos);
        } catch (error) {
            console.error("Error al listar movimientos:", error);
            res.status(500).json({ mensaje: "Error al obtener historial de movimientos", error });
        }
    }
}
