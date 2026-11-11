import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Producto } from "./Producto.js";
import { ListaCompras } from "./ListaCompras.js";

@Entity({ name: "ListaDetalle" })
export class ListaDetalle {
    @PrimaryGeneratedColumn({ name: "IdListaDetalle" })
    idListaDetalle!: number;

    @Column({ name: "IdProducto", type: "int" })
    idProducto!: number;

    @Column({ name: "IdLista", type: "int" })
    idLista!: number;

    @Column({ name: "Precio", type: "decimal", precision: 12, scale: 2 })
    precio!: number;

    @Column({ name: "Cantidad", type: "int" })
    cantidad!: number;

    @Column({ name: "Estado", type: "varchar", length: 50 })
    estado!: string;

    @ManyToOne(() => Producto, (producto) => producto.listaDetalles, {
        onDelete: "RESTRICT", onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "IdProducto", referencedColumnName: "idProducto" })
    producto!: Producto;

    @ManyToOne(() => ListaCompras, (listaCompras) => listaCompras.listaDetalles, {
        onDelete: "RESTRICT", onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "IdLista", referencedColumnName: "idLista" })
    listaCompras!: ListaCompras;
}
