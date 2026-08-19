import Mailgen, { type Content } from "mailgen";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async ({
    email,
    subject,
    mailgenContent,
}: {
    email: string;
    subject: string;
    mailgenContent: Mailgen.Content;
}): Promise<void> => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "MINDVAULT",
            link: process.env.CORS_ORIGIN || "https://mindvault-kappa.vercel.app",
        },
    });

    const mailHtml = mailGenerator.generate(mailgenContent);

    try {
        await transporter.sendMail({
            from: `"MindVault" <${process.env.GMAIL_USER}>`,
            to: email,
            subject,
            html: mailHtml,
        });

        console.log("✅ Email sent via Gmail to:", email);
    } catch (error) {
        console.error("❌ Gmail Email failed:", error);
        throw error;
    }
};


const emailVerificationContent = (name: string, verificationUrl: string): Content => {
    return {
        body: {
            name: name,
            intro: "Welcome to our App! we'are excited to have you on board.",
            action: {
                instructions: "To verify your email please click on the following button",
                button: {
                    color: "#11fc11ff",
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

const forgotPasswordContent = (name: string, passwordResetUrl: string): Content => {
    return {
        body: {
            name: name,
            intro: "We got a request to reset the password of your account.",
            action: {
                instructions:
                    "To reset your password click on the following button or link",
                button: {
                    color: "rgba(48, 236, 48, 0.67)",
                    text: "Reset password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

export { emailVerificationContent, forgotPasswordContent, sendEmail };