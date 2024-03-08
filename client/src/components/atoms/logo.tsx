import { cn } from '@/lib/utils';

function Logo({ className }: { className?: string }) {
  return <div className={cn('colorful w-fit text-transparent bg-clip-text text-[32px]', className)}>TWITCH-CATCH</div>;
}

export default Logo;
