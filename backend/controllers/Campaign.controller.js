const Order = require("../models/Order.model.js");
const Customer = require("../models/Customer.model.js");

const campaignFilter = async(req, res, next) => {
    const { situations, logic, filterValues } = req.body;
    console.log(req.body);
    const {
        spendAmount,
        spendOperator,
        spendAmountSecond,
        visitOperator,
        maxVisits,
        notVisitedMonths,
    } = filterValues;

    const spendOperatorMap = {
        ">": "$gt",
        "<": "$lt",
        "=": "$eq",
    };

    const countPipeline = [];
    const dataPipeline = [];

    // Situation 1
    if (situations.situation1) {
        countPipeline.push({
            $match: {
                totalSpends: {
                    [spendOperatorMap[spendOperator]]: parseInt(spendAmount, 10),
                },
            },
        });
    }

    // Situation 2
    if (situations.situation2) {
        const situation2Match = {
            $match: {
                $and: [{
                        visits: {
                            [visitOperator === "max" ? "$lte" : "$gte"]: parseInt(maxVisits, 10),
                        },
                    },
                    {
                        totalSpends: {
                            [spendOperatorMap[spendOperator]]: parseInt(spendAmountSecond, 10),
                        },
                    },
                ],
            },
        };

        if (situations.situation1) {
            const combinedMatch = {
                $match: {
                    [logic.logic1 === "AND" ? "$and" : "$or"]: [
                        countPipeline[0].$match,
                        situation2Match.$match,
                    ],
                },
            };
            countPipeline.splice(0, countPipeline.length);
            countPipeline.push(combinedMatch);
        } else {
            countPipeline.push(situation2Match);
        }
    }

    // Situation 3
    if (situations.situation3) {
        const notVisitedDate = new Date();
        notVisitedDate.setMonth(notVisitedDate.getMonth() - parseInt(notVisitedMonths, 10));

        const situation3Match = {
            $match: {
                lastVisit: { $lt: notVisitedDate },
            },
        };

        if (countPipeline.length > 0) {
            const logicOperator = situations.situation2 ? logic.logic2 : logic.logic1;

            const combinedMatch = {
                $match: {
                    [logicOperator === "AND" ? "$and" : "$or"]: [
                        countPipeline[countPipeline.length - 1].$match,
                        situation3Match.$match,
                    ],
                },
            };
            countPipeline[countPipeline.length - 1] = combinedMatch;
        } else {
            countPipeline.push(situation3Match);
        }
    }

    if (countPipeline.length === 0) {
        return res.status(400).json({ error: "No situations selected" });
    }

    dataPipeline.push(...countPipeline);

    console.log(dataPipeline);

    try {
        const countResult = await Customer.aggregate(countPipeline);
        const dataResult = await Customer.aggregate(dataPipeline);

        const count = countResult.length > 0 ? countResult.length : 0;
        const data = dataResult;

        res.json({ count, customers: data });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { campaignFilter };