// Pass the session name and the functions to set the active session and the menu state
const MenuSession = ({ item, setActiveSession, setActiveSessionMenu }) => {
  return (
    // Each session is shown as a list item and when clicked, it sets the session and the menu state to false to close the menu
    <li
      onClick={() => {
        setActiveSession(item);
        setActiveSessionMenu(false);
      }}
      className="p-1.5 py-1 rounded-md hover:bg-zinc-500 duration-200 cursor-pointer text-black font-formula1 text-xs truncate block w-full text-white"
    >
      {item}
    </li>
  );
};
export default MenuSession;
