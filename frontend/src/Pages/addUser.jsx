import NavBar from "../Components/navbar";
import CreationForm from "./CreationForm";

const AddUser = () => {
    return(
        <>
           <NavBar Title={{name:"HTI Admin", link:"/HTI-portal/admin"}} /> 
           <CreationForm />
        </>
    );
};

export default AddUser;