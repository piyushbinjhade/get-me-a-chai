import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center text-white h-[44vh] px-5 md:px-0  text-xs md:text-base">
        <div className=" flex gap-3 md:gap-20 md:text-5xl justify-center items-center font-bold text-3xl">Buy Me a Chai <span><Image className="invertImg" src="/tea.gif" width={88} height={88} alt="Tea" priority /></span></div>
        <p className="font-bold text-center md:text-left">
          A crowdfunding platform for creators. Get funded by your fans and followers. Start now!
        </p>
        <p className="font-bold text-center md:text-left">
          A place where your fans can but you a chai. Unleash the power of your fans and get your projects funded. 
        </p>
        <div>
          
          <Link href={"/login"}>
          <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Start Here</button></Link>
          <Link href={"/about"}>
          <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Read More</button></Link>

        </div>
      </div>
      <div className="bg-white h-1 opacity-10">
      </div>

      <div className="text-white container pb-32 pt-14 mx-auto px-10">
        <h2 className="text-3xl font-bold text-center mb-14">Your Fans can buy you a Chai</h2>
        <div className="flex gap-5 justify-around ">
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image className="bg-slate-400 rounded-full p-2 text-black" width={88} height={88} src="/man.gif" alt="Man" />
            <p className="font-bold text-center">Your fans are available for you to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image className="bg-slate-400 rounded-full p-2 text-black" width={88} height={88} src="/coin.gif" alt="Coin" />
            <p className="font-bold text-center">Your fans are available for you to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image className="bg-slate-400 rounded-full p-2 text-black" width={88} height={88} src="/group.gif" alt="Group" />
            
            <p className="font-bold text-center">Your fans are available for you to help you</p>
          </div>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10">
      </div>

      <div className="text-white container pb-32 pt-14 mx-auto flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-center mb-14">Learn more about us</h2>
        <div className="w-[90%] h-[40vh] md:w-[50%] md:h-[40vh] lg:w-[50%] lg:h-[40vh] xl:w-[50%] xl:h-[40vh] ">
        <iframe className="w-full h-full" src="https://www.youtube.com/embed/5IwmuaKE7tA?si=fupFd-5XV2eOFMsh" title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </div>
    </>
  );
}
