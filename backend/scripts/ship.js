// shiprocket-pickups.js
require("dotenv").config();
const axios = require("axios");

// const {
//   SHIPROCKET_API_URL,
//   SHIPROCKET_EMAIL,
//   SHIPROCKET_PASSWORD,
// } = process.env;

const SHIPROCKET_API_URL = `https://apiv2.shiprocket.in/v1/external`
const SHIPROCKET_EMAIL = 'gantaindrareddy83@gmail.com'
const SHIPROCKET_PASSWORD = '2i&fJr9Q1aY8jZk^'


async function getShipRocketToken() {
    try {
        const res = await axios.post(
            `${SHIPROCKET_API_URL}/auth/login`,
            {
                email: SHIPROCKET_EMAIL,
                password: SHIPROCKET_PASSWORD,
            }
        );

        if (!res.data?.token) {
            throw new Error("No token returned from Shiprocket login");
        }

        console.log("✅ Got Shiprocket token");
        return res.data.token;
    } catch (err) {
        console.error(
            "❌ Error getting Shiprocket token:",
            err.response?.status,
            err.response?.data || err.message
        );
        throw err;
    }
}

async function fetchAllPickupLocations() {
    try {
        const token = await getShipRocketToken();

        console.log("📦 Fetching all pickup locations...");

        const response = await axios.get(
            `${SHIPROCKET_API_URL}/settings/company/pickup`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("🔹 Raw response:", JSON.stringify(response.data.data.shipping_address, null, 2));

        const locations = response.data?.data.shipping_address
            ? response.data.data.shipping_address
            : [];

        console.log(`✅ Found ${locations.length} pickup location(s).`);
        locations.forEach((loc, i) => {
            console.log(
                `#${i + 1}: id=${loc.id}, pickup_location=${loc.pickup_location}, city=${loc.city}`
            );
        });

        return locations;
    } catch (err) {
        console.error(
            "❌ Error fetching pickup locations:",
            err.response?.status,
            err.response?.data || err.message
        );
        throw err;
    }
}

// Run directly
fetchAllPickupLocations().catch(() => { });
