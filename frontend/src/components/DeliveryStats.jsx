import React, { useState, useEffect } from "react";

const DeliveryStats = (props) => {
  const [data, setData] = useState([]);
  //   console.log(props);
  const [successful, setSuccessful] = useState(0);
  useEffect(() => {
    const fetchData = () => {
      setData(props.deliveryData);
      //   console.log(data.length, data);
      const successfulDeliveries = data.map((delivery) => {
        delivery.messageStatus === "MESSAGE SENT SUCCESSFULLY";
      });
      setSuccessful(successfulDeliveries.length);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Delivery Stats</h2>
      {data.length > 0 ? (
        <>
          <p>Total Delivery Attempts: {data.length}</p>
          <p>Total Successful Delivery Attempts: {data.length - successful}</p>
          <p>Total Unsuccessful Delivery Attempts: {successful}</p>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};
export default DeliveryStats;
