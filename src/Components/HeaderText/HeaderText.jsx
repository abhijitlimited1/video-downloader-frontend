import styles from "./HeaderText.module.css";

function HeaderText() {
  return (
    <>
      <h1 className={styles.header}>Video Downloader</h1>
      <p className={styles.p}>
        To download any video paste Your video URL in input section then click
        on GET Download Link.After that click on download video button{" "}
      </p>
    </>
  );
}

export default HeaderText;
