import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const CutCreate = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [producers, setProducers] = useState([]);
  const [cutData, setCutData] = useState({
    cut_code: "",
    create_date: "",
    owner: "",
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
      color: "",
      length: "",
      layers: "",
      products: "",
      type_fabric: "",
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducers = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}producer-list/`
        );
        setProducers(response.data.results || []);
      } catch (error) {
        console.error("Error fetching producers:", error);
      }
    };

    fetchProducers();
  }, []);

  const handleProducerChange = (e) => {
    setCutData({ ...cutData, owner: e.target.value });
  };

  const handleCutChange = (e) => {
    setCutData({ ...cutData, [e.target.name]: e.target.value });
  };

  const handleRollChange = (index, e) => {
    const updatedRolls = [...rolls];
    updatedRolls[index][e.target.name] = e.target.value;
    setRolls(updatedRolls);
  };

  const addRoll = () => {
    setRolls([
      ...rolls,
      { color: "", length: "", layers: "", products: "", type_fabric: "" },
    ]);
  };

  const removeRoll = (index) => {
    const updatedRolls = rolls.filter((_, rollIndex) => rollIndex !== index);
    setRolls(updatedRolls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Cut Data:", cutData);
    console.log("Rolls:", rolls);

    // Validate and format the data
    const formattedRolls = rolls.map((roll) => ({
      ...roll,
      products: parseInt(roll.products, 10),
      length: parseFloat(roll.length),
      layers: parseInt(roll.layers, 10),
    }));

    const dataToSend = {
      ...cutData,
      rolls: formattedRolls,
    };

    console.log("Data to Send:", dataToSend);

    try {
      const response = await axios.post(
        `${API_BASE_URL}cut-create-drf/`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      console.log("dataToSend:", dataToSend);
      navigate("/cut-list"); // Redirect to the cut list page
    } catch (error) {
      console.error("Error sending data:", error.response);
    }
  };

  // Calculate the total number of products
  const totalProducts = rolls.reduce(
    (acc, roll) => acc + (Number(roll.layers * cutData.product_per_layer) || 0),
    0
  );

  const totalLayers = rolls.reduce(
    (acc, roll) => acc + (Number(roll.layers) || 0),
    0
  );

  return (
    <form className="vazirmatn-regular w-full px-2" onSubmit={handleSubmit}>
      <h2 className="text-center mt-3 mb-5 text-xl font-bold">
        ایجاد اطلاعات برش
      </h2>
      {/* Input fields for Cut Data */}
      <div className="flex justify-center">
        <div className="md:w-5/6 sm:w-full grid gap-2 grid-cols-3">
          <input
            type="text"
            maxLength="4"
            size="4"
            name="cut_code"
            placeholder="کد برش"
            value={cutData.cut_code}
            onChange={handleCutChange}
          />
          <input
            type="text"
            name="create_date"
            maxLength="10"
            size="10"
            placeholder="تاریخ"
            value={cutData.create_date}
            onChange={handleCutChange}
          />

          <select
            name="owner"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={cutData.owner}
            onChange={handleProducerChange}
          >
            <option value="">انتخاب تولیدکننده</option>
            {producers?.map((producer) => (
              <option key={producer.id} value={producer.person}>
                {producer.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="model_name"
            placeholder="نام مدل"
            value={cutData.model_name}
            onChange={handleCutChange}
          />

          <input
            type="text"
            name="model_code"
            placeholder="کد مدل"
            value={cutData.model_code}
            onChange={handleCutChange}
          />

          <input
            type="text"
            name="lai_per_unit"
            placeholder="مصرف لایی"
            value={cutData.lai_per_unit}
            onChange={handleCutChange}
          />

          <input
            type="text"
            name="product_per_layer"
            placeholder="تعداد کار هر لا"
            value={cutData.product_per_layer}
            onChange={handleCutChange}
          />

          <input
            type="text"
            name="size"
            placeholder="سایزبندی"
            value={cutData.size}
            onChange={handleCutChange}
          />

          <input
            type="text"
            name="length_of_layers"
            placeholder="طول خط‌کشی"
            value={cutData.length_of_layers}
            onChange={handleCutChange}
          />
        </div>
      </div>
      {/* cutting_price */}
      {/* sewing_price */}
      {/* cutting_price_raw */}
      {/* sewing_price_raw */}

      <h3 className="text-center mt-3 mb-5 text-lg font-bold">
        افزودن اطلاعات طاقه‌ها
      </h3>

      <button type="button" className="btb-blue" onClick={addRoll}>
        طاقه جدید
      </button>
      <div className="flex justify-center md:p-0">
        <div className="relative md:w-5/6 w-full overflow-x-auto rounded-lg border dark:border-gray-700 border-gray-300">
          <table className="w-full justify-self-center text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="border-b dark:border-gray-700 text-gray-700 uppercase bg-stone-100  dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-0"></th>
                <th scope="col">رنگ</th>
                <th scope="col">
                  <div className="yoyo">طول</div>
                </th>
                <th scope="col">
                  <div className="yoyo">لاها</div>
                </th>
                <th scope="col">
                  <div className="yoyo">تعداد</div>
                </th>
                <th scope="col">پارچه</th>
                <th></th>
              </tr>
            </thead>

            {rolls.map((roll, index) => (
              <tr
                className="even:bg-white odd:dark:bg-gray-900 odd:bg-stone-100 even:dark:bg-gray-800 border-b dark:border-gray-700"
                key={index}
              >
                <th className="text-center py-3 w-1 border-l dark:border-gray-700 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {index + 1}
                </th>
                <td>
                  <input
                    type="text"
                    name="color"
                    maxLength="15"
                    size="7"
                    value={roll.color}
                    onChange={(e) => handleRollChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="length"
                    min="0"
                    max="999"
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
                    value={
                      roll.products || roll.layers * cutData.product_per_layer
                    }
                    onChange={(e) => handleRollChange(index, e)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="type_fabric"
                    value={roll.type_fabric}
                    maxLength="10"
                    size="10"
                    onChange={(e) => handleRollChange(index, e)}
                  />
                </td>
                <td className="w-10 border-0">
                  <Menu as="div" className="relative">
                    <MenuItems className="absolute left-0 top-0 z-10 ml-10 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-600 border dark:border-gray-500 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                      <div className="py-1">
                        <MenuItem>
                          <button
                            onClick={() => removeRoll(index)}
                            className="block w-full px-4 py-1 text-left text-sm text-red-500"
                          >
                            Delete
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                    <MenuButton>
                      <EllipsisHorizontalCircleIcon className="w-7 text-gray-400" />
                    </MenuButton>
                  </Menu>
                </td>
              </tr>
            ))}

            <tr
              className="even:bg-white odd:dark:bg-gray-900 odd:bg-stone-100 even:dark:bg-gray-800 "
              key="total"
            >
              <th className="text-center py-3 w-1 border-l dark:border-gray-700 font-medium text-gray-900 whitespace-nowrap dark:text-white"></th>
              <td>
                <p className="py-1.5">تعداد کل</p>
              </td>
              <td></td>
              <td className="text-center">{totalLayers}</td>
              <td className="text-center">{totalProducts}</td>
              <td></td>
              <td className="w-10 border-0"></td>
            </tr>
          </table>
        </div>
      </div>

      <button className="btb-green mt-2" type="submit">
        ذخیره
      </button>
    </form>
  );
};

export default CutCreate;
