const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'momenebbo@gmail.com',
        pass: 'flzo sljv eork zckm' 
    }
});

app.post('/api/order', (req, res) => {
    const { customerName, phone, address, cart, total } = req.body;
    const cartDetails = cart.map(item => `- ${item.name} (${item.price}$)`).join('\n');

    const mailOptions = {
        from: 'momenebbo@gmail.com',
        to: 'momenebbo@gmail.com',
        subject: `طلب جديد من ${customerName}`,
        text: `الاسم: ${customerName}\nالهاتف: ${phone}\nالعنوان: ${address}\n\nالمنتجات:\n${cartDetails}\n\nالإجمالي: ${total}$`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ status: "error" });
        }
        res.status(200).json({ status: "success" });
    });
});

// تعديل مهم للرفع أونلاين
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});