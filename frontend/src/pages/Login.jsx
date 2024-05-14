import Form from "../components/Form";

function Login({ setIsLoggedIn }) {
    function handleLoginSuccess() {
        setIsLoggedIn(true);
    }

    return <Form route="/api/token/" method="login" onSuccess={handleLoginSuccess} />
}

export default Login;