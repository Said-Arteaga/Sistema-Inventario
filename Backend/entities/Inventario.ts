import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Producto } from "./Producto.js";
import { DetalleInventario } from "./DetalleInventario.js";

@Entity({ name: "Inventario" })
export class Inventario {
    @PrimaryGeneratedColumn({ name: "IdInventario" })
    idInventario!: number;

    @Column({ name: "IdProducto", type: "int" })
    idProducto!: number;

    @Column({ name: "Ubicación", type: "varchar", length: 150 })
    ubicacion!: string;

    @ManyToOne(() => Producto, (producto) => producto.inventarios, {
        onDelete: "RESTRICT", onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "IdProducto", referencedColumnName: "idProducto" })
    producto!: Producto;

    @OneToMany(() => DetalleInventario, (detalle) => detalle.inventario)
    detallesInventario!: DetalleInventario[];
}
