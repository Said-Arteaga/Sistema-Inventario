import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Producto } from "./Producto.js";
import { ListaCompras } from "./ListaCompras.js";
import { Usuario } from "./Usuario.js";

@Entity({ name: "Familia" })
export class Familia {
    @PrimaryGeneratedColumn({ name: "IdFamilia" })
    idFamilia!: number;

    @Column({ name: "Nombre", type: "varchar", length: 100 })
    nombre!: string;

    @OneToMany(() => Producto, (producto) => producto.familia)
    productos!: Producto[];

    @OneToMany(() => ListaCompras, (listaCompras) => listaCompras.familia)
    listasCompras!: ListaCompras[];

    @OneToMany(() => Usuario, (usuario) => usuario.familia)
    usuarios!: Usuario[];
}
