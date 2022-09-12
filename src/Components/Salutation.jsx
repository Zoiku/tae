const Salutation = ({ name }) => {
    return (
        <div className="Salutation">
            <div className="dashboard-salution-container">
                {new Date().getHours() >= 0 && new Date().getHours() < 12 && <div className="dashboard-salutation"> <span>Good morning</span>, <span>{name}!</span></div>}
                {new Date().getHours() >= 12 && new Date().getHours() < 17 && <div className="dashboard-salutation"> <span>Good afternoon</span>, <span>{name}!</span></div>}
                {new Date().getHours() >= 17 && new Date().getHours() < 24 && <div className="dashboard-salutation"> <span>Good evening</span>, <span>{name}!</span></div>}
            </div>
        </div>
    )
}

export default Salutation;