import styles from './style.module.css';
export default function Footer() {
  return (
    // TODO: background color
    <section className="flex-shrink-0">
      <div className={`${styles.footer}`}>
        <span>Schrödinger@2024</span>
      </div>
    </section>
  );
}
