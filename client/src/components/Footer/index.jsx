import logo from "../../assets/krypt.png";

export const Footer = () => {
  return (
    <div className="w-full flex md:justify-center justify-between items-center p-4 gradient-bg-footer">
      <div className="flex w-full sm:flex-row flex-col justify-between items-center my-4">
        <div className="flex flex-[0.5] justify-center items-center">
          <img src={logo} alt="logo" className="w-32" />
        </div>
      </div>
    </div>
  );
};
