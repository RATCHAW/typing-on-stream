interface VerificationCodeProps {
  code: string;
}
function VerificationCode({ code }: VerificationCodeProps) {
  return (
    <div className="space-x-[6px] text-white">
      {code.split('').map((code) => (
        <span className="rounded-lg border-2 border-border py-5 px-[14px] text-[12px]">{code}</span>
      ))}
    </div>
  );
}

export default VerificationCode;
