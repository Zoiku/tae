import "../Styles/Footer.css";

const Footer = () => {
    return (
        <footer className="Footer">
            <div>
                <div>About</div>
                <ul>
                    <li>Company</li>
                    <li>How it works</li>
                    <li>Payment Options</li>
                    <li>Buyers</li>
                    <li>Merchant</li>
                </ul>
            </div>

            <div>
                <div>Legal</div>
                <ul>
                    <li>Terms of Service</li>
                    <li>Payment Terms</li>
                    <li>Privacy Policy</li>
                    <li>Cookie Policy</li>
                    <li>Sale and Purchace Agreement</li>
                </ul>
            </div>

            <div>
                <div>Contact</div>
                <ul>
                    <li>hello@theafricanexporter.com</li>
                    <li>00233508556755</li>
                </ul>
            </div>

            <div>
                <span>Copyright © Afrigateway Limited. All rights reserved</span>
            </div>
        </footer>
    )
}

export default Footer;