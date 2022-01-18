import React from 'react'

import { Link } from 'react-router-dom'

import Grid from './Grid'

import logo from '../assets/images/Logo-2.png'

const footerAboutLinks = [
    {
        display: "Contact",
        path: "/about"
    },
    {
        display: "News",
        path: "/about"
    },
    {
        display: "Privacy Policy",
        path: "/about"
    }
]

const footerCustomerLinks = [
    {
        display: "Terms & Conditions",
        path: "/about"
    },
    {
        display: "Help Center",
        path: "/about"
    },
    {
        display: "Returns & Refunds",
        path: "/about"
    }
]
const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <Grid
                    col={4}
                    mdCol={2}
                    smCol={1}
                    gap={10}
                >
                    <div>
                        <div className="footer__title">
                            Support
                        </div>
                        <div className="footer__content">
                            <p>
                                Contact to order <strong>0123456789</strong>
                            </p>
                            <p>
                                Order inquiries <strong>0123456789</strong>
                            </p>
                            <p>
                                Report <strong>0123456789</strong>
                            </p>
                        </div>
                    </div>
                    <div>
                        <div className="footer__title">
                            About NEED
                        </div>
                        <div className="footer__content">
                            {
                                footerAboutLinks.map((item, index) => (
                                    <p key={index}>
                                        <Link to={item.path}>
                                            {item.display}
                                        </Link>
                                    </p>
                                ))
                            }
                        </div>
                    </div>
                    <div>
                        <div className="footer__title">
                            Customer Care
                        </div>
                        <div className="footer__content">
                            {
                                footerCustomerLinks.map((item, index) => (
                                    <p key={index}>
                                        <Link to={item.path}>
                                            {item.display}
                                        </Link>
                                    </p>
                                ))
                            }
                        </div>
                    </div>
                    <div className="footer__about">
                        <p>
                            <Link to="/">
                                <img src={logo} className="footer__logo" alt="" />
                            </Link>
                        </p>
                        <p>
                            Towards the goal of bringing a new joy of dressing every day to millions of Vietnamese consumers.
                            Let's join NEED towards a more active and positive life.
                        </p>
                    </div>
                </Grid>
            </div>
        </footer>
    )
}

export default Footer
