import nodemailer from "nodemailer"
import { options } from "../config/config.js"

//transporter

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: options.gmail.emailAdmin,
        pass: options.gmail.emailPass
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

//funcion generar correo de recuperacion de contraseña

export const sendRecoveryPass = async (userEmail, token) => {
    const link = `http://localhost:8080/reset-password?token=${token}`
    //estructura del correo
    await transporter.sendMail({
        from: options.gmail.emailAdmin,
        to: userEmail,
        subject: "restablecer contraseña",
        html:`
            <div>
                <h2>Has solicitado un cambio de contraseña</h2>
                <p>Da clic en el siguiente enlace para restablecer la contraseña</p>
                <a href="${link}">
                    <button> Restablecer contraseña </button>
                </a>
            </div>
        `
        
    })
}

export const sendDeleteConfirm = async (userEmail, desId) => {
    await transporter.sendMail({
        from: options.gmail.emailAdmin,
        to: userEmail,
        subject: "diseño eliminado",
        html:`
            <div>
                <h2>Has borrado el diseño con el id ${desId}</h2>
                <p>Recuerda que esta accion no se puede reversar</p>
                
            </div>
        `
    })
}

export const sendDeletedUser = async (userEmail) => {
    await transporter.sendMail({
        from: options.gmail.emailAdmin,
        to: userEmail,
        subject: "usuario eliminado eliminado",
        html:`
            <div>
                <h2>Hemos eliminado el usuario ${userEmail} por inactividad</h2>
                <p>has superado mas de 48 hrs sin actividad en la plataforma</p>
                
            </div>
        `
    })
}