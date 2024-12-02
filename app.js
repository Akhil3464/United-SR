// Load express module
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Create an express application
const app = express();

// Define the port number
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();

// Serve static files from the "css", "js", "images", and "font" directories
app.use('/scss', express.static(path.join(__dirname, 'scss')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

// Define routes for your site
// Dynamic routing for all HTML files
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

    // Default to "Customer" if no name is provided
    fq_name = fq_name || "Customer";
    console.log(fq_email, fq_name);

    // Updated quote without tracking or offers, emphasizing features and advantages
    const quote = `
    🚀 **United SR Logistics**: Where Speed Meets Reliability 🚀
    
    Hello ${fq_name},
    
    Thank you for considering **United SR Logistics** for your international courier needs. We are dedicated to providing **top-tier logistics solutions** tailored to your requirements.
    
    🌟 **Why Choose United SR Logistics?**  
    - 🏠 **Comprehensive Door-to-Door Services**: Effortless pickups and deliveries, ensuring convenience and reliability.  
    - ✈️ **Global Express Shipping**: Fast, efficient air freight services to meet your time-critical requirements.  
    - 📦 **Advanced Packaging Solutions**: Protecting your shipments with the highest safety standards.  
    - 🤝 **Personalized Customer Support**: Dedicated professionals to assist you at every step.  
    - 🌍 **Global Expertise**: Seamless international shipping powered by years of experience.
    
    At **United SR Logistics**, we prioritize your needs with our commitment to excellence. Let's move your shipment with care and efficiency today!
    
    Warm regards,  
    **United SR Logistics Team**  
    🌐 [www.unitedsrlogistics.com](http://www.unitedsrlogistics.com) | 📧 unitedsrlogistics@gmail.com
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: fq_email,
        subject: 'Your Personalized Quote from United SR Logistics',
        text: quote, // Plain-text version
        html: `
            <div style="text-align: center; font-family: Arial, sans-serif;">
                <img src="https://res.cloudinary.com/stayease/image/upload/v1732534408/Profile%20images/logo_czfund.png" alt="United SR Logistics Logo" style="max-width: 200px; margin-bottom: 20px;" />
                <h1 style="color: #2d89ef;">United SR Logistics</h1>
                <p style="font-size: 16px; color: #333;">Where Speed Meets Reliability</p>
                <hr style="border: 1px solid #ddd; margin: 20px 0;" />
                <p style="text-align: left; font-size: 14px; line-height: 1.6;">
                    🚀 <strong>United SR Logistics</strong>: Your Trusted International Courier Partner 🚀<br><br>
                    Hello <strong>${fq_name}</strong>,<br><br>
                    Thank you for considering <strong>United SR Logistics</strong> for your courier needs. We specialize in delivering excellence for every shipment.<br><br>
                    🌟 <strong>Why Choose United SR Logistics?</strong><br>
                    🏠 <strong>Comprehensive Door-to-Door Services</strong>: Effortless pickups and deliveries, ensuring convenience and reliability.<br>
                    ✈️ <strong>Global Express Shipping</strong>: Fast, efficient air freight services to meet your time-critical requirements.<br>
                    📦 <strong>Advanced Packaging Solutions</strong>: Protecting your shipments with the highest safety standards.<br>
                    🤝 <strong>Personalized Customer Support</strong>: Dedicated professionals to assist you at every step.<br>
                    🌍 <strong>Global Expertise</strong>: Seamless international shipping powered by years of experience.<br><br>
                    At <strong>United SR Logistics</strong>, we prioritize your needs with our commitment to excellence. Let's move your shipment with care and efficiency today!<br><br>
                    Warm regards,<br>
                    <strong>United SR Logistics Team</strong><br>
                </p>
                <footer style="margin-top: 20px; font-size: 12px; color: #555;">
                    🌐 <a href="http://www.unitedsrlogistics.com" style="color: #2d89ef;">www.unitedsrlogistics.com</a><br />
                    📧 unitedsrlogistics@gmail.com
                </footer>
            </div>
        `,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${fq_email}`);
        res.redirect('/');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send quote. Please try again later.');
    }
});

app.post('/contact-form', async (req, res) => {
    const { fname, number, email, subject, message } = req.body;

    console.log('Form Data:', fname, number, email, subject, message);

    try {
        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL, // Your email address
            subject: `📩 New Contact Form Submission: ${subject}`,
            text: `
            Name: ${fname}
            Phone: ${number}
            Email: ${email}
            Subject: ${subject}
            Message: ${message}
            `,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                    <h2 style="text-align: center; color: #4CAF50;">📩 New Contact Form Submission</h2>
                    <hr style="margin: 20px 0; border: 1px solid #eee;">
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        <strong>Name:</strong> ${fname}<br>
                        <strong>Phone:</strong> <a href="tel:${number}" style="color: #4CAF50;">${number}</a><br>
                        <strong>Email:</strong> <a href="mailto:${email}" style="color: #4CAF50;">${email}</a><br>
                        <strong>Subject:</strong> ${subject}<br>
                        <strong>Message:</strong><br>
                        ${message}
                    </p>

                    <hr style="margin: 20px 0; border: 1px solid #eee;">

                    <footer style="text-align: center; font-size: 14px; color: #555;">
                        <p>⚡ This message was submitted through the Contact Form on United SR Logistics.</p>
                        <p><strong>Powered by Adithyan</strong></p>
                    </footer>
                </div>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        // Redirect back to contact page with success message
        res.redirect('/contact');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send the message.' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
