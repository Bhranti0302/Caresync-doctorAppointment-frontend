import BannerImage from "../../assets/banner-image.png";
import BannerButton from "../common/Button/BannerButton";

function Banner() {
  return (
    <section
      className="relative w-full rounded-2xl overflow-hidden flex items-center justify-start bg-cover bg-center lg:bg-top"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.2)), url(${BannerImage})`,
      }}
    >
      <div
        className="relative flex flex-col gap-5 sm:gap-8 items-start justify-center 
                      min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] 
                      px-6 sm:px-10 md:px-16 lg:px-24 text-white max-w-[95%] sm:max-w-xl lg:max-w-4xl"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
          Healthcare Made Simple
        </h1>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed drop-shadow-md">
          Schedule doctor visits in seconds, track appointments, and make secure
          payments — all from one easy-to-use dashboard.
        </p>

        <BannerButton />
      </div>
    </section>
  );
}

export default Banner;
