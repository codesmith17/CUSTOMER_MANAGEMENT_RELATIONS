import React, { useState } from "react";
import styles from "./CustomerFilterPage.module.css";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

const CustomerFilterPage = () => {
  const [situations, setSituations] = useState({
    situation1: false,
    situation2: false,
    situation3: false,
  });
  const [logic, setLogic] = useState({
    logic1: "AND",
    logic2: "AND",
  });
  const [filterValues, setFilterValues] = useState({
    spendOperator: ">",
    spendAmount: 10000,
    spendAmountSecond: 10000,
    visitOperator: "max",
    maxVisits: 3,
    notVisitedMonths: 3,
  });

  const handleSituationChange = (e) => {
    setSituations({ ...situations, [e.target.name]: e.target.checked });
  };

  const handleLogicChange = (e) => {
    setLogic({ ...logic, [e.target.name]: e.target.value });
  };

  const handleFilterValueChange = (e) => {
    const { name, value } = e.target;
    setFilterValues({ ...filterValues, [name]: value });
  };

  const getSituationText = (situation) => {
    const {
      spendOperator,
      spendAmount,
      spendAmountSecond,
      visitOperator,
      maxVisits,
      notVisitedMonths,
    } = filterValues;
    switch (situation) {
      case "situation1":
        return `have spent ${spendOperator} INR ${spendAmount}`;
      case "situation2":
        return `have ${visitOperator} number of visits = ${maxVisits} and spent ${spendOperator} INR ${spendAmountSecond}`;
      case "situation3":
        return `have not visited in the last ${notVisitedMonths} months`;
      default:
        return "";
    }
  };

  const applyFilter = () => {
    const selectedSituations = Object.keys(situations).filter((key) => {
      return situations[key] === true;
    });

    if (selectedSituations.length === 0) {
      toast.warning("Please select at least one situation.");
      return;
    }

    let message = "Filtering customers who ";
    const situationTexts = [];
    const logicArray = [];
    for (let i = 0; i < selectedSituations.length; i++) {
      situationTexts.push(getSituationText(selectedSituations[i]));
    }

    for (let i = 0; i < situationTexts.length - 1; i++) {
      const logicNumber = Math.floor(
        (Number(selectedSituations[i].at(-1)) +
          Number(selectedSituations[i + 1].at(-1))) /
          2
      );
      message += situationTexts[i];
      message += " ";
      message += logic[`logic${logicNumber}`];
      logicArray.push(logic[`logic${logicNumber}`]);
      message += " ";
    }
    message += situationTexts.at(-1);
    toast.info(message);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterContent}>
        <h1 className={styles.filterTitle}>Customer Filter</h1>

        <div className={styles.filterInfo}>
          <FaFilter className={styles.filterIcon} />
          <span className={styles.filterText}>Advanced Filters</span>
        </div>

        <div className={styles.situationsContainer}>
          <h2 className={styles.situationsTitle}>Build Your Query:</h2>

          <label className={styles.situationLabel}>
            <input
              type="checkbox"
              name="situation1"
              checked={situations.situation1}
              onChange={handleSituationChange}
              className={styles.situationCheckbox}
            />
            Customers with Total Spends{" "}
            <select
              name="spendOperator"
              value={filterValues.spendOperator}
              onChange={handleFilterValueChange}
            >
              <option value=">">{`>`}</option>
              <option value="<">{`<`}</option>
              <option value="=">=</option>
            </select>{" "}
            INR{" "}
            <input
              type="number"
              name="spendAmount"
              value={filterValues.spendAmount}
              onChange={handleFilterValueChange}
              className={styles.filterInput}
            />
          </label>

          {situations.situation1 && situations.situation2 && (
            <div className={styles.logicContainer}>
              <label className={styles.logicLabel}>
                <input
                  type="radio"
                  name="logic1"
                  value="AND"
                  checked={logic.logic1 === "AND"}
                  onChange={handleLogicChange}
                  className={styles.logicRadio}
                />
                AND
              </label>
              <label className={styles.logicLabel}>
                <input
                  type="radio"
                  name="logic1"
                  value="OR"
                  checked={logic.logic1 === "OR"}
                  onChange={handleLogicChange}
                  className={styles.logicRadio}
                />
                OR
              </label>
            </div>
          )}

          <label className={styles.situationLabel}>
            <input
              type="checkbox"
              name="situation2"
              checked={situations.situation2}
              onChange={handleSituationChange}
              className={styles.situationCheckbox}
            />
            Customers with{" "}
            <select
              name="visitOperator"
              value={filterValues.visitOperator}
              onChange={handleFilterValueChange}
            >
              <option value="max">max</option>
              <option value="min">min</option>
            </select>{" "}
            number of visits ={" "}
            <input
              type="number"
              name="maxVisits"
              value={filterValues.maxVisits}
              onChange={handleFilterValueChange}
              className={styles.filterInput}
            />
            and spent{" "}
            <select
              name="spendOperator"
              value={filterValues.spendOperator}
              onChange={handleFilterValueChange}
            >
              <option value=">">{`>`}</option>
              <option value="<">{`<`}</option>
              <option value="=">=</option>
            </select>{" "}
            INR{" "}
            <input
              type="number"
              name="spendAmountSecond"
              value={filterValues.spendAmountSecond}
              onChange={handleFilterValueChange}
              className={styles.filterInput}
            />
          </label>

          {((situations.situation2 && situations.situation3) ||
            (situations.situation1 && situations.situation3)) && (
            <div className={styles.logicContainer}>
              <label className={styles.logicLabel}>
                <input
                  type="radio"
                  name="logic2"
                  value="AND"
                  checked={logic.logic2 === "AND"}
                  onChange={handleLogicChange}
                  className={styles.logicRadio}
                />
                AND
              </label>
              <label className={styles.logicLabel}>
                <input
                  type="radio"
                  name="logic2"
                  value="OR"
                  checked={logic.logic2 === "OR"}
                  onChange={handleLogicChange}
                  className={styles.logicRadio}
                />
                OR
              </label>
            </div>
          )}

          <label className={styles.situationLabel}>
            <input
              type="checkbox"
              name="situation3"
              checked={situations.situation3}
              onChange={handleSituationChange}
              className={styles.situationCheckbox}
            />
            Customers Not Visited in Last{" "}
            <input
              type="number"
              name="notVisitedMonths"
              value={filterValues.notVisitedMonths}
              onChange={handleFilterValueChange}
              className={styles.filterInput}
            />{" "}
            Months
          </label>
        </div>

        <button onClick={applyFilter} className={styles.applyBtn}>
          Apply Filters
        </button>
        <button className={styles.applyBtn}>Calculate Frequency</button>
      </div>
    </div>
  );
};

export default CustomerFilterPage;
