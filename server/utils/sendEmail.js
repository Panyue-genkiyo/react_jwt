import nodemailer from 'nodemailer';

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: `panyue <90938238g@gmail.com>`,
        to: options.to,
        subject: options.subject,
        html: options.text
    };

    transporter.sendMail(mailOptions, function (error, info){
        if(error){
            console.log(error)
        }else{
            console.log(info);
        }
    });
}

export default sendEmail;
