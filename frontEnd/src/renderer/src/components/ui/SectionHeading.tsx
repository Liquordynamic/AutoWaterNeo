import React from "react";

function SectionHeading({ title, subTitle }) {
  return (
    <div>
      <h2 className="text-[2.635em] font-black text-center">{title}</h2>
      <p className="text-xl text-center text-gray-500">{subTitle}</p>
    </div>
  );
}

export default SectionHeading;