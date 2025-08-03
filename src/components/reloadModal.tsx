import { useContext } from "react";
import './styles/reloadModal.css';
import { DarkModeContext, type DarkModeContextType } from "../context/DarkModeContext";

function ReloadModal({ setReloadRequired }: { setReloadRequired: (value: boolean) => void }) {
    const { darkMode } = useContext(DarkModeContext) as DarkModeContextType;

    return (
        <div id="reload-modal" className={darkMode ? 'light-modal' : 'dark-modal'}>
            <p>Changing theme requires a reload for it to be applied properly</p>
            <button id='reload-btn' onClick={() => { window.location.reload(); setReloadRequired(false); }}>Reload</button>
        </div>
    );
}

export default ReloadModal