import mongoose from 'mongoose';
import WebSiteModel from '../model/websiteData.model.js';
import dotenv from 'dotenv';

dotenv.config();

const initializeWebsiteData = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000
        });
        console.log('Connected to database');

        // Check if WebsiteDisclaimers already exists
        const existingDisclaimers = await WebSiteModel.findOne({ tag: 'WebsiteDisclaimers' });

        if (!existingDisclaimers) {
            // Create initial disclaimer data
            const disclaimerData = new WebSiteModel({
                tag: 'WebsiteDisclaimers',
                WebsiteDisclaimers: [
                    {
                        title: 'General Disclaimer',
                        content: 'This website provides general information only and is not intended as professional advice.',
                        isActive: true
                    },
                    {
                        title: 'Product Information',
                        content: 'Product information and prices are subject to change without notice.',
                        isActive: true
                    }
                ]
            });

            await disclaimerData.save();
            console.log('Website disclaimers initialized successfully');
        } else {
            console.log('Website disclaimers already exist');
        }

        // Close database connection
        await mongoose.disconnect();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error initializing website data:', error);
        process.exit(1);
    }
};

// Run the initialization
initializeWebsiteData();