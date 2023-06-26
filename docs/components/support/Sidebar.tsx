import React, { useState } from "react";
import ComponentData from "../../../data/sidemenu_data.json";
import ChevronRight from "./ChevronRight";
import ChevronDown from "./ChevronDown";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

type MyObject = {
  [key: string]: string[]; // Add an index signature for string keys
};

interface SideBarSectionProps {
  arr: string[];
  heading: string;
}

const SideBarSection: React.FC<SideBarSectionProps> = ({ arr, heading }) => {
  const [open, setOpen] = useState(heading === "Components" ? true : false);
  const router = useRouter();
  return (
    <div className="mb-3">
      <div
        className={
          "flex justify-between items-center cursor-pointer bg-[#f4f0f8] h-12 rounded px-4 transition-all mb-3"
        }
        onClick={() => setOpen(!open)}
      >
        <h1 className="w-fit">{heading}</h1>

        {open ? <ChevronDown /> : <ChevronRight />}
      </div>
      <AnimatePresence>
        {open &&
          arr.map((val, index) => (
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ delay: index * 0.1 }}
              key={"ele" + index}
              className="cursor-pointer hover:bg-[#5501BF36] mb-2"
            >
              <h2
                className="ml-6 w-fit "
                onClick={() => {
                  const route = val.split(" ").join("-").toLowerCase();
                  console.log("route>>>");
                  heading === "Components" &&
                    router.push("/reusejs-react/" + route);
                }}
              >
                {val}
              </h2>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default function Sidebar() {
  const data: MyObject = ComponentData;

  return (
    <>
      {Object.keys(data).map((sectionKey: string, index) => {
        return (
          <SideBarSection
            key={index + "heading"}
            arr={data[sectionKey]}
            heading={sectionKey}
          />
        );
      })}
    </>
  );
}
