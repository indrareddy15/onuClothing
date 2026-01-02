import { X } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import { fetchCouponBannerData, sendGetCoupon } from '../../action/common.action';
import { useDispatch } from 'react-redux';
import popUp from '../images/popUp-image.jpg';
import { useSettingsContext } from '../../Contaxt/SettingsContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const FullScreenOverLayCouponPopUp = () => {
    const dispatch = useDispatch();
    const { checkAndCreateToast } = useSettingsContext();
    const [isOpen, setIsOpen] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loadingSent, setLoadingSent] = useState(false);
    const [bannerData, setBannerData] = useState(null);

    const handleGetCouponClick = async () => {
        try {
            setLoadingSent(true);
            const sentSuccessful = await dispatch(sendGetCoupon({ fullName: name, email: email }));
            // Close the dialog if successful or display an error message if failed or invalid email/name
            if (sentSuccessful?.success) {
                checkAndCreateToast("success", sentSuccessful?.message || "Email sent successfully");
                setName('');
                setEmail('');
                setIsOpen(false);
            } else {
                checkAndCreateToast("error", sentSuccessful?.message || 'Invalid email or name');
            }

        } catch (error) {
            console.error("Error sending coupon: ", error);
            checkAndCreateToast("error", "Failed to send coupon email. Please try again later.");
        } finally {
            setLoadingSent(false);
        }
    };
    const fetchBannerData = async () => {
        try {
            const response = await dispatch(fetchCouponBannerData())
            // console.log("Response: ", response);
            if (response) {
                setBannerData(response);
            }
        } catch (error) {
            console.error("Error fetching banner data: ", error);
        }
    }
    const handleHateCouponClick = () => {
        closeDialog();
    };

    // Function to close the dialog
    const closeDialog = () => {
        setIsOpen(false);
    };

    // Close dialog when clicking outside the modal
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeDialog();
        }
    };
    useEffect(() => {
        if (isOpen) {
            fetchBannerData();
        }
    }, [dispatch, isOpen])
    // Disable scrolling on body when dialog is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Disable scroll
        } else {
            document.body.style.overflow = 'auto'; // Re-enable scroll
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);
    // console.log("Banner Data: ", bannerData);
    return (
        <Fragment>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center transition-opacity duration-500 ease-in-out"
                    onClick={handleOverlayClick}
                >
                    <div
                        className="bg-white w-full max-w-lg md:max-w-4xl mx-4 h-auto md:h-[550px] grid grid-cols-1 md:grid-cols-2 shadow-2xl overflow-hidden relative animate-fadeInUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className='absolute top-4 right-4 z-20 p-2 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100'
                            onClick={handleHateCouponClick}
                        >
                            <X size={20} />
                        </button>

                        {/* Left Column - Form */}
                        <div className="flex flex-col justify-center p-8 md:p-12 bg-white order-2 md:order-1">
                            <div className="space-y-2 mb-8 text-center md:text-left">
                                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Limited Time Offer</span>
                                <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                                    {bannerData?.header || "Unlock 20% Off"}
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {bannerData?.subHeader || "Join our exclusive list and get 20% off your first purchase. Be the first to know about new drops."}
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <label htmlFor="name" className="sr-only">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors placeholder-gray-400"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your Name"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors placeholder-gray-400"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your Email Address"
                                    />
                                </div>

                                <button
                                    disabled={loadingSent}
                                    onClick={handleGetCouponClick}
                                    className="w-full py-3 bg-black text-white text-sm font-medium tracking-widest uppercase hover:bg-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loadingSent ? "Processing..." : "Get My Code"}
                                </button>

                                <button
                                    onClick={handleHateCouponClick}
                                    className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 tracking-wide uppercase transition-colors"
                                >
                                    No thanks, I prefer paying full price
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Image */}
                        <div className="hidden md:block relative h-full order-1 md:order-2">
                            <div className="absolute inset-0 bg-gray-200">
                                <LazyLoadImage
                                    effect='blur'
                                    src={bannerData?.bannerModelUrl || popUp}
                                    alt="Exclusive Offer"
                                    className="h-full w-full object-cover"
                                    wrapperClassName="h-full w-full block"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default FullScreenOverLayCouponPopUp;
