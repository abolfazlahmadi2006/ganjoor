import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { numberToPersian } from "../utils/numberToPersian";

const CutList = () => {
  const [cuts, setCuts] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCuts = async (owner = "", page = 1) => {
      try {
        const response = await axios.get(
          `http://192.168.1.8:8000/api/cut-list/?owner__person__name=${owner}&page=${page}`
        );
        setCuts(response.data.results || []);
        setTotalPages(Math.ceil(response.data.count / 10)); // Assuming page size is 10
      } catch (error) {
        console.error("Error fetching cuts:", error);
      }
    };

    const fetchOwners = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.8:8000/api/producer-list/"
        );
        console.log("Owners API response:", response.data); // Debugging log
        setOwners(response.data.results || []);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    fetchCuts(selectedOwner, currentPage);
    fetchOwners();
  }, [selectedOwner, currentPage]);

  const handleOwnerChange = (e) => {
    setSelectedOwner(e.target.value);
    setCurrentPage(1); // Reset to first page when owner changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-3 space-y-3">
      <h2>لیست برش‌ها</h2>
      <div>
        <label
          htmlFor="owner"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Filter by Owner:
        </label>
        <select
          id="owner"
          name="owner"
          value={selectedOwner}
          onChange={handleOwnerChange}
          className="mt-1 block w-full py-2 text-base dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">همه</option>
          {Array.isArray(owners) &&
            owners.map((owner) => (
              <option key={owner.id} value={owner.name}>
                {owner.name}
              </option>
            ))}
        </select>
      </div>
      <div className="flex justify-center">
        <div className="relative w-full overflow-x-auto rounded-lg border dark:border-gray-700 border-gray-300">
          {/* outer box border */}

          <table className="w-full justify-self-center text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="border-b dark:border-gray-700 text-gray-700 uppercase bg-stone-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col"></th>
                <th scope="col">کد</th>
                <th scope="col">تاریخ</th>
                <th scope="col">مدل</th>
                <th scope="col">تولیدکننده</th>
                <th scope="col" className="whitespace-nowrap">
                  تعداد طاقه‌ها
                </th>
                <th scope="col" className="border-l-0"></th>
              </tr>
            </thead>
            <tbody>
              {cuts.map((cut, index) => (
                <tr
                  className={`even:bg-white odd:dark:bg-gray-900 odd:bg-stone-100 even:dark:bg-gray-800 ${
                    index === cuts.length - 1
                      ? ""
                      : "border-b dark:border-gray-700"
                  }`}
                  key={cut.id}
                >
                  <td className="text-center py-2 px-3 w-1 border-l dark:border-gray-700 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {numberToPersian(index + 1)}
                  </td>
                  <td className="text-center whitespace-nowrap">
                    {cut.cut_code}
                  </td>
                  <td className="text-center whitespace-nowrap">
                    {numberToPersian(cut.create_date)}
                  </td>
                  <td className="whitespace-nowrap">{cut.model_name}</td>
                  <td className="text-center whitespace-nowrap">{cut.owner}</td>
                  <td className="text-center w-24 whitespace-nowrap">
                    {numberToPersian(cut.number_of_rolls)}
                  </td>
                  <td className="text-center border-l-0">
                    <Link
                      to={`/cut-detail/${cut.cut_code}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <nav
        class="flex flex-row justify-between items-center space-y-0"
        aria-label="Table navigation"
      >
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
          نمایش
          <span class="px-1 text-gray-900 dark:text-white">
            {numberToPersian(currentPage)}
          </span>
          <span>از</span>
          <span class="px-1 text-gray-900 dark:text-white">
            {numberToPersian(totalPages)}
          </span>
        </span>
        <ul class="inline-flex items-stretch -space-x-px">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-r-lg border-l-0 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span class="sr-only">Previous</span>
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewbox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </li>
          <li>
            <button class="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              {currentPage}
            </button>
          </li>

          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span class="sr-only">Next</span>
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                fill="currentColor"
                viewbox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default CutList;
