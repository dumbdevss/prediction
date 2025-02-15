import TextBlur from "@/components/ui/text-blur";

export default function CTA() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-2">
      <div>
        <TextBlur
          className="text-center text-3xl font-medium tracking-tighter sm:text-5xl"
          text="Predict, Trade, and Profit from Market Intelligence"
        />
      </div>

      <div>
        <TextBlur
          className="mx-auto max-w-[27rem] pt-1.5 text-center text-base text-zinc-300 sm:text-lg"
          text="Join our decentralized prediction market where knowledge meets opportunity"
        />
      </div>
    </div>
  );
}