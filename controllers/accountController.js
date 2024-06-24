import { generateToken } from "../utils/consts.js";
import db from "../config/db.js";

const createAccount = async (req, res) => {
    try {
        const { email, account_name, website } = req.body;

        if (!email || !account_name) {
            return res.json({
                status: false,
                message: "Invalid Data",
            });
        }

        const app_secret_token = generateToken();
        const query = db.prepare(
            `INSERT INTO accounts (email, account_name, app_secret_token, website) VALUES (?, ?, ?, ?)`
        );

        query.run(
            email,
            account_name,
            app_secret_token,
            website,
            function (err) {
                if (err) {
                    console.log(err);
                    return res.json({
                        status: false,
                        message: "DB Error",
                    });
                }

                res.json({
                    status: true,
                    message: "Account Created",
                    accountId: this.lastID,
                    app_secret_token,
                });
            }
        );
    } catch (error) {
        console.log("Error occured -> ", error);
        res.json({
            status: false,
            message: "Error",
        });
    }
};

const getAccount = async (req, res) => {
    try {
        const { accountId } = req.body;

        if (!accountId) {
            return res.json({
                status: false,
                message: "Invalid request",
            });
        }

        db.get(
            `SELECT * FROM accounts WHERE accountId = ?`,
            [accountId],
            function (err, row) {
                if (err) {
                    console.log(err);
                    return res.json({
                        status: false,
                        message: "DB error",
                    });
                }

                if (!!row) {
                    res.json({
                        status: true,
                        data: row,
                    });
                } else {
                    res.json({
                        status: false,
                        message: "Account not found",
                    });
                }
            }
        );
    } catch (error) {
        console.log("Error occured -> ", error);
        res.json({
            status: false,
            message: "Error",
        });
    }
};

const updateAccount = async (req, res) => {
    try {
        const { email, account_name, website, accountId } = req.body;
        if (!email || !account_name || !website || !accountId) {
            return res.json({
                status: false,
                message: "Invalid request",
            });
        }

        const account = db.get(`SELECT * FROM accounts WHERE accountId = ?`, [
            accountId,
        ]);
        if (!account) {
            return res.json({
                status: false,
                message: "Account not found",
            });
        }

        const query = db.prepare(
            `UPDATE accounts SET email = ?, account_name = ?, website = ? WHERE accountId = ?`
        );
        query.run(email, account_name, website, accountId, function (err) {
            if (err) {
                return res.json({
                    status: false,
                    message: err.message,
                });
            }

            res.json({
                status: true,
                message: "Account updated successfully",
            });
        });
    } catch (error) {
        console.log("Error occured -> ", error);
        res.json({
            status: false,
            message: "Error",
        });
    }
};

const deleteAccount = async (req, res) => {
    // try {
    //     //  Need to delete Desination for relevant account too
    //     const { accountId } = req.body;
    //     if (!accountId) {
    //         return res.json({
    //             status: false,
    //             message: "Invalid request",
    //         });
    //     }

    //     const account = db.get(`SELECT * FROM accounts WHERE accountId = ?`, [
    //         accountId,
    //     ]);
    //     if (!account) {
    //         return res.json({
    //             status: false,
    //             message: "Account not found",
    //         });
    //     }

    //     const query = db.prepare(`DELETE FROM accounts WHERE accountId = ?`);
    //     query.run(accountId, function (err) {
    //         if (err) {
    //             return res.json({
    //                 status: false,
    //                 message: "DB Error",
    //                 error: err.message,
    //             });
    //         }

    //         res.json({
    //             status: true,
    //             message: "Account deleted successfully",
    //         });
    //     });
    // } catch (error) {
    //     console.log("Error occured -> ", error);
    //     res.json({
    //         status: false,
    //         message: "Error",
    //     });
    // }

    try {
        const { accountId } = req.body;
        if (!accountId) {
            return res.json({
                status: false,
                message: "Invalid request",
            });
        }

        // Check if the account exists
        db.get(
            `SELECT * FROM accounts WHERE accountId = ?`,
            [accountId],
            (err, account) => {
                if (err) {
                    return res.json({
                        status: false,
                        message: "DB Error",
                        error: err.message,
                    });
                }

                if (!account) {
                    return res.json({
                        status: false,
                        message: "Account not found",
                    });
                }

                // Attempt to delete destinations related to the account
                db.run(
                    `DELETE FROM destinations WHERE accountId = ?`,
                    [accountId],
                    function (err) {
                        if (err) {
                            console.log(
                                "Error deleting destinations:",
                                err.message
                            );
                            // Log the error but do not stop the deletion process
                        }

                        // Delete the account regardless of whether destinations were found or an error occurred
                        db.run(
                            `DELETE FROM accounts WHERE accountId = ?`,
                            [accountId],
                            function (err) {
                                if (err) {
                                    return res.json({
                                        status: false,
                                        message:
                                            "DB Error while deleting account",
                                        error: err.message,
                                    });
                                }

                                res.json({
                                    status: true,
                                    message:
                                        "Account and its destinations deleted successfully (if any existed)",
                                });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.log("Error occured -> ", error);
        res.json({
            status: false,
            message: "Error",
        });
    }
};

export { createAccount, getAccount, updateAccount, deleteAccount };
