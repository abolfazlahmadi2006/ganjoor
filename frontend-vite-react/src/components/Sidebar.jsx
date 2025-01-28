import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ScissorsIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "خانه", href: "/", icon: HomeIcon },
  {
    name: "برش",
    icon: ScissorsIcon,
    subparts: [
      { name: "ایجاد برش", href: "/cut-create" },
      { name: "لیست برش‌ها", href: "/cut-list" },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="w-6 h-6" aria-hidden="true" />
      </button>

      <aside
        id="sidebar-multi-level-sidebar"
        className={`fixed top-0 right-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <button
            onClick={() => setSidebarOpen(false)}
            aria-controls="sidebar-multi-level-sidebar"
            type="button"
            className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
          </button>
          <ul className="space-y-2 font-medium">
            {navigation.map((item) =>
              item.subparts ? (
                <Disclosure key={item.name}>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex items-center justify-between w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <div className="flex items-center">
                          <item.icon
                            className="w-5 h-5 ml-2"
                            aria-hidden="true"
                          />
                          <span>{item.name}</span>
                        </div>
                        <svg
                          className={`w-5 h-5 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Disclosure.Button>
                      <Disclosure.Panel className="space-y-1">
                        {item.subparts.map((subitem) => (
                          <Link
                            key={subitem.name}
                            to={subitem.href}
                            className={classNames(
                              "block p-2 pl-8 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
                              location.pathname === subitem.href
                                ? "bg-gray-200 dark:bg-gray-700"
                                : ""
                            )}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ) : (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={classNames(
                      "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
                      location.pathname === item.href
                        ? "bg-gray-200 dark:bg-gray-700"
                        : ""
                    )}
                  >
                    <item.icon className="w-5 h-5 ml-2" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </aside>
    </>
  );
}
