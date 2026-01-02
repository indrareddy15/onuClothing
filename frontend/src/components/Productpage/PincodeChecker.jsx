import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../config";
import { useLocationContext } from "../../Contaxt/LocationContext";
import { useSettingsContext } from "../../Contaxt/SettingsContext";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { MapPin } from "lucide-react";

const PincodeChecker = ({ productId }) => {
    const { pincode, isPermissionGranted } = useLocationContext();
    const [message, setMessage] = useState("");
    const { checkAndCreateToast } = useSettingsContext();
    const [customPincode, setCustomPincode] = useState(pincode);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setCustomPincode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let currentPincode = customPincode || pincode;
            if (!currentPincode) {
                checkAndCreateToast("error", "Please enter a valid pincode");
                return;
            }
            const pincodeDigistOnly = currentPincode.replace(/\D/g, "");
            if (pincodeDigistOnly.length !== 6) {
                checkAndCreateToast("error", "Pincode should be 6 digits!");
                return;
            }

            const response = await axios.get(
                `${BASE_API_URL}/api/logistic/checkPincode/?pincode=${currentPincode}&productId=${productId}`
            );
            if (response.data.result) {
                const result = response.data.result;
                setMessage(`Delivery available within ${result?.edd} days`);
            } else {
                setMessage("Sorry, delivery is not available for this pincode.");
            }
        } catch (error) {
            setMessage("Pincode not found! Please try a different Pincode.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (pincode && isPermissionGranted) {
            setCustomPincode(pincode);
        }
    }, [pincode, isPermissionGranted]);

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-900" />
                <h3 className="font-semibold text-gray-900">Check Delivery</h3>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Enter Pincode"
                    value={customPincode || ''}
                    onChange={handleInputChange}
                    className="max-w-[200px]"
                    maxLength={6}
                />
                <Button
                    type="submit"
                    variant="outline"
                    disabled={isLoading}
                    className="min-w-[80px]"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-t-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                    ) : (
                        "Check"
                    )}
                </Button>
            </form>

            {message && (
                <p className={`mt-2 text-sm ${message.includes("Sorry") || message.includes("not found") ? "text-red-500" : "text-green-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default PincodeChecker;
