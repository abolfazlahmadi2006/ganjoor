import React, { useState } from "react";
import { Disclosure } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3Icon,
  XMarkIcon,
  BanknotesIcon,
  HomeIcon,
  ScissorsIcon,
  ChevronDownIcon,
  PlusIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

// Navigation items
const navigation = [
  { name: "خانه", href: "/", icon: HomeIcon },
  {
    name: "برش",
    icon: ScissorsIcon,
    subparts: [
      { name: "ایجاد برش", href: "/cut-create", icon: PlusIcon },
      { name: "لیست برش‌ها", href: "/cut-list", icon: ListBulletIcon },
    ],
  },
];

// Utility function for conditional class names
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SidebarSm() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Sidebar Toggle Button */}
      <div className="fixed top-0 right-0 z-40 backdrop-blur-lg border border-t-0 border-x-0 border-b-1 border-gray-300 dark:border-gray-700 w-screen h-14 bg-gray-200/50 dark:bg-gray-800/50">
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 right-4 z-50 p-0 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Overlay and Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col py-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Close Button */}
              <div className="absolute top-4 left-4">
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex items-center gap-4 p-4">
                <BanknotesIcon className="h-8 text-gray-600 dark:text-white" />
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                  گنجور
                </h5>
              </div>

              {/* Navigation List */}
              <ul className="px-4 space-y-2 font-medium">
                {navigation.map((item) =>
                  item.subparts ? (
                    <Disclosure key={item.name}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex items-center justify-between w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <item.icon className="h-5 ml-2" />
                            <span className="ml-auto">{item.name}</span>
                            <ChevronDownIcon
                              className={`h-5 transition-transform ${
                                open ? "rotate-180" : ""
                              }`}
                            />
                          </Disclosure.Button>

                          <AnimatePresence>
                            {open && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Disclosure.Panel className="space-y-1 mr-5">
                                  {item.subparts.map((subitem) => (
                                    <Link
                                      key={subitem.name}
                                      to={subitem.href}
                                      className={classNames(
                                        "flex p-2 pl-8 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
                                        location.pathname === subitem.href
                                          ? "bg-gray-200 dark:bg-gray-700"
                                          : ""
                                      )}
                                    >
                                      <subitem.icon className="h-5 ml-2" />
                                      {subitem.name}
                                    </Link>
                                  ))}
                                </Disclosure.Panel>
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                        <item.icon className="h-5 ml-2" />
                        {item.name}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
