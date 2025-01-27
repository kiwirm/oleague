"use client";
import { orienteer } from "@prisma/client";

import Link from "next/link";

import React, { useEffect, useState } from "react";

const OrienteerSearch = ({ orienteers }: { orienteers: orienteer[] }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredOrienteers, setFilteredOrienteers] = useState(orienteers);

  useEffect(() => {
    const results = orienteers
      .filter((orienteer) =>
        (orienteer.first_name + " " + orienteer.last_name)
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      )
      .splice(0, 10);
    setFilteredOrienteers(results);
  }, [searchInput, orienteers]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
    <>
      <div
        className={`bg-muted p-4 w-full flex flex-row items-center gap-2 ${
          searchInput.length > 3 && filteredOrienteers.length > 0
            ? "rounded-t-lg"
            : "rounded-lg"
        }`}
      >
        <span className="material-symbols-rounded">search</span>
        <input
          type="text"
          placeholder="Search for orienteers..."
          className="bg-inherit w-full h-full outline-none rounded"
          value={searchInput}
          onChange={handleSearchChange}
          style={{ userSelect: "none" }}
        />
      </div>
      <div>
        {searchInput.length > 3 && (
          <ul>
            {filteredOrienteers.length > 0 ? (
              filteredOrienteers.map((orienteer, index) => (
                <Link href={`/orienteers/${orienteer.onz_id}`}>
                  <li
                    key={orienteer.onz_id}
                    className={`p-4 bg-muted hover:bg-gray-200 text-foreground ${
                      index === filteredOrienteers.length - 1 && "rounded-b-lg"
                    }`}
                  >
                    {orienteer.first_name} {orienteer.last_name}
                  </li>
                </Link>
              ))
            ) : (
              <li className="p-4 text-destructive-foreground">
                No results found
              </li>
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default OrienteerSearch;
