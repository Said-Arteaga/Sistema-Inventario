import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Familia } from "./Familia.js";
import { HistoricoMovimientos } from "./HistoricoMovimientos.js";

@Entity({ name: "Usuario" })
export class Usuario {
    @PrimaryGeneratedColumn({ name: "IdUsuario" })
    idUsuario!: number;

    @Column({ name: "IdFamilia", type: "int" })
    idFamilia!: number;

    @Column({ name: "Nombre", type: "varchar", length: 150 })
    nombre!: string;

    @Column({ name: "Correo", type: "varchar", length: 100 })
    correo!: string;

    @Column({ name: "Contraseña", type: "varchar", length: 255 })
    contrasenia!: string;

    @Column({ name: "Rol", type: "varchar", length: 50 })
    rol!: string;

    @ManyToOne(() => Familia, (familia) => familia.usuarios, {
        onDelete: "RESTRICT", onUpdate: "CASCADE"
    })
    @JoinColumn({ name: "IdFamilia", referencedColumnName: "idFamilia" })
    familia!: Familia;

    @OneToMany(() => HistoricoMovimientos, (movimiento) => movimiento.usuario)
    historicoMovimientos!: HistoricoMovimientos[];
}
