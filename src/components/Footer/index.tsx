import styles from './style.module.css';
export default function Footer() {
  return (
    <section className="bg-[#FAFAFA] flex-shrink-0">
      <div className={`${styles.footer}`}>
        <span>Schrödinger@2024</span>
      </div>
    </section>
  );
}
