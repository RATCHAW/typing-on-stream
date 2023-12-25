

function FourDigitCode({ code }: { code: string }) {
  return (
    <p className="space-x-3">
      {code.split("").map((digit, index) => (
        <span
          className="text-white border-2 rounded-lg text-8xl border-white p-2"
          key={index}
        >
          {digit}
        </span>
      ))}
    </p>
  );
}

export default FourDigitCode;
