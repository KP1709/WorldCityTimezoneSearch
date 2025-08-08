import { useContext } from "react";
import './styles/reloadModal.css';
import './styles/globalModalStyles.css'
import { DarkModeContext, type DarkModeContextType } from "../context/DarkModeContext";

function ReloadModal({ setReloadRequired }: { setReloadRequired: (value: boolean) => void }) {
    const { darkMode } = useContext(DarkModeContext) as DarkModeContextType;

    return (
        <dialog className={darkMode ? 'modal-overlay light-modal ' : 'modal-overlay dark-modal'}>
            <div className="modal-content">
                <p>Changing theme requires a reload for it to be applied properly</p>
                <button id='reload-btn' onClick={() => { window.location.reload(); setReloadRequired(false); }}>Reload</button>
            </div>
        </dialog>
    );
}

export default ReloadModal