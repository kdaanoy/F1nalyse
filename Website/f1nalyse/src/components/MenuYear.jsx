const MenuYear = ({ item, setActiveYear, setActiveYearMenu }) => {
  return (
    <li
      onClick={() => {
        setActiveYear(item);
        setActiveYearMenu(false);
      }}
      className="p-1.5 py-1 rounded-md hover:bg-zinc-500 duration-200 cursor-pointer text-black font-formula1 text-sm text-white"
    >
      {item}
    </li>
  );
};
export default MenuYear;