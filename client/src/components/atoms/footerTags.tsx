import ratTyping from '/emotes/ratTyping.gif';
import peepoFigma from '/emotes/peepoFigma.png';

function Ekb() {
  return (
    <div className="flex items-center space-x-2 mx-2">
      <img width={29} height={29} src={peepoFigma} alt="ratchaw" />
      <a href="#" className="text-[#FAC337]">
        EKB9816
      </a>
    </div>
  );
}

function Ratchaw() {
  return (
    <div className="flex items-center space-x-2 mx-2">
      <img width={29} height={29} src={ratTyping} alt="ekb" />
      <a href="#" className="text-[#FAC337]">
        RATCHAW
      </a>
    </div>
  );
}

function FooterTag() {
  return (
    <div className="flex items-center  text-[#767676] text-[8px]">
      Made with love by <Ratchaw /> & <Ekb />
    </div>
  );
}

export default FooterTag;
