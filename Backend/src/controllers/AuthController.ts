import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source.js";
import { Usuario } from "../entities/Usuario.js";
import { Familia } from "../entities/Familia.js";
import { JWT_SECRET } from "../middlewares/authMiddleware.js";

const usuarioRepository = AppDataSource.getRepository(Usuario);
const familiaRepository = AppDataSource.getRepository(Familia);

export class AuthController {
        static async registrar(req: Request, res: Response): Promise<void> {
        try {
            const { nombreFamilia, idFamilia, nombreUsuario, correo, contrasenia } = req.body;

            const usuarioExistente = await usuarioRepository.findOne({ where: { correo } });
            if (usuarioExistente) {
                res.status(400).json({ mensaje: "El correo electrónico ya está registrado." });
                return;
            }

            let familiaFinal: Familia | null = null;
            let rolAsignado = "Administrador";

            if (idFamilia) {
                familiaFinal = await familiaRepository.findOne({ where: { idFamilia: Number(idFamilia) } });
                if (!familiaFinal) {
                    res.status(404).json({ mensaje: "No existe ningún hogar con ese código." });
                    return;
                }
                rolAsignado = "Miembro";
            } else {
                const nuevaFamilia = new Familia();
                nuevaFamilia.nombre = nombreFamilia;
                familiaFinal = await familiaRepository.save(nuevaFamilia);
            }

            const contraseniaEncriptada = await bcrypt.hash(contrasenia, 10);

            const nuevoUsuario = new Usuario();
            nuevoUsuario.nombre = nombreUsuario;
            nuevoUsuario.correo = correo;
            nuevoUsuario.contrasenia = contraseniaEncriptada;
            nuevoUsuario.rol = rolAsignado;
            nuevoUsuario.idFamilia = familiaFinal.idFamilia;

            await usuarioRepository.save(nuevoUsuario);

            const { contrasenia: _, ...usuarioSinContrasenia } = nuevoUsuario;
            res.status(201).json({ mensaje: "Registro exitoso", usuario: usuarioSinContrasenia });
        } catch (error) {
            res.status(500).json({ mensaje: "Error en el servidor al registrar", error });
        }
    }


    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { correo, contrasenia } = req.body;

            const usuario = await usuarioRepository.findOne({ 
                where: { correo },
                relations: { familia: true }
            });

            if (!usuario) {
                res.status(401).json({ mensaje: "Credenciales incorrectas (Correo no encontrado)" });
                return;
            }

            const contraseñaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
            if (!contraseñaValida) {
                res.status(401).json({ mensaje: "Credenciales incorrectas (Contraseña incorrecta)" });
                return;
            }

            const token = jwt.sign(
                { 
                    idUsuario: usuario.idUsuario, 
                    idFamilia: usuario.idFamilia, 
                    rol: usuario.rol 
                }, 
                JWT_SECRET, 
                { expiresIn: "24h" }
            );

            const { contrasenia: _, ...usuarioSinContrasenia } = usuario;

            res.json({ 
                mensaje: "Login exitoso", 
                token, 
                usuario: usuarioSinContrasenia 
            });
        } catch (error) {
            res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión", error });
        }
    }

    static async listarMiembrosFamilia(req: Request, res: Response): Promise<void> {
        try {
            const { idFamilia } = req.params;
            const miembros = await usuarioRepository.find({
                where: { idFamilia: Number(idFamilia) },
                select: { idUsuario: true, nombre: true, correo: true, rol: true }
            });
            res.json(miembros);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener integrantes del hogar", error });
        }
    }

}
