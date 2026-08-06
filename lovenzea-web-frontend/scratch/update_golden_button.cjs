const fs = require('fs');

// MatchProfileCard replacements
const matchProfileCardPath = 'src/components/MatchProfileCard.jsx';
try {
    let content = fs.readFileSync(matchProfileCardPath, 'utf8');
    
    // Replace green background with golden background
    content = content.replace(/'bg-gradient-to-r from-emerald-500 to-teal-500 text-white cursor-not-allowed'/g, "'bg-gradient-to-r from-amber-400 to-amber-600 text-white cursor-not-allowed'");
    
    // Replace the text 'Sent' with '✓ Sent' if it doesn't already have the tick
    // The line looks like: {requestSent || isRequestSent ? 'Sent' : 'Yes'}
    content = content.replace(/'Sent' : 'Yes'/g, "'✓ Sent' : 'Yes'");
    content = content.replace(/'Sent'/g, "'✓ Sent'"); // To catch other instances like line 669 if we missed them
    // Make sure we don't have '✓ ✓ Sent'
    content = content.replace(/✓ ✓ /g, '✓ ');

    fs.writeFileSync(matchProfileCardPath, content);
    console.log(`Updated ${matchProfileCardPath}`);
} catch (e) {
    console.error(e.message);
}

// Dashboard replacements
const dashboardPath = 'src/pages/myshadi/dashboard/Dashboard.jsx';
try {
    let content = fs.readFileSync(dashboardPath, 'utf8');
    
    // Replace the button classes and text
    const oldBtn = `<button disabled className="flex-1 h-9 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-bold shadow-md cursor-not-allowed">
                                                        Interest Sent
                                                    </button>`;
    
    const newBtn = `<button disabled className="flex-1 h-9 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full text-xs font-bold shadow-md cursor-not-allowed flex items-center justify-center gap-1">
                                                        <span className="text-[14px]">✓</span> Interest Sent
                                                    </button>`;
    
    if (content.includes(oldBtn)) {
        content = content.replace(oldBtn, newBtn);
        fs.writeFileSync(dashboardPath, content);
        console.log(`Updated ${dashboardPath}`);
    } else {
        console.log("Could not find the button in Dashboard.jsx. Doing regex replace.");
        // Fallback regex
        content = content.replace(/from-emerald-500 to-teal-500/g, "from-amber-400 to-amber-600");
        content = content.replace(/>\s*Interest Sent\s*<\/button>/g, ' className="flex items-center justify-center gap-1">✓ Interest Sent</button>');
        fs.writeFileSync(dashboardPath, content);
    }
} catch (e) {
    console.error(e.message);
}
