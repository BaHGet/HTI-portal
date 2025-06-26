import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

const NavBar = ({Title, items}) =>{
    return(
        <Navbar bg="dark" data-bs-theme="dark" fixed="top" expand="lg" className="bg-body-tertiary p-3"  >
            {Title.link && 
                window.location.pathname != `/HTI-portal/${Title.link}` ?
                (<Link to={{pathname:Title.link}} style={{textDecoration:'none'}}>{<Navbar.Brand>{Title.name}</Navbar.Brand>}</Link>)
                :(<Navbar.Brand>{Title.name}</Navbar.Brand>)
            }
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                {
                   (items && items.length>0) && 
                   items.map(item => <Link to={item.link} style={{textDecoration:'none'}}>{<Navbar.Text>{item.name}</Navbar.Text>}</Link>)
                }
            </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;