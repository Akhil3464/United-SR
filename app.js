require('dotenv').config();
console.log("EMAIL:", process.env.EMAIL);

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/scss', express.static(path.join(__dirname, 'scss')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'views', `${page}.html`), (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
        }
    });
});

app.post('/get-quote', async (req, res) => {
    let { fq_name, fq_email } = req.body;
    fq_name = fq_name || "Customer";
    console.log(fq_email, fq_name);

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: process.env.EMAIL,
            subject: 'Your Personalized Quote from United SR Logistics',
            html: `
                <div style="text-align: center; font-family: Arial, sans-serif;">
                    <h1 style="color: #2d89ef;">United SR Logistics</h1>
                    <p>Where Speed Meets Reliability</p>
                    <hr />
                    <p style="text-align: left;">
                        Hello <strong>${fq_name}</strong>,<br><br>
                        Thank you for considering United SR Logistics.<br><br>
                        🏠 <strong>Door-to-Door Services</strong><br>
                        ✈️ <strong>Global Express Shipping</strong><br>
                        📦 <strong>Advanced Packaging</strong><br>
                        🤝 <strong>Personalized Support</strong><br><br>
                        Warm regards,<br>
                        <strong>United SR Logistics Team</strong>
                    </p>
                </div>
            `,
        });
        console.log('Quote email sent');
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to send quote.');
    }
});

app.post('/contact-form', async (req, res) => {
    const { fname, number, email, subject, message } = req.body;
    console.log('Form Data:', fname, number, email, subject, message);

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: process.env.EMAIL,
            subject: `📩 New Contact Form: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #4CAF50;">📩 New Contact Form Submission</h2>
                    <p>
                        <strong>Name:</strong> ${fname}<br>
                        <strong>Phone:</strong> ${number}<br>
                        <strong>Email:</strong> ${email}<br>
                        <strong>Subject:</strong> ${subject}<br>
                        <strong>Message:</strong><br>${message}
                    </p>
                    <p style="color: #555;">Powered by Dyramuse Creativescape Pvt.Ltd.</p>
                </div>
            `,
        });
        console.log('Contact email sent');
        res.redirect(req.get('referer') || '/');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

app.post('/request-quote', async (req, res) => {
    const { name, email, phone, origin, delivery, weight, message } = req.body;
    console.log('Quote Request:', name, email, phone, origin, delivery, weight, message);

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: process.env.EMAIL,
            subject: `🚚 New Quote Request from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #4CAF50;">🚚 New Quote Request</h2>
                    <p>
                        <strong>Name:</strong> ${name}<br>
                        <strong>Phone:</strong> ${phone}<br>
                        <strong>Email:</strong> ${email}<br>
                        <strong>Origin City:</strong> ${origin}<br>
                        <strong>Delivery City:</strong> ${delivery}<br>
                        <strong>Weight:</strong> ${weight} kg<br>
                        <strong>Message:</strong><br>${message}
                    </p>
                    <p style="color: #555;">Powered by Dyramuse Creativescape Pvt.Ltd.</p>
                </div>
            `,
        });
        console.log('Quote request email sent');
        res.redirect('/request-a-quote');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to send quote request.' });
    }
});

app.get('/test-email', async (req, res) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: process.env.EMAIL,
            subject: 'Test Email',
            html: '<p>Railway + Resend test successful! 🎉</p>',
        });
        res.send("Test email sent successfully!");
    } catch (error) {
        console.error(error);
        res.send("Email failed: " + error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});