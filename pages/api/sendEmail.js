// pages/api/sendActiveVideoEmail.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name, url, date } = req.body; // Extract video details from the request body

        // Configure your transporter
        const transporter = nodemailer.createTransport({
            host: process.env.NEXT_DEV === "true" ? "smtp.world4you.com" : "smtp.world4you.com",
            port: 587,
            secure: false,
            auth: {
                user: "office@atelierbuchner.at",
                pass: process.env.NEXT_W4YPASSWORD,
            },
        });

        const mailOptions = {
            from: '"Active Video Notification" <office@atelierbuchner.at>',
            to: "your-email@example.com", // Replace with your email
            subject: "Active Video Updated",
            text: `The video "${name}" has been set as active on ${date}. Watch it here: ${url}`,
            html: `<p>The video "<strong>${name}</strong>" has been set as active on ${date}.</p>
             <p>Watch it here: <a href="${url}">${url}</a></p>`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully!");
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ error: "Failed to send email" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
