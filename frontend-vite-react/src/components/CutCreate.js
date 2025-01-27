import React, { useState, useEffect } from "react";
import axios from "axios";

const CutCreateForm = () => {
  const [producers, setProducers] = useState();
  const [cutData, setCutData] = useState({
    cut_code: null,
    create_date: null,
    owner: null,
    sewer: null,
    model_name: null,
    model_code: null,
    lai_per_unit: null,
    product_per_layer: null,
    size: null,
    length_of_layers: null,
    cutting_price: null,
    sewing_price: null,
    cutting_price_raw: null,
    sewing_price_raw: null,
  });

  const [rolls, setRolls] = useState([
    {
      color: null,
      length: null,
      layers: null,
      products: null,
      type_fabric: null,
      description: null,
    },
  ]);

  // Fetch producers when the component mounts
  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/producer-list/"
        ); // Adjust the endpoint to match your API
        setProducers(response.data); // Assuming the data is an array of producers
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching producers:", error);
      }
    };

    fetchProducers();
  }, []);

  // Handle dropdown selection change
  const handleProducerChange = (e) => {
    setCutData({ ...cutData, owner: e.target.value });
  };

  // Handling cut data change
  const handleCutChange = (e) => {
    setCutData({ ...cutData, [e.target.name]: e.target.value });
  };

  // Handling rolls data change
  const handleRollChange = (index, e) => {
    const updatedRolls = [...rolls];
    updatedRolls[index][e.target.name] = e.target.value;
    setRolls(updatedRolls);
  };

  // Adding a new roll
  const addRoll = () => {
    setRolls([
      ...rolls,
      { color: "", length: "", layers: "", products: "", description: "" },
    ]);
  };

  // Removing a roll
  const removeRoll = (index) => {
    const updatedRolls = rolls.filter((_, rollIndex) => rollIndex !== index);
    setRolls(updatedRolls);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...cutData,
      rolls,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cut-create-drf/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ); // Adjust the endpoint accordingly
      console.log("Cut created successfully:", response.data);
      navigate("/cut-list"); // Redirect to the cut list page
    } catch (error) {
      console.error("error creating the cut:", error);
    }
  };

  return (
    <form className="vazirmatn-regular" onSubmit={handleSubmit}>
      <h2>Create a new Cut</h2>
      <label>
        Code:
        <input
          type="text"
          maxLength="4"
          size="4"
          name="cut_code"
          placeholder="code"
          value={cutData.cut_code}
          onChange={handleCutChange}
        />
      </label>

      <label>
        Date:
        <input
          type="date"
          name="create_date"
          maxLength="10"
          size="10"
          value={cutData.create_date}
          onChange={handleCutChange}
        />
      </label>

      {/* Producer Dropdown */}
      <label>
        Producer:
        <select
          name="owner"
          value={cutData.owner}
          onChange={handleProducerChange}
        >
          <option value="">Select Producer</option>
          {producers?.map((producer) => (
            <option key={producer.id} value={producer.person}>
              {producer.name}
            </option>
          ))}
        </select>
      </label>

      {/* Add more Cut fields here */}

      <h3>Rolls</h3>
      <table>
        <tr>
          <th>رنگ</th>
          <th className="text-vertical-rl">طول</th>
          <th className="text-vertical-rl">Layers</th>
          <th className="text-vertical-rl">Products</th>
          <th>Fabric</th>
          <th></th>
        </tr>

        {rolls.map((roll, index) => (
          <tr key={index}>
            <td>
              <input
                type="text"
                name="color"
                maxLength="10"
                size="10"
                value={roll.color}
                onChange={(e) => handleRollChange(index, e)}
              />
            </td>
            <td>
              <input
                type="number"
                name="length"
                min="0"
                max="99"
                value={roll.length}
                onChange={(e) => handleRollChange(index, e)}
              />
            </td>
            <td>
              <input
                type="number"
                name="layers"
                min="0"
                max="99"
                value={roll.layers}
                onChange={(e) => handleRollChange(index, e)}
              />
            </td>
            <td>
              <input
                type="number"
                name="products"
                min="0"
                max="99"
                value={roll.layers * cutData.product_per_layer}
                onChange={(e) => handleRollChange(index, e)}
              />
            </td>
            <td>
              <input
                type="text"
                name="type_fabric"
                value={roll.description}
                maxLength="10"
                size="10"
                onChange={(e) => handleRollChange(index, e)}
              />
            </td>
            <td className="del-cell">
              <svg
                onClick={() => removeRoll(index)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="darkred"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </td>
          </tr>
        ))}
      </table>
      <button type="button" onClick={addRoll}>
        Add
      </button>

      <button type="submit">Create Cut</button>
    </form>
  );
};

export default CutCreateForm;
