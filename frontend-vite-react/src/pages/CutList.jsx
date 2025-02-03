import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, SquarePen, FileText } from "lucide-react";
import {
  EllipsisVerticalIcon,
  EllipsisHorizontalIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { numberToPersian } from "../utils/numberToPersian";

const CutList = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [cuts, setCuts] = useState([]);
  const [selectedCutId, setSelectedCutId] = useState(null);

  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("dest");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCuts = async (owner = "", page = 1, query = "") => {
      try {
        const order =
          sortOrder === "asc"
            ? "create_date_gregorian"
            : "-create_date_gregorian";
        const response = await axios.get(
          `${API_BASE_URL}cut-list/?owner__person__name=${owner}&page=${page}&ordering=${order}&search=${query}`
        );
        setCuts(response.data.results || []);
        setTotalPages(Math.ceil(response.data.count / 10)); // Assuming page size is 10
      } catch (error) {
        console.error("Error fetching cuts:", error);
      }
    };

    const fetchOwners = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}producer-list/`);
        setOwners(response.data.results || []);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    fetchCuts(selectedOwner, currentPage, searchQuery);
    fetchOwners();
  }, [selectedOwner, currentPage, sortOrder, searchQuery]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "dest" : "asc");
  };
  const handleDeleteCut = async () => {
    try {
      // await axios.delete(`${API_BASE_URL}cut-update/${selectedCutId}/`);
      setCuts((prevCuts) =>
        prevCuts.filter((cut) => cut.cut_code !== selectedCutId)
      );
      setSelectedCutId(null); // Reset the selected cut ID
      toast("با موفقیت حذف شد", {
        description: "برش " + selectedCutId + " با موفقیت از سیستم حذف شد",
      });
    } catch (error) {
      console.error("Error deleting cut:", error);
    }
  };
  const handleOwnerChange = (e) => {
    setSelectedOwner(e.target.value);
    setCurrentPage(1); // Reset to first page when owner changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-3 space-y-3">
      <div className="flex h-10">
        <div className="rounded-tr-md rounded-br-md p-2 bg-gray-200 border-[1px] border-l-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-gray-300">
          <MagnifyingGlassIcon className="h-full w-6" />
        </div>
        <input
          type="text"
          placeholder="جستوجو در مدل‌ها و کدبرش‌ها"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className=" rounded-none h-full text-sm"
        />
        <div>
          <select
            id="owner"
            name="owner"
            value={selectedOwner}
            onChange={handleOwnerChange}
            className=" h-full text-center rounded-tr-none border-[1px] border-r-0 rounded-br-none text-base dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">همه تولیدکنندگان</option>
            {Array.isArray(owners) &&
              owners.map((owner) => (
                <option key={owner.id} value={owner.name}>
                  {owner.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <h2>لیست برش‌ها</h2>

      <div className="flex w-full justify-center ">
        <div className="relative w-full overflow-x-auto z-0 overflow-y-hidden rounded-lg border dark:border-gray-700 border-gray-300">
          {/* outer box border */}

          <table className="w-full justify-self-center text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="border-b dark:border-gray-700 text-gray-700 uppercase bg-stone-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col"></th>
                <th scope="col">مدل</th>
                <th scope="col" className="text-center">
                  کد
                </th>
                <th scope="col" className="flex whitespace-nowrap ">
                  <div className="ml-1"> تاریخ</div>
                  <button onClick={toggleSortOrder}>
                    {sortOrder === "asc" ? (
                      <ArrowDownIcon className="h-full" />
                    ) : (
                      <ArrowUpIcon className="h-full" />
                    )}
                  </button>
                </th>
                <th scope="col" className="text-center">
                  تولیدکننده
                </th>
                <th scope="col" className="whitespace-nowrap text-center">
                  تعداد طاقه‌ها
                </th>
                <td></td>
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
                  <td className="whitespace-nowrap">{cut.model_name}</td>
                  <td className="text-center whitespace-nowrap">
                    {cut.cut_code}
                  </td>
                  <td className="whitespace-nowrap">
                    {numberToPersian(cut.create_date)}
                  </td>
                  <td className="text-center whitespace-nowrap">
                    {cut.owner_name}
                  </td>
                  <td className="text-center w-24 whitespace-nowrap">
                    {numberToPersian(cut.number_of_rolls)}
                  </td>
                  <td>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisHorizontalIcon className="h-6" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem className="flex flex-row-reverse">
                            <FileText />
                            <span
                              onClick={() =>
                                navigate(`/cut-detail/${cut.cut_code}`)
                              }
                            >
                              مشاهده
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex flex-row-reverse">
                            <SquarePen />
                            <span
                              onClick={() =>
                                navigate(`/cut-update/${cut.cut_code}`)
                              }
                            >
                              ویرایش
                            </span>{" "}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex flex-row-reverse ">
                            <Trash2 className="text-red-500" />
                            <DialogTrigger asChild>
                              <span
                                className="text-red-500"
                                onClick={() => setSelectedCutId(cut.cut_code)}
                              >
                                حذف
                              </span>
                            </DialogTrigger>{" "}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-right pr-4">
                            آیا واقعا مطمئن هستید؟
                          </DialogTitle>
                          <DialogDescription className="text-right pr-4">
                            این اقدام قابل بازگشت نیست. آیا مطمئن هستید که
                            می‌خواهید این برش را به‌طور دائمی از سیستم حذف کنید؟
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button type="button" onClick={handleDeleteCut}>
                            تأیید
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
