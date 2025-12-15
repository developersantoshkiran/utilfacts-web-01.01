import React from 'react';
import styles from './herocard.module.scss';

export function HeroCard({ children, title, description, onClick }: { children?: React.ReactNode, title: string, description: string, onClick?: React.MouseEventHandler }) {
    return <div onClick={onClick} className={`${styles.herocard} ${onClick ? styles.herocard_hover : ''}`}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
        <div className={styles.actions}>{children}</div>
    </div>
}

