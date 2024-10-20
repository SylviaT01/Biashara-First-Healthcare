import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsHelping, faHeartbeat, faPeopleCarry, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import { Parallax } from 'react-parallax';


const About = () => {
    const [loading, setLoading] = useState(true);
    return (
        <div className="min-h-screen">
            <div className="header">
                <Parallax
                    className="w-full h-[calc(100vh-5rem)] object-cover brightness-[.6]"
                    bgImage="https://img.freepik.com/premium-photo/ecofriendly-business-summit-ecofriendly-company-meeting-with-business-people-save-nature_71956-34971.jpg?w=740"
                    strength={225}
                >
                    <div className="flex items-center justify-center h-full">
                        <p className="text-center uppercase font-extralight text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                            About Biashara First Healthcare
                        </p>
                    </div>
                </Parallax>
            </div>

            <section className="container mx-auto text-center py-8">
                <h1 className="tracking-widest font-semibold uppercase text-xl p-5 text-black">Biashara First Healthcare</h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl px-4 sm:px-10 lg:px-[20rem] pb-5 font-extralight">
                    Revolutionizing healthcare connections between businesses and hospitals for a healthier tomorrow.
                </p>
            </section>
            <section className="container mx-auto shadow-lg rounded-lg">
                <div className="flex md:px-8 xl:px-44 flex-col md:grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto w-full pb-8 border border-gray-300 rounded-lg">
                    <div className="flex flex-col justify-center items-start mt-4 pb-2 text-xl">
                        <h2 className="text-3xl font-semibold text-[#A57D7D]">Our Mission</h2>
                        <p className="text-gray-600 mt-4 font-light">
                            At Biashara First Healthcare, we aim to bridge the gap between businesses and healthcare services, ensuring that healthcare accessibility is seamless, efficient, and reliable for everyone.
                        </p>
                        <h2 className="text-3xl font-semibold text-[#A57D7D] mt-8">Our Vision</h2>
                        <p className="text-gray-600 mt-4 font-light">
                            Our vision is to create a future where businesses can easily find and partner with healthcare providers, improving the overall health outcomes for communities through collaboration and innovation.
                        </p>
                    </div>

                    {/* Image Section */}
                    <article className="mt-12 flex justify-center relative self-end w-full md:w-auto">
                        <div className="relative flex justify-center">
                            <img
                                src="https://img.freepik.com/premium-photo/students-looking-map-table_746565-178297.jpg?w=360"
                                alt="hero-img"
                                className={`w-full max-w-[400px] ${loading ? "shimmer" : ""}`}
                                onLoadingComplete={() => setLoading(false)}
                            />
                            <div className="absolute left-0 -translate-x-1/2 bottom-0 opacity-50">
                                <img
                                    src="https://img.freepik.com/free-photo/young-adults-traveling-london_23-2149259460.jpg?t=st=1729163124~exp=1729166724~hmac=6eebdfeb13f98e22b63cd2089b5ba1ef7ea7559f88be2fa52f6740c36c33a512&w=740"
                                    alt="hero-img"
                                    className={`w-full max-w-[250px] ${loading ? "shimmer" : ""}`}
                                    onLoadingComplete={() => setLoading(false)}
                                />
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section className=" py-16">
                <div className="container mx-auto text-center">
                    <h3 className="text-3xl font-bold text-[#A57D7D]">Our Core Values</h3>
                    <p className="text-gray-600 mt-4 mb-12">
                        We are committed to delivering exceptional services through our core values. These values drive us to make a positive impact in the healthcare industry.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="p-6 bg-white shadow-lg rounded-lg text-center transform transition duration-300 hover:scale-105 hover:bg-[#f0f9f4] hover:shadow-2xl">
                            <FontAwesomeIcon icon={faHeartbeat} className="text-4xl text-red-300 mb-4" />
                            <h4 className="text-xl font-semibold text-gray-800">Health & Wellness</h4>
                            <p className="text-gray-600 mt-2">We prioritize the health and wellness of our users, providing easy access to top healthcare facilities.</p>
                        </div>
                        <div className="p-6 bg-white shadow-lg rounded-lg text-center transform transition duration-300 hover:scale-105 hover:bg-[#f0f9f4] hover:shadow-2xl">
                            <FontAwesomeIcon icon={faHandsHelping} className="text-4xl text-red-300 mb-4" />
                            <h4 className="text-xl font-semibold text-gray-800">Support & Collaboration</h4>
                            <p className="text-gray-600 mt-2">We believe in collaboration, supporting both businesses and healthcare providers for mutual growth.</p>
                        </div>
                        <div className="p-6 bg-white shadow-lg rounded-lg text-center transform transition duration-300 hover:scale-105 hover:bg-[#f0f9f4] hover:shadow-2xl">
                            <FontAwesomeIcon icon={faPeopleCarry} className="text-4xl text-red-300 mb-4" />
                            <h4 className="text-xl font-semibold text-gray-800">Community Impact</h4>
                            <p className="text-gray-600 mt-2">We are dedicated to building strong communities by making healthcare more accessible to all businesses and individuals.</p>
                        </div>
                        <div className="p-6 bg-white shadow-lg rounded-lg text-center transform transition duration-300 hover:scale-105 hover:bg-[#f0f9f4] hover:shadow-2xl">
                            <FontAwesomeIcon icon={faShieldAlt} className="text-4xl text-red-300 mb-4" />
                            <h4 className="text-xl font-semibold text-gray-800">Trust & Integrity</h4>
                            <p className="text-gray-600 mt-2">Our platform is built on trust and integrity, ensuring that businesses and hospitals can rely on us for accurate, dependable connections.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-8 container mx-auto">
                <h3 className="text-3xl font-bold text-center text-[#A57D7D]">Why Choose Biashara First Healthcare?</h3>
                <p className="text-center text-gray-600 mt-4 mb-12 max-w-2xl mx-auto">
                    Biashara First Healthcare is more than just a platform; it's a movement aimed at creating stronger healthcare connections. We bring the power of businesses and healthcare providers together for better access to care and support.
                </p>
                <div className="flex justify-center space-x-6">
                    <a href="/register-business" className="px-6 py-3 bg-[#cf9897] text-gray-500 rounded-md hover:bg-[#e28d8c]">
                        Register Your Business
                    </a>
                    <a href="/contact" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Get in Touch
                    </a>
                </div>
            </section>
        </div>
    );
};

export default About;
