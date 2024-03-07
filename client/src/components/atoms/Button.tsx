interface ButtonProps {
  icon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}

function Button({ icon, onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex justify-center items-center bg-[#222222] hover:bg-[#3F3F3F]  py-4 px-5 space-x-2 text-white text-[8px] rounded-lg uppercase"
    >
      {icon}
      <p>{children}</p>
    </button>
  );
}

export default Button;
