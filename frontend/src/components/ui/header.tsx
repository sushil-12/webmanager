interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div className="border-b border-gray-200 bg-white  py-2 ">
      <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>
    </div>
  );
};

export default Header;
