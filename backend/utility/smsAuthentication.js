import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_ID; // Your Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token

const client = new twilio(accountSid, authToken);
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}
const sendingFromPhoneNumber = "+12184322835"

// Function to send the OTP via SMS
export async function sendOTP(phoneNumber,otp) {
    const message = `Your OTP is: ${otp}`;

    try {
        const messageResponse = await client.messages.create({
            body: message,
            from: sendingFromPhoneNumber, // Your Twilio phone number
            to: `+91${phoneNumber}`,     // Recipient phone number
        });
        console.log('OTP sent successfully:', messageResponse.sid);
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}
