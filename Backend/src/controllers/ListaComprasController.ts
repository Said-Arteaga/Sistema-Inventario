import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.js";
import { ListaCompras } from "../entities/ListaCompras.js";
import { ListaDetalle } from "../entities/ListaDetalle.js";

const listaRepository = AppDataSource.getRepository(ListaCompras);
const detalleRepository = AppDataSource.getRepository(ListaDetalle);

export class ListaComprasController {
    static async crearLista(req: Request, res: Response) {
        try {
            const { idFamilia } = req.body;
            const nuevaLista = new ListaCompras();
            nuevaLista.idFamilia = idFamilia;
            nuevaLista.fechaCreacion = new Date().toISOString().split('T')[0];
            nuevaLista.estado = "Pendiente";

            await listaRepository.save(nuevaLista);
            res.status(201).json(nuevaLista);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al crear la lista", error });
        }
    }

    static async agregarArticuloALista(req: Request, res: Response) {
        try {
            const { idLista, idProducto, precio, cantidad } = req.body;

            const nuevoDetalle = new ListaDetalle();
            nuevoDetalle.idLista = idLista;
            nuevoDetalle.idProducto = idProducto;
            nuevoDetalle.precio = precio;
            nuevoDetalle.cantidad = cantidad;
            nuevoDetalle.estado = "Por comprar";

            await detalleRepository.save(nuevoDetalle);
            res.status(201).json(nuevoDetalle);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al añadir artículo", error });
        }
    }

    static async obtenerListaConDetalles(req: Request, res: Response) {
        try {
            const { idLista } = req.params;
            const lista = await listaRepository.findOne({
                where: { idLista: Number(idLista) },
                relations: { listaDetalles: { producto: true } }
            });
            res.json(lista);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener detalles de la lista", error });
        }
    }

    static async obtenerOCrearListaFamilia(req: Request, res: Response) {
        try {
            const { idFamilia } = req.params;
            let lista = await listaRepository.findOne({
                where: { idFamilia: Number(idFamilia) },
                relations: { listaDetalles: { producto: true } },
                order: { idLista: "DESC" }
            });

            if (!lista) {
                lista = new ListaCompras();
                lista.idFamilia = Number(idFamilia);
                lista.fechaCreacion = new Date().toISOString().split('T')[0];
                lista.estado = "Pendiente";
                await listaRepository.save(lista);
                lista.listaDetalles = [];
            }

            res.json(lista);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener lista de la familia", error });
        }
    }

    static async toggleEstadoArticulo(req: Request, res: Response) {
        try {
            const { idDetalle } = req.params;
            const detalle = await detalleRepository.findOne({
                where: { idListaDetalle: Number(idDetalle) }
            });

            if (!detalle) {
                res.status(404).json({ mensaje: "Artículo no encontrado" });
                return;
            }

            detalle.estado = detalle.estado === "Comprado" ? "Por comprar" : "Comprado";
            await detalleRepository.save(detalle);
            res.json(detalle);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al actualizar estado del artículo", error });
        }
    }
}
