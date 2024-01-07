import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../shadcn/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../shadcn/dialog';
import firstStep from '/images/obs-instructions/first-step.png';
import secondStep from '/images/obs-instructions/second-step.png';
import thirdStep from '/images/obs-instructions/third-step.png';
import QuestionMark from '@/assets/icons/question-mark.svg?react';

function Instructions() {
  return (
    <div>
      <Dialog>
        <p className="text-[8px] text-center leading-4 text-[#767676]">
          for a better experience see{' '}
          <DialogTrigger>
            <span className="text-[#FAC337] underline cursor-pointer">the guide</span>
          </DialogTrigger>
          <br />
          on how to setup the game in obs
        </p>

        <DialogContent className="px-20">
          <DialogHeader>
            <DialogTitle className="text-[12px] text leading-4 text-white flex items-center space-x-3 mb-1">
              <QuestionMark /> <p>HOW TO SETUP THE GAME IN OBS</p>
            </DialogTitle>
            <Carousel className="text-white text-[10px] uppercase">
              <CarouselContent>
                <CarouselItem>
                  <img className="mb-4" src={firstStep} alt="" />
                  <p className="text-center">create a new source</p>
                </CarouselItem>
                <CarouselItem>
                  <img className="mb-4" src={secondStep} alt="" />
                  <p className="text-center">add a browser source</p>
                </CarouselItem>
                <CarouselItem>
                  <img className="mb-4" src={thirdStep} alt="" />
                  <p className="text-center">paste the game link in the url</p>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Instructions;
