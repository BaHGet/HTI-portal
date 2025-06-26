import Container from "react-bootstrap/esm/Container";
import NavBar from "../Components/navbar";
import img from '../assets/1.jpg';

const Admin = () => {
    const navbarEliments = [{name:'User Creation',link:'adduser'}]
    return(
        <>
            <NavBar Title={{name:"HTI Admin"}} items={navbarEliments} />
            <Container className="d-flex justify-content-center mb-4">
                <img
                    src={img}
                    alt="Logo"
                    style={{ width: '150px', height: '135px' }}
                />
            </Container>
        </>
    );
};

export default Admin;