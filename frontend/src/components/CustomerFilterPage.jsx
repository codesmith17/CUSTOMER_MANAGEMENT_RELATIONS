import React, { useState } from "react";
import styles from "./CustomerFilterPage.module.css";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomerTable from "./CustomerTable";

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
  const [slicedArrayLength, setSlicedArrayLength] = useState(10);
  const [filterValues, setFilterValues] = useState({
    spendOperator1: ">",
    spendAmount1: 10000,
    spendOperator2: ">",
    spendAmount2: 10000,
    visitOperator: "max",
    maxVisits: 3,
    notVisitedMonths: 3,
  });
  const [audienceCount, setAudienceCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDone, setFilterDone] = useState(false);
  const [tempTableData, setTempTableData] = useState(null);
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
  const incrementSliceSize = () => {
    if (slicedArrayLength + 10 < tempTableData.length) {
      setSlicedArrayLength(slicedArrayLength + 10);
    } else {
      setSlicedArrayLength(tempTableData.length);
    }
  };
  const getSituationText = (situation) => {
    const {
      spendOperator1,
      spendAmount1,
      spendOperator2,
      spendAmount2,
      visitOperator,
      maxVisits,
      notVisitedMonths,
    } = filterValues;
    switch (situation) {
      case "situation1":
        return `have spent ${spendOperator1} INR ${spendAmount1}`;
      case "situation2":
        return `have ${visitOperator} number of visits = ${maxVisits} and spent ${spendOperator2} INR ${spendAmount2}`;
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
    const situationTexts = selectedSituations.map(getSituationText);

    for (let i = 0; i < situationTexts.length - 1; i++) {
      const logicNumber = Math.floor(
        (Number(selectedSituations[i].at(-1)) +
          Number(selectedSituations[i + 1].at(-1))) /
          2
      );
      message += `${situationTexts[i]} ${logic[`logic${logicNumber}`]} `;
    }
    message += situationTexts.at(-1);
    toast.info(message);

    setIsLoading(true);
    setAudienceCount(0);
    fetch("http://localhost:3000/api/campaign/campaign-filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ situations, logic, filterValues }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response);
        if (response.status === 204) {
          toast.info("NO AUDIENCE FOUND");
          return;
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.data);
        setTempTableData(data.data);
        setFilterDone(true);
        return;
      })
      .catch((err) => {
        console.error("Error applying filter:", err);
        toast.error("Error applying filter. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const calculateFrequency = () => {
    setIsLoading(true);
    fetch("http://localhost:3000/api/campaign/campaign-filter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ situations, logic, filterValues }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAudienceCount(data.count);
        toast.success(`Audience count = ${data.count}`);
        setIsLoading(false);
        return;
      })
      .catch((error) => {
        console.error("Error calculating audiences' frequency:", error);
        toast.error(
          "Error calculating audiences' frequency. Please try again."
        );
        setIsLoading(false);
        return;
      });
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
              name="spendOperator1"
              value={filterValues.spendOperator1}
              onChange={handleFilterValueChange}
            >
              <option value=">">{`>`}</option>
              <option value="<">{`<`}</option>
              <option value="=">=</option>
            </select>{" "}
            INR{" "}
            <input
              type="number"
              name="spendAmount1"
              value={filterValues.spendAmount1}
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
              name="spendOperator2"
              value={filterValues.spendOperator2}
              onChange={handleFilterValueChange}
            >
              <option value=">">{`>`}</option>
              <option value="<">{`<`}</option>
              <option value="=">=</option>
            </select>{" "}
            INR{" "}
            <input
              type="number"
              name="spendAmount2"
              value={filterValues.spendAmount2}
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

        <button
          onClick={applyFilter}
          className={styles.applyBtn}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Apply Filters"}
        </button>
        <button
          onClick={calculateFrequency}
          className={styles.applyBtn}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Calculate Frequency"}
        </button>
        {filterDone && (
          <>
            <CustomerTable
              data={
                tempTableData.length <= 10
                  ? tempTableData
                  : tempTableData.slice(0, slicedArrayLength)
              }
            />
            {tempTableData.length > 10 &&
              tempTableData.length - slicedArrayLength > 0 && (
                <div>
                  <p className={styles.showMeMore} onClick={incrementSliceSize}>
                    ... and {tempTableData.length - slicedArrayLength} more
                    rows.
                  </p>
                </div>
              )}
            <button className={styles.applyBtn} disabled={isLoading}>
              {`SAVE TABLE OF SIZE ${tempTableData.length} TO COMM. LOGS`}
            </button>
          </>
        )}
        {audienceCount !== 0 && (
          <div className={styles.resultContainer}>
            <h3 className={styles.resultTitle}>AUDIENCE SIZE</h3>
            <p className={styles.resultText}>{audienceCount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerFilterPage;
