import Copy from '@/assets/icons/copy.svg?react';
function CopyButton() {
  return (
    <button className="flex justify-center items-center w-fit bg-[#222222] py-3 px-5 space-x-2 text-white text-[8px] rounded-lg">
      <Copy />
      <p>COPY</p>
    </button>
  );
}

export default CopyButton;
