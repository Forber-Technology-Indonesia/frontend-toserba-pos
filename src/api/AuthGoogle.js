const API1_URL = process.env.REACT_APP_API1_URL;

const AuthGoogle = async (googleRespond) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            authType: "google",
            googleRespond: googleRespond
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        // Perform the fetch call and await its result
        const response = await fetch(API1_URL + "/api1/Auth/SignIn", requestOptions);

        // Check if the response status is 200-299 (success)
        if (!response.ok) {
            // If not, throw an error
            const errorMessage = `Error: ${response.status} - ${response.statusText}`;
            throw new Error(errorMessage);
        }

        // Parse the response as JSON
        const result = await response.json();
        console.log("Login success: ", result);

        return result;

    } catch (error) {
        // Catch any errors and log them
        console.error("Login failed: ", error.message);
        return { error: error.message }; // Optional: return error message for further handling
    }
};

export default AuthGoogle;
