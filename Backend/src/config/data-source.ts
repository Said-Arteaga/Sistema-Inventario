import "reflect-metadata";
import { DataSource } from "typeorm";
import { Familia } from "../entities/Familia.js";
import { Producto } from "../entities/Producto.js";
import { Usuario } from "../entities/Usuario.js";
import { Inventario } from "../entities/Inventario.js";
import { DetalleInventario } from "../entities/DetalleInventario.js";
import { ListaCompras } from "../entities/ListaCompras.js";
import { ListaDetalle } from "../entities/ListaDetalle.js";
import { HistoricoMovimientos } from "../entities/HistoricoMovimientos.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "inventarioDomestico",
    synchronize: false,
    logging: true,
    entities: [
        Familia,
        Producto,
        Usuario,
        Inventario,
        DetalleInventario,
        ListaCompras,
        ListaDetalle,
        HistoricoMovimientos
    ],
    migrations: [],
    subscribers: [],
});
