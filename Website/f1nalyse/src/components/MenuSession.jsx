const MenuSession = ({ item, setActiveSession, setActiveSessionMenu }) => {
  return (
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