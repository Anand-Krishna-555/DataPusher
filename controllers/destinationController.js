import db from "../config/db.js";

const createDestination = async (req, res) => {
    try {
        const { accountId, url, http_method, headers } = req.body;

        if (!accountId || !url || !http_method || !headers) {
            return res.json({
                status: false,
                message: "Invalid request",
            });
        }

        const query = db.prepare(
            `INSERT INTO destinations (accountId, url, http_method, headers) VALUES (?, ?, ?, ?)`
        );
        query.run(
            accountId,
            url,
            http_method,
            JSON.stringify(headers),
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
                    itemId: this.lastID,
                    message: "Destinaion created",
                });
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

const getDestination = async (req, res) => {
    try {
        const { accountId } = req.body;

        if (!accountId) {
            return res.json({
                status: false,
                message: "Invalid request",
            });
        }

        const query = `SELECT * FROM destinations WHERE accountId = ?`;

        db.all(query, [accountId], (err, rows) => {
            if (err) {
                console.log(err);
                return res.json({
                    status: false,
                    message: "DB Error",
                });
            }

            if (!!rows && !!rows.length) {
                res.json({
                    status: true,
                    data: rows,
                });
            } else {
                res.json({
                    status: false,
                    message: "Destination does not exists",
                });
            }
        });
    } catch (error) {
        console.log("Error -> ", error);
        res.json({
            status: false,
            message: "Error",
        });
    }
};

const updateDestination = async (req, res) => {
    try {
        const { itemId, accountId, url, http_method, headers } = req.body;
        if (!itemId || !accountId || !url || !http_method || !headers) {
            return res.json({
                status: false,
                message: "Invalid request",
            });
        }

        const query = `UPDATE destinations SET url = ?, http_method = ?,  headers = ? WHERE itemId = ? AND accountId = ?`;
        db.run(
            query,
            [url, http_method, JSON.stringify(headers), itemId, accountId],
            function (err) {
                if (err) {
                    console.log(err);
                    return res.json({
                        status: false,
                        message: "DB Error",
                    });
                }

                if (this.changes > 0) {
                    res.json({
                        status: true,
                        message: "Destination updated successfully",
                    });
                } else {
                    res.json({
                        status: false,
                        message: "Destination not found",
                    });
                }
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

const deleteDestination = async (req, res) => {
    try {
        const { itemId, accountId, isDeleteByItemId } = req.body;
        if (typeof isDeleteByItemId == "undefined" || !accountId) {
            return res.json({
                status: false,
                message: "Invalid request",
            });
        }

        let query;
        let params;

        if (isDeleteByItemId) {
            query = `DELETE FROM destinations WHERE accountId = ? AND itemId = ?`;
            params = [accountId, itemId];
        } else {
            query = `DELETE FROM destinations WHERE accountId = ?`;
            params = [accountId];
        }

        db.run(query, params, function (err) {
            if (err) {
                console.log("Error -> ", err);
                return res.json({
                    status: false,
                    message: "DB Error",
                });
            }

            if (this.changes > 0) {
                res.json({
                    status: true,
                    message: isDeleteByItemId
                        ? "Destination deleted successfully"
                        : "All destinations for the account deleted successfully",
                });
            } else {
                res.json({
                    status: false,
                    message: "Destination(s) not found",
                });
            }
        });
    } catch (error) {
        console.log("Error -> ", error);
        res.json({
            status: false,
            message: "Error",
        });
    }
};

export {
    createDestination,
    getDestination,
    updateDestination,
    deleteDestination,
};
