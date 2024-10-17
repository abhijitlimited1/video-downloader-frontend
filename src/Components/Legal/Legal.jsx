import styles from "./Legal.module.css";

function Legal() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>
        Is It Legal to Download Videos from Social Media Platforms?
      </h1>
      <p className={styles.text}>
        <span className={styles.option}>1. Personal vs. Commercial Use:</span>
        When downloading videos for personal offline use, it is typically not
        illegal. You are simply using the content for your own enjoyment or
        convenience, which generally doesn't infringe on copyright laws.
        However, this changes if the videos are being used for commercial
        purposes. Using someone else’s video content for profit without
        permission is a clear violation of copyright laws and could lead to
        serious legal consequences. IMPORTANT: We do not support downloading
        copyrighted videos for commercial purposes. Our tool is designed solely
        for personal use and does not encourage or condone the illegal
        distribution of content.
      </p>
      <p className={styles.text}>
        <span className={styles.option}>2. Violating Platform Terms:</span>
        Downloading videos can also violate the terms of service set by
        platforms like Facebook, Instagram, or YouTube. For example, Google,
        which owns YouTube, discourages users from downloading videos unless it
        is through an official download feature like YouTube Premium.
        Downloading videos outside of these options could breach their terms and
        could potentially harm creators by reducing ad revenue.
      </p>
      <p className={styles.text}>
        <span className={styles.option}>3. Why Is This Important?</span>
        Video-sharing platforms earn revenue through ads, and content creators
        often rely on this income as well. By downloading videos to watch
        offline, especially if they are monetized, you might be taking away from
        the creator's earnings and Google's ad revenue. But there are legitimate
        reasons for downloading videos, right?
      </p>
      <p className={styles.text}>
        <span className={styles.option}>
          4. Educational or Personal Convenience:
        </span>
        There are times when downloading videos can be beneficial, such as for
        educational purposes. Many educational institutions encourage eLearning,
        and platforms like Facebook or YouTube host valuable learning resources.
        Downloading these videos for personal use can allow you to re-watch them
        without consuming additional data every time. In summary, while personal
        downloads for offline viewing might be acceptable, it’s crucial to
        respect the content’s copyright and the platform’s terms of service.
        Always ensure you’re downloading videos responsibly!
      </p>
    </div>
  );
}

export default Legal;
