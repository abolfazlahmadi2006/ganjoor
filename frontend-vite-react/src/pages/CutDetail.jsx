import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { numberToPersian } from "../utils/numberToPersian";

const CutDetail = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { cutId } = useParams();
  const [cut, setCut] = useState(null);

  useEffect(() => {
    const fetchCutDetail = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}cut-detail/${cutId}/`
        );
        setCut(response.data);
      } catch (error) {
        console.error("Error fetching cut detail:", error);
      }
    };

    fetchCutDetail();
  }, [cutId]);

  if (!cut) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>جزئیات برش</h2>
      <div className="flex justify-center md:p-0">
        <div className="relative md:w-5/6 w-full overflow-x-auto rounded-lg border dark:border-gray-700 border-gray-300">
          <div className="p-4">
            <h3>کد برش: {cut.cut_code}</h3>
            <p>تاریخ: {numberToPersian(cut.create_date)}</p>
            <p>مدل: {cut.model_name}</p>
            <p>تولیدکننده: {cut.owner}</p>
            <p>تعداد طاقه‌ها: {numberToPersian(cut.number_of_rolls)}</p>
            <h4>لیست طاقه‌ها</h4>
            <table className="w-full justify-self-center text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="border-b dark:border-gray-700 text-gray-700 uppercase bg-stone-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-0"></th>
                  <th scope="col">رنگ</th>
                  <th scope="col">طول</th>
                  <th scope="col">لایه‌ها</th>
                  <th scope="col">محصولات</th>
                  <th scope="col">نوع پارچه</th>
                </tr>
              </thead>
              <tbody>
                {cut.rolls.map((roll, index) => (
                  <tr
                    className={`even:bg-white odd:dark:bg-gray-900 odd:bg-stone-100 even:dark:bg-gray-800 ${
                      index === cut.rolls.length - 1
                        ? ""
                        : "border-b dark:border-gray-700"
                    }`}
                    key={index}
                  >
                    <td className="text-center py-2 w-1 border-l dark:border-gray-700 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {numberToPersian(index + 1)}
                    </td>
                    <td className="text-center whitespace-nowrap">
                      {roll.color}
                    </td>
                    <td className="text-center whitespace-nowrap">
                      {numberToPersian(roll.length)}
                    </td>
                    <td className="text-center whitespace-nowrap">
                      {numberToPersian(roll.layers)}
                    </td>
                    <td className="text-center whitespace-nowrap">
                      {numberToPersian(roll.products)}
                    </td>
                    <td className="text-center whitespace-nowrap">
                      {roll.type_fabric}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link
              to="/cut-list"
              className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              بازگشت به لیست برش‌ها
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CutDetail;
