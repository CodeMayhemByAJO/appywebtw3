// appyChap Website Protection System
(function() {
    'use strict';
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showProtectionMessage();
    });
    
    // Disable F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J')
        ) {
            e.preventDefault();
            showProtectionMessage();
        }
    });
    
    // Disable view source
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            showProtectionMessage();
        }
    });
    
    // Disable developer tools detection
    let devtools = { open: false, orientation: null };
    setInterval(() => {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            if (!devtools.open) {
                devtools.open = true;
                showProtectionMessage();
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // Disable console access
    const disableConsole = () => {
        const methods = ['log', 'info', 'warn', 'error', 'debug', 'table', 'trace'];
        methods.forEach(method => {
            console[method] = function() {
                showProtectionMessage();
                return false;
            };
        });
    };
    
    // Disable console methods
    Object.defineProperty(window, 'console', {
        get: function() {
            return {
                log: function() { showProtectionMessage(); },
                info: function() { showProtectionMessage(); },
                warn: function() { showProtectionMessage(); },
                error: function() { showProtectionMessage(); },
                debug: function() { showProtectionMessage(); },
                table: function() { showProtectionMessage(); },
                trace: function() { showProtectionMessage(); }
            };
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
                background: rgba(0,0,0,0.95);
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
                        Om du behöver komma åt utvecklarverktyg, kontakta webbplatsens ägare.
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }
    
    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
    
    // Disable copy
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        showProtectionMessage();
    });
    
    // Disable cut
    document.addEventListener('cut', function(e) {
        e.preventDefault();
        showProtectionMessage();
    });
    
    // Disable paste
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        showProtectionMessage();
    });
    
    // Disable save page
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showProtectionMessage();
        }
    });
    
    // Initialize protection
    disableConsole();
    
    // Additional protection: disable inspect element
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            showProtectionMessage();
        }
    });
    
    console.log('Protection system activated');
})();
