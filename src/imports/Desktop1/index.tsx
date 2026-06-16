import imgImage1 from "./ab50fdb583d0845080b81e307a52183c374e90f9.png";

export default function Desktop() {
  return (
    <div className="bg-white relative size-full" data-name="Desktop - 1">
      <div className="absolute left-[318px] rounded-[324px] size-[742px] top-[70px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[324px] size-full" src={imgImage1} />
      </div>
      <p className="[word-break:break-word] absolute font-['Harlow_Solid_Italic:Italic',sans-serif] h-[64px] italic leading-[normal] left-[504px] opacity-62 text-[#6f98c0] text-[80px] top-[846px] w-[781px]">click to enter</p>
    </div>
  );
}