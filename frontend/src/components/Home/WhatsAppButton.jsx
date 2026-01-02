import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTermsAndCondition } from '../../action/common.action';

const WhatsAppButton = ({ scrollableDivRef }) => {
    const { termsAndCondition } = useSelector(state => state.TermsAndConditions);
    const dispatch = useDispatch();
    const [phoneNumber, setPhoneNumber] = useState('919326727797');
    const message = 'Hi! I need help with my order.';
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollableDivRef && scrollableDivRef.current) {
                setScrollPosition(scrollableDivRef.current.scrollTop);
            } else {
                setScrollPosition(window.pageYOffset);
            }
        };

        // Attach the scroll event listener
        if (scrollableDivRef && scrollableDivRef.current) {
            const divElement = scrollableDivRef.current;
            divElement.addEventListener('scroll', handleScroll);

            return () => {
                if (divElement) {
                    divElement.removeEventListener('scroll', handleScroll);
                }
            };
        } else {
            // Fallback to window scroll
            window.addEventListener('scroll', handleScroll);

            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [scrollableDivRef]);

    useEffect(() => {
        if (termsAndCondition) {
            setPhoneNumber(termsAndCondition?.phoneNumber);
        }
    }, [termsAndCondition]);

    useEffect(() => {
        dispatch(fetchTermsAndCondition());
    }, [dispatch]);

    const handleClick = () => {
        const checkedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        const url = `https://wa.me/${checkedPhoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <style>
                {`
                    @keyframes slowBounce {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-10px);
                        }
                    }
                    @keyframes slowPing {
                        0% {
                            transform: scale(1);
                            opacity: 0.75;
                        }
                        100% {
                            transform: scale(1.5);
                            opacity: 0;
                        }
                    }
                    .animate-slow-bounce {
                        animation: slowBounce 1s ease-in-out infinite;
                    }
                    .animate-slow-ping {
                        animation: slowPing 1s cubic-bezier(0, 0, 0.2, 1) infinite;
                    }
                `}
            </style>
            <button
                onClick={handleClick}
                className={`fixed z-40 right-6 bottom-40 md:right-8 md:bottom-24 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group animate-slow-bounce hover:animate-none ${scrollPosition > 100 ? 'opacity-100 scale-100' : 'opacity-90 scale-90'
                    }`}
                title="Chat with us on WhatsApp"
                aria-label="Contact us on WhatsApp"
            >
                <FaWhatsapp
                    size={24}
                    className="group-hover:scale-110 transition-transform duration-200"
                />

                {/* Pulse effect */}
                <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-slow-ping"></span>
            </button>
        </>
    );
};

export default WhatsAppButton;
