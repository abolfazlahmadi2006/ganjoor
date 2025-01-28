import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  HomeIcon,
  ScissorsIcon,
  PlusIcon,
  BanknotesIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SidebarLg() {
  const [open, setOpen] = useState(0);
  const location = useLocation();

  useEffect(() => {
    navigation.forEach((item, index) => {
      if (item.href === location.pathname) {
        setOpen(index + 1);
      }
      if (item.subparts) {
        item.subparts.forEach((subitem) => {
          if (subitem.href === location.pathname) {
            setOpen(index + 1);
          }
        });
      }
    });
  }, [location.pathname]);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-white dark:bg-gray-800">
      <div className="mb-2 flex items-center gap-4 p-4">
        <BanknotesIcon className="h-8" />
        <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
          گنجور
        </h5>
      </div>
      <ul className="space-y-2 font-medium">
        {navigation.map((item, index) =>
          item.subparts ? (
            <Disclosure key={item.name}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={classNames(
                      "flex items-center justify-between w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
                      location.pathname === item.href
                        ? "bg-gray-200 dark:bg-gray-700"
                        : ""
                    )}
                    onClick={() => handleOpen(index + 1)}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 ml-2" aria-hidden="true" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronDownIcon
                      className={`h-5 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="space-y-1 mr-5">
                    {item.subparts.map((subitem) => (
                      <Link
                        to={subitem.href}
                        className={classNames(
                          "flex items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
                          location.pathname === subitem.href
                            ? "bg-gray-200 dark:bg-gray-700"
                            : ""
                        )}
                      >
                        <subitem.icon className="h-5 ml-2" aria-hidden="true" />
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
                <item.icon className="h-5 ml-2" aria-hidden="true" />
                {item.name}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
