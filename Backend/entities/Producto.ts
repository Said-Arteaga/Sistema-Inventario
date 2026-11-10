import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Familia } from "./Familia.js";
import { Inventario } from "./Inventario.js";
import { HistoricoMovimientos } from "./HistoricoMovimientos.js";
import { ListaDetalle } from "./ListaDetalle.js";

@Entity({ name: "Producto" })
export class Producto {
    @PrimaryGeneratedColumn({ name: "IdProducto" })
    idProducto!: number;

    @Column({ name: "IdFamilia", type: "int" })
    idFamilia!: number;

    @Column({ name: "Nombre", type: "varchar", length: 100 })
    nombre!: string;

    @Column({ name: "Presentación", type: "varchar", length: 100 })
    presentacion!: string;

    @Column({ name: "UnidadMedida", type: "varchar", length: 50 })
    unidadMedida!: string;

    @Column({ name: "Categoria", type: "varchar", length: 100 })
    categoria!: string;

    @ManyToOne(() => Familia, (familia) => familia.productos, {
        onDelete: "RESTRICT", onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "IdFamilia", referencedColumnName: "idFamilia" })
    familia!: Familia;

    @OneToMany(() => Inventario, (inventario) => inventario.producto)
    inventarios!: Inventario[];

    @OneToMany(() => HistoricoMovimientos, (movimiento) => movimiento.producto)
    historicoMovimientos!: HistoricoMovimientos[];

    @OneToMany(() => ListaDetalle, (listaDetalle) => listaDetalle.producto)
    listaDetalles!: ListaDetalle[];
}
