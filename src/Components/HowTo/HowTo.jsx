import styles from "./HowTo.module.css";

function HowTo() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>How to Download a Video</h1>
      <p className={styles.text}>
        Downloading videos with is quick and easy! Follow these simple steps to
        get your favorite videos:
      </p>
      <ul className={styles.parent}>
        <li className={styles.li}>
          <span className={styles.question}> 1.Copy the Video URL:</span>
          <p>
            Go to the video platform (like YouTube or Vimeo) and copy the link
            of the video you want to download.
          </p>
        </li>
        <li className={styles.li}>
          <span className={styles.question}> 2.Paste the URL:</span>
          <p>In the input box on paste the copied video link.</p>
        </li>
        <li className={styles.li}>
          <span className={styles.question}> 3.Validate the Video: </span>
          <p>
            Click the "Get Download Link" button. Our tool will check the link
            to ensure it's valid and retrieve the video details.
          </p>
        </li>
        <li className={styles.li}>
          <span className={styles.question}> 4.Download the Video: </span>
          <p>
            Once validated, a download button will appear. Click on "📥 Download
            Video" to start the download process.
          </p>
        </li>
        <li className={styles.li}>
          <span className={styles.question}> 5.Monitor the Progress: </span>
          <p>
            You can watch the download progress in real time. Once the download
            is complete, your video will be saved to your device.
          </p>
        </li>
      </ul>
      <p className={styles.text}>
        It's that easy! Enjoy your videos offline anytime, anywhere.
      </p>
    </div>
  );
}

export default HowTo;
