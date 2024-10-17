import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import instagramIcon from '../components/icons/instagramIcon.png';
import youtubeIcon from '../components/icons/youtubeIcon.png';
import twitterIcon from '../components/icons/twitterIcon.png';
import facebookIcon from '../components/icons/facebookIcon.png';
import hospitallogo from '../components/icons/YuBuntu-Logo-WpT-p-500 (1).png';

const Footer = () => {

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <footer className="text-black py-4 bg-[#b7e5db] relative  ">
            <div className="container px-4 max-w-sm mx-auto md:max-w-none gap-4 mb-2 w-full">
                <div className="flex flex-col md:flex-row md:justify-between items-center p-2">
                    <Link to="/" className="font-semibold text-2xl text-gray-700">
                        <img src={hospitallogo} alt="BFH Logo" className="h-4 md:h-19" />
                    </Link>
                    <p className="text-gray-600 font-medium text-center mb-4 md:mb-0">
                        © 2024 BIASHARA FIRST HEALTHCARE. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400">
                            <img src={instagramIcon} alt="Instagram" className="h-5 w-5 md:h-6 md:w-6" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400">
                            <img src={youtubeIcon} alt="YouTube" className="h-5 w-5 md:h-6 md:w-6" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400">
                            <img src={twitterIcon} alt="Twitter" className="h-5 w-5 md:h-6 md:w-6" />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400">
                            <img src={facebookIcon} alt="Facebook" className="h-5 w-5 md:h-6 md:w-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    );
};

export default Footer;

