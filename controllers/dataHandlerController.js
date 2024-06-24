import axios from "axios";
import db from "../config/db.js";

const dataHandler = async (req, res) => {
    try {
        const token = req.headers["cl-x-token"];
        if (!token) {
            return res.json({
                status: false,
                message: "Un Authenticate",
            });
        }

        db.get(
            "SELECT * FROM accounts WHERE app_secret_token = ?",
            [token],
            (err, account) => {
                if (err || !account) {
                    return res.json({
                        status: false,
                        message: "Account does not exits",
                    });
                }

                const data = req.body;
                db.all(
                    "SELECT * FROM destinations WHERE accountId = ?",
                    [account.accountId],
                    (err, destinations) => {
                        if (err) {
                            return res.json({
                                status: false,
                                message: "Error",
                                error: err.message,
                            });
                        }

                        destinations.forEach((destination) => {
                            const { url, http_method, headers } = destination;
                            const config = {
                                method: http_method,
                                url,
                                headers: JSON.parse(headers),
                            };

                            if (http_method.toUpperCase() === "GET") {
                                config.params = data;
                            } else {
                                config.data = data;
                            }

                            axios(config).catch((error) => {
                                console.log(`Error sending data to ${url}: `, error.message);
                            });
                        });

                        res.json({
                            status: true,
                            message: "Data processed",
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.log("Error -> ", error);
        res.json({
            status: false,
            message: "Error",
        });
    }
};

export { dataHandler };
