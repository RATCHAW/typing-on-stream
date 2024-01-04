import letsgo from '/emotes/letsgo.gif';

function WaitingMenu() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 uppercase text-white text-xl line leading-8">
      <img className="w-[58px] h-[58px]" src={letsgo} alt="" />
      <p className="text-center">
        type <span className="text-[#FAC337]">!play</span> in chat to start <br /> the game
      </p>
    </div>
  );
}

export default WaitingMenu;
