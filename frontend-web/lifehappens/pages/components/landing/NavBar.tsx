import React from "react";
import TouchableOpacity from "../../native/TouchableOpacity";

import styles from '@/styles/components/landing/NavBar.module.css'

interface NavProps {
    navigateToSignUp: () => void;
    navigateToLogin: () => void;
    navigateToLanding: () => void;
}
const NavBar: React.FC<NavProps> = ({ navigateToLanding, navigateToSignUp, navigateToLogin }) => {
    return (
        <div className={styles.navBar}>
            <TouchableOpacity style={styles.navButton} onClick={navigateToLanding}>
                <p className={styles.navButtonText}>Landing</p>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onClick={navigateToSignUp}>
                <p className={styles.navButtonText}>Sign Up</p>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onClick={navigateToLogin}>
                <p className={styles.navButtonText}>Login</p>
            </TouchableOpacity>
        </div>
    );
};

export default NavBar;
