interface VerificationCodeProps {
  code: string;
}
function VerificationCode({ code }: VerificationCodeProps) {
  return (
    <div className="flex space-x-[6px]  text-white">
      {code.split('').map((code) => (
        <span className="rounded-lg py-4 px-[14px] outline -outline-offset-2 outline-border text-[12px] ">{code}</span>
      ))}
    </div>
  );
}

export default VerificationCode;
