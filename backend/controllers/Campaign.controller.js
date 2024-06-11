const Customer = require("../models/Customer.model.js");
const communicationLogs = require("../models/CommunicationLogs.model.js")
const campaignFilter = (req, res, next) => {
    const { situations, logic, filterValues } = req.body;

    console.log(req.body, "123");
    const {
        spendAmount1,
        spendOperator1,
        spendAmount2,
        spendOperator2,
        visitOperator,
        maxVisits,
        notVisitedMonths,
    } = filterValues;

    const spendOperatorMap = {
        ">": "$gt",
        "<": "$lt",
        "=": "$eq",
    };

    let query = {};

    // Situation 1
    if (situations.situation1) {
        query.totalSpends = {
            [spendOperatorMap[spendOperator1]]: parseInt(spendAmount1, 10),
        };
    }

    // Situation 2
    if (situations.situation2) {
        const situation2Query = {
            visits: {
                [visitOperator === "max" ? "$lte" : "$gte"]: parseInt(maxVisits, 10),
            },
            totalSpends: {
                [spendOperatorMap[spendOperator2]]: parseInt(spendAmount2, 10),
            },
        };

        if (situations.situation1) {
            query = {
                [logic.logic1 === "AND" ? "$and" : "$or"]: [query, situation2Query],
            };
        } else {
            query = situation2Query;
        }
    }

    // Situation 3
    if (situations.situation3) {





        // Step 1: Subtract the specified number of months from the current date
        const todaysDate = new Date();
        todaysDate.setMonth(todaysDate.getMonth() - notVisitedMonths);



        // Step 3: Create a MongoDB query to find documents where lastVisit is before this date
        const situation3Query = {
            lastVisit: { $lt: todaysDate },
        };



        if (Object.keys(query).length > 0) {
            const logicOperator = logic.logic2;

            query = {
                [logicOperator === "AND" ? "$and" : "$or"]: [query, situation3Query],
            };
        } else {
            query = situation3Query;
        }
    }
    console.log(query);
    if (Object.keys(query).length === 0) {
        res.status(204).json({ data: [] });
    }



    Customer.find(query)
        .then(customers => {
            if (customers.length > 0) {
                res.status(201).json({ data: customers, count: customers.length });
            } else {
                console.log(customers);
                res.status(204).json({ data: customers, count: customers.length });
            }
        })
        .catch(err => {
            console.error("INTERNAL SERVER ERROR", err);
            res.status(500).json({ message: "ERROR FINDING FILTERED CUSTOMERS" });
        });
};
const getFilteredTable = async(req, res) => {
    try {
        const filteredTable = await communicationLogs.find().sort({ _id: -1 }); // Sort by _id in descending order
        res.json(filteredTable);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const postFilteredTable = (req, res, next) => {
    const { data, message, discountPercentage } = req.body;
    const audience = data.map(customer => ({
        customerEmail: customer.email,
        customerName: customer.name
    }));

    const personalizedMessage = message.replace("${discountPercentage}", discountPercentage);
    const newLog = {
        audience,
        message: personalizedMessage,
        discountPercentage,
        date: Date.now()
    };

    const communicationLog = new communicationLogs(newLog);

    communicationLog.save()
        .then(savedLog => {
            res.status(201).json({ message: "Communication log saved successfully", log: savedLog });
        })
        .catch(err => {
            console.error("Error saving communication log:", err);
            res.status(500).json({ message: "Error saving communication log" });
        });
};

module.exports = { campaignFilter, postFilteredTable, getFilteredTable };