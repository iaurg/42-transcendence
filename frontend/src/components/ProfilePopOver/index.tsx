import { Popover } from "@headlessui/react";
import Link from "next/link";
import { useState } from "react";
import { usePopper } from "react-popper";

type ProfilePopOverProps = {
  id: string;
  name: string;
  children: React.ReactNode;
  score: number;
};

export default function ProfilePopOver({
  id,
  name,
  children,
  score,
}: ProfilePopOverProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }],
    placement: "right",
  });

  return (
    <Popover className="relative">
      <Popover.Button ref={setReferenceElement} className="outline-none">
        {children}
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        className="bg-black42-300 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10 ml-4 w-[300px]"
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="p-3">
          <div className="flex items-center space-x-4 mb-4">
            <button
              type="button"
              className="text-white bg-purple42-200 hover:bg-purple42-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 focus:outline-none "
            >
              Add amigo
            </button>
            <button
              type="button"
              className="text-white bg-purple42-200 hover:bg-purple42-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 focus:outline-none "
            >
              Jogar
            </button>
            <Link href={`/game/history/${id}`} passHref>
              <button
                type="button"
                className="text-white bg-purple42-200 hover:bg-purple42-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 focus:outline-none "
              >
                Histórico
              </button>
            </Link>
          </div>
          <p className="text-base font-semibold leading-none text-white">
            <a href="#">{name}</a>
          </p>
          <p className="mb-3 text-sm font-normal text-white">
            <a href="#" className="hover:underline">
              @{name}
            </a>
          </p>
          <p className="mb-4 text-sm text-white">
            Open-source contributor. Building{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-500 hover:underline"
            >
              {name}@42org.br
            </a>
          </p>
          <ul className="flex text-sm">
            <li className="mr-2">
              <a href="#" className=" text-white">
                <span className="font-semibold mr-2">{score}</span>
                <span>Vitórias</span>
              </a>
            </li>
          </ul>
        </div>
        <div
          ref={setArrowElement}
          className="w-1 h-1 border-t-[10px] border-t-transparent border-r-[14px] border-r-black42-300 border-b-[10px] border-b-transparent ml-[-12px]"
          style={styles.arrow}
        />
      </Popover.Panel>
    </Popover>
  );
}
