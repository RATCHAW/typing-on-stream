import Copy from '@/assets/icons/copy.svg?react';
function CopyButton() {
  return (
    <button className="flex justify-center items-center bg-[#222222]  py-4 px-5 space-x-2 text-white text-[8px] rounded-lg uppercase">
      <Copy className="w-5 h-5" />
      <p>COPY</p>
    </button>
  );
}

export default CopyButton;
