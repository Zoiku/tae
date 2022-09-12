import "../Styles/Home.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import log from "../Assets/log.jpg";

import { PrimaryButton } from "../Material/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import Marquee from "react-fast-marquee";

import { useEffect } from "react";


const Home = () => {
    useEffect(() => {
        document.title = "TAE"
    }, []);

    return (
        <div className="Home">
            <div className="tae-home-banner-container">
                <div className="tae-home-banner">
                    <ul>
                        <li>1 Request = Multiple Quotes</li>
                        <li>Unlimited Supply</li>
                        <li>Verified Merchants</li>
                    </ul>
                    <ul>
                        <li>Direct Sourcing</li>
                        <li>Buyer Protection</li>
                        <li>Seamless Procurement</li>
                    </ul>
                </div>
            </div>

            <div className="product-section-containers">
                <section className="product-section-container">
                    <div className="specification-container">
                        <div>
                            <div className="specification-title">Teak Round Logs</div>
                            <div className="specification-description-short">Long. Hard. Durable</div>
                            <div className="specification-button-container">
                                <PrimaryButton>Request Quotes</PrimaryButton>
                            </div>
                        </div>
                    </div>
                    <div className="swiper-container">
                        <Swiper
                            navigation={true}
                            pagination={true}
                            modules={[Pagination, Navigation]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <img src={log} alt="" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={log} alt="" />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </section>

                <section className="product-section-container">
                    <div className="specification-container">
                        <div>
                            <div className="specification-title">Teak Round Logs</div>
                            <div className="specification-description-short">Long. Hard. Durable</div>
                            <div className="specification-button-container">
                                <PrimaryButton>Request Quotes</PrimaryButton>
                            </div>
                        </div>
                    </div>
                    <div className="swiper-container">
                        <Swiper
                            navigation={true}
                            pagination={true}
                            modules={[Pagination, Navigation]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <img src={log} alt="" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={log} alt="" />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </section>
            </div>

            <div className="home-coming-soon-container">
                <div className="home-coming-soon-title">Coming Soon</div>
                <Marquee className="coming-soon-marquee" gradient={false} pauseOnClick={true} speed={30} style={{ marginTop: 20 }}>
                    <div className="coming-soon-card-container">
                        <div className="coming-soon-card-img">
                            <img src={log} alt="" />
                        </div>
                        <div className="coming-soon-card-name">Special Log</div>
                    </div>
                    <div className="coming-soon-card-container">
                        <div className="coming-soon-card-img">
                            <img src={log} alt="" />
                        </div>
                        <div className="coming-soon-card-name">Special Log</div>
                    </div>
                    <div className="coming-soon-card-container">
                        <div className="coming-soon-card-img">
                            <img src={log} alt="" />
                        </div>
                        <div className="coming-soon-card-name">Special Log</div>
                    </div>
                    <div className="coming-soon-card-container">
                        <div className="coming-soon-card-img">
                            <img src={log} alt="" />
                        </div>
                        <div className="coming-soon-card-name">Special Log</div>
                    </div>
                    <div className="coming-soon-card-container">
                        <div className="coming-soon-card-img">
                            <img src={log} alt="" />
                        </div>
                        <div className="coming-soon-card-name">Special Log</div>
                    </div>
                    <div className="coming-soon-card-container">
                        <div className="coming-soon-card-img">
                            <img src={log} alt="" />
                        </div>
                        <div className="coming-soon-card-name">Special Log</div>
                    </div>
                    <div className="coming-soon-card-container">
                        <div className="coming-soon-card-img">
                            <img src={log} alt="" />
                        </div>
                        <div className="coming-soon-card-name">Special Log</div>
                    </div>
                </Marquee>
            </div>
        </div>
    )
}

export default Home;