// Pass the year and the functions to set the functions to set the active year and the menu state
const MenuYear = ({ item, setActiveYear, setActiveYearMenu }) => {
  return (
    // Each year is shown as a list item and when clicked, it sets the year and the menu state to false to close the menu
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
