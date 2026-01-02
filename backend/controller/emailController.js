import nodemailer from 'nodemailer';
import User from '../model/usermodel.js';
import { promisify } from 'util';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
export const sendFast2Sms = async(phonNumber,otp)=>{
	const data = {
		route: `${process.env.FAST2ROUTE}`,
		requests: [
			{
				sender_id: `${process.env.FAST2_SENDER_ID}`,
				message: `${process.env.FAST2_MESSAGE}`,
				variables_values: `${otp}`,
				flash: 0,
				numbers: `${phonNumber}`
			}
		]
	};
	
	const response = await axios.post(`${process.env.FAST2_URL}`, data, {
		headers: {
			'Authorization': process.env.FAST2SMS,
			'Content-Type': 'application/json'
		}
	})
	return response.data;
}
// Setup nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email provider (Gmail, SendGrid, etc.)
    secure: true,
    port: 8000,
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD
    },
});

const sendMailAsync = promisify(transporter.sendMail.bind(transporter));

// Generic function to send an email
const sendEmail = async (to, subject, text, html = '') => {
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to,
        subject,
        text,
        html,
    };
    try {
        const response = await sendMailAsync(mailOptions);
		console.log("Email Sent Response: ",response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error.message);
        return false;
    }
};

// Controller to send email verification
export const sendVerificationEmail = async (email, otp) => {
    const subject = 'Email OTP Verification';
    const text = `Your OTP is: ${otp}`;
    const html = `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`;
    return await sendEmail(email, subject, text, html);
};

// Send coupon email
export const sendCouponMail = async (fullName, toEmail, couponCode) => {
    const subject = 'Your Exclusive Coupon Code!';
    const text = `${fullName},\n\nWe’re excited to offer you an exclusive coupon code! Use the code below to save on your next purchase.\n\nCoupon Code: ${couponCode}\n\nHurry, it’s valid for a limited time! Don’t miss out on this special offer.\n\nThank you for being a valued customer!`;
    const html = `
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>We’re excited to offer you an exclusive coupon code! Use the code below to save on your next purchase:</p>
        <p><strong>Coupon Code: ${couponCode}</strong></p>
        <p><em>Hurry, it’s valid for a limited time! Don’t miss out on this special offer.</em></p>
        <p>Thank you for being a valued customer. We appreciate your support!</p>
        <p>Best regards,</p>
        <p>Your On U Team</p>
    `;
    return await sendEmail(toEmail, subject, text, html);
};

// Send order status update email
export const sendUpdateOrderStatus = async (userId, orderData) => {
    try {
        const userData = await User.findById(userId);
        if (!userData) {
            throw new Error("User not found");
        }

        let message = `Dear ${userData.name},\n\n`;

        switch(orderData?.status) {
            case 'Processing':
                message += `Your order is currently being processed. We are preparing your items for shipment.`;
                break;
            case 'Order Confirmed':
                message += `Your order has been confirmed. We are getting ready to ship your items.`;
                break;
            case 'Order Shipped':
                message += `Great news! Your order has been dispatched and is on its way.`;
                break;
            case 'Out for Delivery':
                message += `Your order is out for delivery. It should be arriving soon.`;
                break;
            case 'Delivered':
                message += `Your order has been successfully delivered! We hope you enjoy your purchase.`;
                break;
            default:
                message += `We have received your order and it is being processed.`;
                break;
        }

        orderData.orderItems.forEach(item => {
            message += `\nProduct: ${item.productId.title}\nSize: ${item.size}\n Color: ${item?.color}\n Quantity: ${item.quantity}\n`;
        });

        message += `\nThank you for shopping with us! We will notify you of any further updates.\nBest regards,\nOn U`;

        const subject = `Order Status Update: ${orderData.status}`;
        const text = message;

        return await sendEmail(userData.email, subject, text);
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};

// Send manifest email
export const sendMainifestMail = async (userId, manifestLink) => {
    try {
        const userData = await User.findById(userId);
        if (!userData) {
            throw new Error("User not found");
        }

        let message = `Dear ${userData.name},\n\nThank you for shopping with us! We will notify you of any further updates.\nBest regards,\nOn U`;

        const subject = 'Your Order Manifest';
        const text = message;
        const html = `
            <p>${message}</p>
            <p>Click the link below to download your manifest:</p>
            <a href="${manifestLink}" download="order_manifest">Download Manifest</a>
        `;

        return await sendEmail(userData.email, subject, text, html);
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};

// Send order placed confirmation email
export const sendOrderPlacedMail = async (userId, orderData) => {
    try {
        const userData = await User.findById(userId);
        if (!userData) {
            throw new Error("User not found");
        }

        let message = `Dear ${userData.name},\n\nThank you for your order! We have successfully processed it. Here are the details:\n`;

        orderData.orderItems.forEach(item => {
            message += `\nProduct: ${item.productId.title}\nSize: ${item.size}\nQuantity: ${item.quantity}\nStatus: ${orderData.status}\n`;
        });

        message += `\nWe will notify you once your order is shipped.\nThank you for shopping with us!\nBest regards,\nOn U`;

        const subject = 'Order Placed Successfully';
        const text = message;

        return await sendEmail(userData.email, subject, text);
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};
export const sendOrderStatusUpdateMail = async (userId, orderData) => {
    try {
        const userData = await User.findById(userId);
        if (!userData) {
            throw new Error("User not found");
        }

        let message = `Dear ${userData.name},\n\nWe wanted to let you know that the status of your order has been updated to "${orderData?.status}".\n\nThank you for choosing us for your shopping needs! If you have any questions or need further assistance, feel free to reach out.\n\nBest regards,\nThe On U Team`;

		const subject = 'Your Order Status Has Been Updated!';
		const text = message;
        return await sendEmail(userData.email, subject, text);
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};

// Send custom email
export const sendCustomMail = async (toEmail, subject, text) => {
    return await sendEmail(toEmail, subject, text);
};
