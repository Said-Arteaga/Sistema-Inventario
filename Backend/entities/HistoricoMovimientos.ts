import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Usuario } from "./Usuario.js";
import { Producto } from "./Producto.js";

@Entity({ name: "HistoricoMovimientos" })
export class HistoricoMovimientos {
    @PrimaryGeneratedColumn({ name: "IdMovimiento" })
    idMovimiento!: number;

    @Column({ name: "IdUsuario", type: "int" })
    idUsuario!: number;

    @Column({ name: "IdProducto", type: "int" })
    idProducto!: number;

    @Column({ name: "FechaMovimiento", type: "date" })
    fechaMovimiento!: string;

    @Column({ name: "CantidadAfectada", type: "int" })
    cantidadAfectada!: number;

    @Column({ name: "TipoMovimiento", type: "varchar", length: 50 })
    tipoMovimiento!: string;

    @Column({ name: "Costo", type: "decimal", precision: 12, scale: 2 })
    costo!: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.historicoMovimientos, {
        onDelete: "RESTRICT", onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "IdUsuario", referencedColumnName: "idUsuario" })
    usuario!: Usuario;

    @ManyToOne(() => Producto, (producto) => producto.historicoMovimientos, {
        onDelete: "RESTRICT", onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "IdProducto", referencedColumnName: "idProducto" })
    producto!: Producto;
}
