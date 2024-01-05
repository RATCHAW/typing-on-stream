import VerificationStep from '@/components/atoms/verificationStep';
import catTyping from '/emotes/catTyping.gif';
import peepoBlush from '/emotes/peepoBlush.gif';
import peepoCongrats from '/emotes/peepoCongrats.gif';

interface StepsCardsProps {
  activeStep: number;
}

function StepsCards({ activeStep }: StepsCardsProps) {
  return (
    <div className="flex space-x-8 mb-12">
      <VerificationStep emoteSrc={catTyping} active={activeStep === 1}>
        enter your channel‘s <br /> name on twitch to get <br /> a verification code
      </VerificationStep>
      <VerificationStep emoteSrc={peepoBlush} active={activeStep === 2} lowOpacity={activeStep < 2}>
        type the verification code in chat to <br /> activate the session
      </VerificationStep>
      <VerificationStep emoteSrc={peepoCongrats} active={activeStep === 3} lowOpacity={activeStep !== 3}>
        congrats you can play <br /> our game with your <br /> chat now
      </VerificationStep>
    </div>
  );
}

export default StepsCards;
