// appyChap Website Protection System - Mild Version
(function() {
    'use strict';
    
    // Only block developer tools, allow normal usage
    let devtools = { open: false, orientation: null };
    
    // Check for developer tools every 1 second
    setInterval(() => {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            if (!devtools.open) {
                devtools.open = true;
                showProtectionMessage();
            }
        } else {
            devtools.open = false;
        }
    }, 1000);
    
    // Block F12 key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') {
            e.preventDefault();
            showProtectionMessage();
        }
    });
    
    // Block Ctrl+Shift+I (Inspect Element)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            showProtectionMessage();
        }
    });
    
    // Block Ctrl+U (View Source)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            showProtectionMessage();
        }
    });
    
    // Show protection message
    function showProtectionMessage() {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.9);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
                color: white;
                text-align: center;
            ">
                <div>
                    <h1 style="color: #F7A42B; font-size: 2rem; margin-bottom: 1rem;">
                        🔒 Skyddad webbplats
                    </h1>
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                        Denna webbplats är skyddad mot obehörig inspektion.
                    </p>
                    <p style="font-size: 1rem; color: #ccc;">
                        Stäng utvecklarverktygen för att fortsätta använda webbplatsen.
                    </p>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="
                                background: #F7A42B; 
                                color: black; 
                                padding: 10px 20px; 
                                border: none; 
                                border-radius: 4px; 
                                cursor: pointer; 
                                margin-top: 20px;
                                font-size: 1rem;
                            ">
                        Stäng meddelande
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(message);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 10000);
    }
    
    // Allow normal website usage
    console.log('Protection system loaded - normal usage allowed');
})();
