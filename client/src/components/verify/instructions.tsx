import { toast } from 'react-toastify';

interface InstructionsProps {
  sessionId: string;
  changeSessionId: () => void;
}

function Instructions({ sessionId, changeSessionId }: InstructionsProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionId);
    toast('Link copied!');
  };
  const handleChnageSessionId = () => {
    changeSessionId();
    navigator.clipboard.writeText(sessionId);
    toast('Link changed and copied!');
  };
  return (
    <div className=" flex flex-col space-y-6 items-center transition-all">
      <p className="text-white text-center text-xl">
        Click on the URL provided in the window to access the game. <br /> Please avoid sharing this link, as it can't
        be opened by two persons simultaneously. <br /> You can change the link any time by clicking on{' '}
        <strong>Change Link</strong>
      </p>

      <input
        type="text"
        value={sessionId}
        className="w-full px-4 py-2 border border-gray-300 rounded-l blur-sm"
        readOnly
      />

      <div className="relative">
        <div className="flex space-x-3">
          <button onClick={handleCopyLink} className=" w-48 bg-purple-700 text-white px-4 py-2 rounded">
            Copy
          </button>
          <button onClick={handleChnageSessionId} className=" w-48 bg-purple-700 text-white px-4 py-2 rounded">
            Change link
          </button>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
