import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  Disclosure,
} from "@headlessui/react";
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

export default function SidebarSm() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="w-6 h-6" aria-hidden="true" />
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-xs transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <TransitionChild>
                  <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="size-6" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-800 py-6 shadow-xl">
                  <div className="mb-2 flex items-center gap-4 p-4">
                    <BanknotesIcon className="h-8" />
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                      گنجور
                    </h5>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <ul className="space-y-2 font-medium">
                      {navigation.map((item) =>
                        item.subparts ? (
                          <Disclosure key={item.name}>
                            {({ open }) => (
                              <>
                                <Disclosure.Button className="flex items-center justify-between w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                  <item.icon
                                    className="h-5 ml-2"
                                    aria-hidden="true"
                                  />

                                  <span className="ml-auto">{item.name}</span>
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
                                      key={subitem.name}
                                      to={subitem.href}
                                      className={classNames(
                                        "flex p-1 pl-8 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
                                        location.pathname === subitem.href
                                          ? "bg-gray-200 dark:bg-gray-700"
                                          : ""
                                      )}
                                    >
                                      <subitem.icon
                                        className="h-5 ml-2"
                                        aria-hidden="true"
                                      />

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
                              <item.icon
                                className="h-5 ml-2"
                                aria-hidden="true"
                              />

                              {item.name}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
