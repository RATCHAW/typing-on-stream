function HiddenInput({ icon }: { icon: JSX.Element }) {
  return (
    <div className="flex items-center space-x-2 py-4 px-6 outline -outline-offset-2 outline-border  rounded-lg">
      {icon}
      <p className="text-[8px] py-[4px] ">************************************</p>
    </div>
  );
}

export default HiddenInput;
