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
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

// Define routes for your site
// Dynamic routing for all HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'public', 'pages', `${page}.html`), (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
        }
    });
});

app.post('/get-quote', async (req, res) => {
    let { fq_name, fq_email } = req.body;

    // Default to "Customer" if no name is provided
    fq_name = fq_name || "Customer";
    console.log(fq_email, fq_name);

    // Predefined quotes with long styled message
    const quote = `
    🚀 **United SR Logistics**: Where Speed Meets Reliability 🚀
    
    Hello ${fq_name},
    
    Thank you for considering **United SR Logistics** for your international courier needs. We are dedicated to providing **top-tier logistics solutions** tailored to your requirements.
    
    🌟 **Here’s what sets us apart:**  
    - 🏠 **Door-to-Door International Delivery**: Seamless pickups and drop-offs.  
    - ✈️ **Express Air Freight Services**: Faster deliveries, no matter the distance.  
    - 📦 **Secure Packaging Solutions**: Protection for every parcel.  
    - 📍 **Live Shipment Tracking**: Real-time updates at your fingertips.
    
    🎉 **Exclusive Offer for You**:  
    Ship now and enjoy **20% off** on shipments over 50kg, plus **free pickup** services. This limited-time offer ensures your shipments are handled with care and efficiency at the best rates.
    
    Your trust drives our commitment to excellence. Let's get your shipment moving today!  
    
    Warm regards,  
    **United SR Logistics Team**  
    🌐 [www.unitedsrlogistics.com](http://www.unitedsrlogistics.com) | 📧 support@unitedsrlogistics.com
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
                <img src="https://res.cloudinary.com/stayease/image/upload/v1732177066/Profile%20images/united_sr_final_png_ybwuwa.png" alt="United SR Logistics Logo" style="max-width: 200px; margin-bottom: 20px;" />
                <h1 style="color: #2d89ef;">United SR Logistics</h1>
                <p style="font-size: 16px; color: #333;">Where Speed Meets Reliability</p>
                <hr style="border: 1px solid #ddd; margin: 20px 0;" />
                <p style="text-align: left; font-size: 14px; line-height: 1.6;">
                    🚀 <strong>United SR Logistics</strong>: Your Trusted International Courier Partner 🚀<br><br>
                    Hello <strong>${fq_name}</strong>,<br><br>
                    Thank you for considering <strong>United SR Logistics</strong> for your courier needs. We specialize in delivering excellence for every shipment.<br><br>
                    🌟 <strong>Here’s what sets us apart:</strong><br>
                    🏠 <strong>Door-to-Door International Delivery</strong>: Seamless pickups and drop-offs.<br>
                    ✈️ <strong>Express Air Freight Services</strong>: Faster deliveries, no matter the distance.<br>
                    📦 <strong>Secure Packaging Solutions</strong>: Protection for every parcel.<br>
                    📍 <strong>Live Shipment Tracking</strong>: Real-time updates at your fingertips.<br><br>
                    🎉 <strong>Exclusive Offer for You:</strong><br>
                    Ship now and enjoy <strong>20% off</strong> on shipments over 50kg, plus <strong>free pickup</strong> services.<br><br>
                    Your trust drives our commitment to excellence. Let's get your shipment moving today!<br><br>
                    Warm regards,<br>
                    <strong>United SR Logistics Team</strong><br>
                </p>
                <footer style="margin-top: 20px; font-size: 12px; color: #555;">
                    🌐 <a href="http://www.unitedsrlogistics.com" style="color: #2d89ef;">www.unitedsrlogistics.com</a><br />
                    📧 support@unitedsrlogistics.com
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

// Handle 404 error for undefined routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
