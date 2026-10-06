import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

//DISPARO DO EMAIL -FUNÇÃO
export async function sendMail (to, subject, html){
    try{
        await transpoter.sendMail({
            from: `"suporte" <${process.env.EMAIL_USER}>`, //remetente
            to, //destinatario
            subject, //assunto do email
            html //corpo do email
        })
        console.log("email enviado")
    } catch(error){
        throw error
    }
}