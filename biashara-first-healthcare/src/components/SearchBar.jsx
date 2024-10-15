import React, { useState } from "react";

const Searchbar = ({ hospitals, businesses, onSelectLocation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filteredHospitals = hospitals.features.filter((hospital) =>
      hospital.properties.name.toLowerCase().includes(term)
    );

    const filteredBusinesses = businesses.filter((business) =>
      business.business_name.toLowerCase().includes(term)
    );

    setFilteredResults([...filteredHospitals, ...filteredBusinesses]);
  };

  const handleSelect = (result) => {
    onSelectLocation(result);
    setSearchTerm(""); // Clear search term after selection
    setFilteredResults([]); // Clear filtered results
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search for hospitals or businesses..."
        className="w-full p-2 border border-gray-300 rounded"
      />

      {filteredResults.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto z-10">
          {filteredResults.map((result, index) => (
            <li
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelect(result)}
            >
              {result.properties
                ? result.properties.name 
                : result.business_name}  
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Searchbar;
