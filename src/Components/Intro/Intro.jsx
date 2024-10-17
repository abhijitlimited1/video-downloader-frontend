import Styles from "./Intro.module.css";

function Intro() {
  return (
    <div className={Styles.container}>
      <h1 className={Styles.header}>Introduction</h1>
      <p className={Styles.text}>
        Welcome to your ultimate destination for effortless video downloads!
        Whether it's YouTube, Vimeo, or other popular platforms, we make it easy
        for you to grab your favorite videos in just a few clicks. Our simple,
        user-friendly interface allows you to validate URLs, download videos in
        high quality, and monitor progress in real time. No need to worry about
        complex tools just paste the link, and let us handle the rest. Whether
        you're building a media library or need content for offline viewing.
      </p>
    </div>
  );
}

export default Intro;
