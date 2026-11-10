import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Familia } from "./Familia.js";
import { ListaDetalle } from "./ListaDetalle.js";

@Entity({ name: "ListaCompras" })
export class ListaCompras {
    @PrimaryGeneratedColumn({ name: "IdLista" })
    idLista!: number;

    @Column({ name: "IdFamilia", type: "int" })
    idFamilia!: number;

    @Column({ name: "FechaCreación", type: "date" })
    fechaCreacion!: string;

    @Column({ name: "Estado", type: "varchar", length: 50 })
    estado!: string;

    @ManyToOne(() => Familia, (familia) => familia.listasCompras, {
        onDelete: "RESTRICT", onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "IdFamilia", referencedColumnName: "idFamilia" })
    familia!: Familia;

    @OneToMany(() => ListaDetalle, (listaDetalle) => listaDetalle.listaCompras)
    listaDetalles!: ListaDetalle[];
}
