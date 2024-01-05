import ratTyping from '/emotes/ratTyping.gif';
import peepoFigma from '/emotes/peepoFigma.png';

function FooterTag() {
  return (
    <p className="flex items-center  text-[#767676] text-[8px]">
      made with love by <img className="w-[29px] h-[29px] mx-2" src={ratTyping} alt="" />
      <span className="text-[#FAC337]">ratchaw&nbsp; </span>&
      <img className="w-[29px] h-[29px] mx-2" src={peepoFigma} alt="" />
      <span className="text-[#FAC337]">ekb9816</span>
    </p>
  );
}

export default FooterTag;
