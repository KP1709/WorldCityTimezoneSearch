import './styles/reloadModal.css';
import './styles/globalModalStyles.css'

function ReloadModal({ setReloadRequired }: { setReloadRequired: (value: boolean) => void }) {
    return (
        <div className='modal-overlay'>
            <div className="modal-main">
                <p>Changing theme requires a reload for it to be applied properly</p>
                <button id='reload-btn' onClick={() => { window.location.reload(); setReloadRequired(false); }}>Reload</button>
            </div>
        </div>
    );
}

export default ReloadModal