import React from "react";

type HeaderProps = {
  name: string;
  buttonComponent?: any;
  isSmallText?: boolean;
};

const Header = ({
  name,
  buttonComponent,
  isSmallText = false,
}: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-5 w-full">
      <h1
        className={`${
          isSmallText ? "text-lg" : "text-2xl"
        } font-semibold dark:text-white`}
      >
        {name}
      </h1>
      {buttonComponent}
    </div>
  );
};

export default Header;
