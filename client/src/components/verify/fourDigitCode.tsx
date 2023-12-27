function FourDigitCode({ code }: { code: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-white text-center font-mono text-2xl mb-32 leading-loose">
        Go to your Twitch channel chat and type the verification code on the screen <br />
        (Expires in 2 minutes)
      </p>

      <p className="space-x-3">
        {code.split('').map((digit, index) => (
          <span className="text-white border-4 rounded-lg text-8xl border-white p-2" key={index}>
            {digit}
          </span>
        ))}
      </p>
    </div>
  );
}

export default FourDigitCode;
