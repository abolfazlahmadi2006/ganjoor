import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { numberToPersian, moneyFormat } from "../utils/numberToPersian";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useUser } from "./UserContext";

const CutDetail = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { cutId } = useParams();
  const [cut, setCut] = useState(null);
  const { user } = useUser();
  useEffect(() => {
    const fetchCutDetail = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}cut-detail/${cutId}/`);
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
  // Calculate the total number of products
  const totalProducts = cut.rolls.reduce(
    (acc, roll) => acc + (Number(roll.layers * cut.product_per_layer) || 0),
    0
  );

  const totalLayers = cut.rolls.reduce(
    (acc, roll) => acc + (Number(roll.layers) || 0),
    0
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-center">
        <div className="relative w-full overflow-x-auto rounded-lg border dark:border-gray-700 border-gray-300">
          <div>
            <table className="w-full whitespace-nowrap justify-self-center text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <tr className="border bg-white dark:bg-gray-900 border-x-0 border-t-0 dark:border-gray-700 border-gray-300">
                <td className="border  border-y-0 border-r-0 border-l-1 dark:border-gray-700 border-gray-300">
                  <div className="flex">
                    <div>نام تولیدی:</div>
                    <div>{cut.owner}</div>
                  </div>
                </td>
                <td className="border border-y-0 border-r-0 border-l-1 dark:border-gray-700 border-gray-300">
                  <div className="flex">
                    <div>تعداد طاقه‌ها:</div>
                    <div>{cut.number_of_rolls}</div>
                  </div>
                </td>
                <td className="border border-y-0 border-r-0 border-l-1 dark:border-gray-700 border-gray-300">
                  <div className="flex">
                    <div>مصرف هر کار:</div>
                    <div>{cut.length_of_layers / cut.product_per_layer}</div>
                  </div>
                </td>
                <td>
                  <div className="flex">
                    <div>کد برش:</div>
                    <div>{cut.cut_code}</div>
                  </div>
                </td>
              </tr>
              <tr className="border bg-stone-100 dark:bg-gray-800 border-x-0 border-t-0 dark:border-gray-700 border-gray-300">
                <td className="border  border-y-0 border-r-0 border-l-1 dark:border-gray-700 border-gray-300">
                  <div className="flex">
                    <div>سایزبندی:</div>
                    <div>{cut.size}</div>
                  </div>
                </td>
                <td className="border  border-y-0 border-r-0 border-l-1 dark:border-gray-700 border-gray-300">
                  <div className="flex">
                    <div>تعداد طاقه خرج‌کار:</div>
                    <div></div>
                  </div>
                </td>
                <td className="border  border-y-0 border-r-0 border-l-1 dark:border-gray-700 border-gray-300">
                  <div className="flex">
                    <div>مصرف لایی هر کار:</div>
                    <div>{cut.lai_per_unit}</div>
                  </div>
                </td>
                <td>
                  <div className="flex">
                    <div>تاریخ:</div>
                    <div>{numberToPersian(cut.create_date)}</div>
                  </div>
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-900">
                <td className="border  border-y-0 border-r-0 border-l-1 dark:border-gray-700 border-gray-300">
                  <div className="flex">
                    <div>نام مدل:</div>
                    <div>{cut.model_name}</div>
                  </div>
                </td>
                <td className="border  border-y-0 border-r-0 border-l-1 dark:border-gray-700 border-gray-300">
                  <div className="flex">
                    <div>نوع پارچه:</div>
                    <div></div>
                  </div>
                </td>
                <td className="border  border-y-0 border-r-0 border-l-1 dark:border-gray-700 border-gray-300">
                  <div className="flex">
                    <div>طول خط‌کشی:</div>
                    <div>{cut.length_of_layers}</div>
                  </div>
                </td>
                <td>
                  <div className="flex">
                    <div>کد مدل:</div>
                    <div>{cut.model_code}</div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative w-full overflow-x-auto rounded-lg border dark:border-gray-700 border-gray-300">
          <table className="w-full justify-self-center text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="border-b dark:border-gray-700 text-gray-700 uppercase bg-stone-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-0"></th>
                <th scope="col" className="text-center">
                  رنگ
                </th>
                <th scope="col" className="text-center">
                  طول
                </th>
                <th scope="col" className="text-center">
                  لاها
                </th>
                <th scope="col" className="text-center">
                  تعداد
                </th>
                <th scope="col" className="text-center">
                  نوع پارچه
                </th>
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
                  <td className="text-center w-1 border-l dark:border-gray-700 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {numberToPersian(index + 1)}
                  </td>
                  <td className="whitespace-nowrap">{roll.color}</td>
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
              <tr
                className="text-gray-900 whitespace-nowrap dark:text-white border-t-2 even:bg-white odd:dark:bg-gray-900 odd:bg-stone-100 even:dark:bg-gray-800 "
                key="total"
              >
                <th></th>
                <td>
                  <p>تعداد کل</p>
                </td>
                <td></td>
                <td className="text-center">{totalLayers}</td>
                <td className="text-center">{totalProducts}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* show if superuser is login */}
      {user?.is_superuser && (
        <div className="flex justify-center">
          <div className="relative w-full overflow-x-auto rounded-lg border dark:border-gray-700 border-gray-300">
            <table className="w-full justify-self-center text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <tbody>
                <tr>
                  <td className="text-center whitespace-nowrap">
                    total_margin
                  </td>
                  <td className="text-center whitespace-nowrap">
                    {moneyFormat(cut.total_margin)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex border border-gray-300 dark:border-gray-700 rounded-md p-2 w-fit">
        <PencilSquareIcon className="h-6" />
        <button
          onClick={() => window.open(`/cut-update/${cut.cut_code}`, "_blank")}
          className="mx-2"
        >
          ویرایش اطلاعات
        </button>
      </div>
    </div>
  );
};

export default CutDetail;
