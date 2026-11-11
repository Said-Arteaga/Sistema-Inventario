import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Inventario } from "./Inventario.js";

@Entity({ name: "DetalleInventario" })
export class DetalleInventario {
    @PrimaryGeneratedColumn({ name: "IdDetalleInventario" })
    idDetalleInventario!: number;

    @Column({ name: "IdInventario", type: "int" })
    idInventario!: number;

    @Column({ name: "FechaCaducidad", type: "date" })
    fechaCaducidad!: string;

    @Column({ name: "Cantidad", type: "int" })
    cantidad!: number;

    @ManyToOne(() => Inventario, (inventario) => inventario.detallesInventario, {
        onDelete: "RESTRICT", onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "IdInventario", referencedColumnName: "idInventario" })
    inventario!: Inventario;
}
