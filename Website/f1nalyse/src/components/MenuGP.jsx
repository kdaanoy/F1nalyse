// Pass the GP name and the functions to set the active GP and the menu state
const MenuGP = ({ item, setActiveGP, setActiveGPMenu }) => {
  return (
    // Each GP is shown as a list item and when clicked, it sets the GP and the menu state to false to close the menu
    <li
      onClick={() => {
        setActiveGP(item);
        setActiveGPMenu(false);
      }}
      className="p-1.5 py-1 rounded-md hover:bg-gray-500 duration-200 cursor-pointer text-black font-formula1 text-xs truncate block w-full text-white"
    >
      {item}
    </li>
  );
};
export default MenuGP;

