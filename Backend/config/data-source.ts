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
    host: "localhost",
    port: 3306,
    username: "root", 
    password: "admin",
    database: "inventarioDomestico",
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
